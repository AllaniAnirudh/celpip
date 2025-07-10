'use client'

import { useState, useEffect, useRef } from 'react'
import { Clock, FileText, Save, Send, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface WritingInterfaceProps {
  taskType: 'email' | 'survey'
  prompt: string
  timeLimit: number // in seconds
  wordTarget: { min: number; max: number }
  onSubmit: (data: {
    response: string
    wordCount: number
    timeSpent: number
  }) => void
  onTryAnotherTask?: () => void
  isSignedIn?: boolean
  hasUsedFreeAttempt?: boolean
}

export default function WritingInterface({
  taskType,
  prompt,
  timeLimit,
  wordTarget,
  onSubmit,
  onTryAnotherTask,
  isSignedIn = false,
  hasUsedFreeAttempt = false,
}: WritingInterfaceProps) {
  const [response, setResponse] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(timeLimit) // timeLimit is already in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testInProgress, setTestInProgress] = useState(false)
  const [showNavigationWarning, setShowNavigationWarning] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  const wordCount = response.trim().split(/\s+/).filter(word => word.length > 0).length

  // Auto-save functionality
  useEffect(() => {
    if (response && isTimerRunning) {
      const saveInterval = setInterval(() => {
        localStorage.setItem(`celpip-draft-${taskType}`, response)
        setLastSaved(new Date())
      }, 30000) // Save every 30 seconds

      return () => clearInterval(saveInterval)
    }
  }, [response, isTimerRunning, taskType])

  // Load saved draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(`celpip-draft-${taskType}`)
    if (savedDraft) {
      setResponse(savedDraft)
    }
  }, [taskType])

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false)
            toast.error('Time is up! Submitting your response...')
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning, timeRemaining])

  // Navigation protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (testInProgress && !isSubmitting) {
        e.preventDefault()
        e.returnValue = 'Are you sure you want to quit? Your writing progress will be lost.'
        return e.returnValue
      }
    }

    const handlePopState = (e: PopStateEvent) => {
      if (testInProgress && !isSubmitting) {
        e.preventDefault()
        setShowNavigationWarning(true)
        setPendingNavigation('/')
        // Push the current state back to prevent navigation
        window.history.pushState(null, '', window.location.href)
      }
    }

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)

    // Push initial state to enable popstate detection
    window.history.pushState(null, '', window.location.href)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [testInProgress, isSubmitting])

  // Start timer when user starts typing
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setResponse(newValue)

    if (!isTimerRunning && newValue.length > 0) {
      setIsTimerRunning(true)
      setStartTime(Date.now())
      setTestInProgress(true) // Mark test as in progress
    }
  }

  const handleSubmit = async () => {
    if (!response.trim()) {
      toast.error('Please write your response before submitting.')
      return
    }

    if (wordCount < wordTarget.min || wordCount > wordTarget.max) {
      toast.error(`Your response should be between ${wordTarget.min} and ${wordTarget.max} words.`)
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit({
        response: response.trim(),
        wordCount,
        timeSpent: startTime ? Math.floor((Date.now() - startTime) / 1000) : 0
      })
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Failed to submit response. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNavigationConfirm = () => {
    setTestInProgress(false)
    setShowNavigationWarning(false)
    if (pendingNavigation) {
      router.push(pendingNavigation)
      setPendingNavigation(null)
    }
  }

  const handleNavigationCancel = () => {
    setShowNavigationWarning(false)
    setPendingNavigation(null)
  }

  // Custom link handler for internal navigation
  const handleLinkClick = (href: string) => {
    if (testInProgress && !isSubmitting) {
      setShowNavigationWarning(true)
      setPendingNavigation(href)
      return false
    }
    return true
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getWordCountColor = () => {
    if (wordCount < wordTarget.min) return 'text-red-600'
    if (wordCount > wordTarget.max) return 'text-orange-600'
    return 'text-green-600'
  }

  const getTimeColor = () => {
    if (timeRemaining <= 300) return 'text-red-600 timer-warning' // 5 minutes or less
    if (timeRemaining <= 600) return 'text-orange-600' // 10 minutes or less
    return 'text-gray-600'
  }

  const handleTryAnotherTask = () => {
    console.log('handleTryAnotherTask called')
    console.log('isSignedIn:', isSignedIn)
    console.log('hasUsedFreeAttempt:', hasUsedFreeAttempt)
    
    if (isSignedIn || !hasUsedFreeAttempt) {
      console.log('Calling onTryAnotherTask')
      if (onTryAnotherTask) {
        onTryAnotherTask()
      }
    } else {
      console.log('Redirecting to pay page')
      router.push('/pay')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => {
                  if (handleLinkClick('/')) {
                    router.push('/')
                  }
                }}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Test In Progress Badge */}
              {testInProgress && (
                <div className="flex items-center text-sm bg-green-50 px-3 py-1 rounded-full border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-green-700 font-medium">Test In Progress</span>
                </div>
              )}

              {/* Timer */}
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span className={getTimeColor()}>
                  {formatTime(timeRemaining)}
                </span>
              </div>

              {/* Word Count */}
              <div className="flex items-center text-sm">
                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                <span className={getWordCountColor()}>
                  {wordCount} words
                </span>
              </div>

              {/* Save Status */}
              {lastSaved && (
                <div className="text-xs text-gray-500">
                  Saved {lastSaved.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Prompt */}
          <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-6">
              {taskType === 'email' ? 'Email Writing Task' : 'Survey Response Task'}
            </h2>
            
            <div className="prose max-w-none">
              <div className="bg-gray-50 rounded-lg p-4 lg:p-6 mb-6">
                <h3 className="text-sm lg:text-base font-medium text-gray-700 mb-3">Instructions:</h3>
                <p className="text-sm lg:text-base text-gray-600 mb-4">
                  {taskType === 'email' 
                    ? 'Write a formal or informal email in response to the situation below. Include proper greeting and closing.'
                    : 'Respond to the survey questions below with detailed answers. Support your opinions with examples.'
                  }
                </p>
                <div className="text-sm lg:text-base text-gray-600 space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-celpip-500 rounded-full mr-3"></div>
                    Time limit: {Math.floor(timeLimit / 60)} minutes
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-celpip-500 rounded-full mr-3"></div>
                    Write {wordTarget.min}–{wordTarget.max} words
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-celpip-500 rounded-full mr-3"></div>
                    Address all points in the prompt
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 lg:p-6">
                <h3 className="text-sm lg:text-base font-medium text-blue-800 mb-3">Prompt:</h3>
                <div className="text-sm lg:text-base text-blue-700 whitespace-pre-wrap leading-relaxed">
                  {prompt}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Editor */}
          <div className="bg-white rounded-lg shadow-lg flex flex-col">
            <div className="p-6 lg:p-8 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg lg:text-xl font-medium text-gray-900">Your Response</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      localStorage.setItem(`celpip-draft-${taskType}`, response)
                      setLastSaved(new Date())
                      toast.success('Draft saved!')
                    }}
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-100"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <textarea
                  ref={textareaRef}
                  value={response}
                  onChange={handleTextChange}
                  placeholder="Start writing your response here..."
                  className="flex-1 w-full min-h-[500px] lg:min-h-[600px] xl:min-h-[700px] p-4 lg:p-6 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-celpip-500 focus:border-transparent editor-container text-gray-900 bg-white text-sm lg:text-base leading-relaxed"
                  disabled={isSubmitting}
                />

                {/* Word Count Status */}
                <div className="mt-4 text-center">
                  <div className="text-sm">
                    {wordCount < wordTarget.min && (
                      <span className="text-red-600 font-medium">
                        Write at least {wordTarget.min - wordCount} more words
                      </span>
                    )}
                    {wordCount >= wordTarget.min && wordCount <= wordTarget.max && (
                      <span className="text-green-600 font-medium">
                        Good length! ({wordCount} words)
                      </span>
                    )}
                    {wordCount > wordTarget.max && (
                      <span className="text-orange-600 font-medium">
                        Consider shortening your response ({wordCount} words)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Instructions before buttons */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 font-medium">
                  Write {wordTarget.min}–{wordTarget.max} words
                </p>
              </div>

              {/* Control Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleTryAnotherTask}
                  className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-celpip-500 transition-colors text-sm font-medium w-full sm:w-auto"
                >
                  Try Another Task
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || wordCount < wordTarget.min}
                  className="flex items-center justify-center px-8 py-3 bg-celpip-600 text-white rounded-md hover:bg-celpip-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-celpip-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm lg:text-base font-medium w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Response
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Warning Modal */}
      {showNavigationWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Quit Test?</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to quit? Your writing progress will be lost.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleNavigationCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-celpip-500 transition-colors"
              >
                Stay on Page
              </button>
              <button
                onClick={handleNavigationConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Quit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 