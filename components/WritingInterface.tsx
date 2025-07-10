'use client'

import { useState, useEffect, useRef } from 'react'
import { Clock, FileText, Save, Send, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface WritingInterfaceProps {
  taskType: 'email' | 'survey'
  prompt: string
  timeLimit: number // in minutes
  wordTarget: { min: number; max: number }
  onSubmit: (data: {
    response: string
    wordCount: number
    timeSpent: number
  }) => void
}

export default function WritingInterface({
  taskType,
  prompt,
  timeLimit,
  wordTarget,
  onSubmit,
}: WritingInterfaceProps) {
  const [response, setResponse] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60) // Convert to seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  // Start timer when user starts typing
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setResponse(newValue)

    if (!isTimerRunning && newValue.length > 0) {
      setIsTimerRunning(true)
      setStartTime(Date.now())
    }
  }

  const handleSubmit = async () => {
    if (!response.trim()) {
      toast.error('Please write something before submitting')
      return
    }

    if (wordCount < wordTarget.min) {
      toast.error(`Please write at least ${wordTarget.min} words`)
      return
    }

    setIsSubmitting(true)
    setIsTimerRunning(false)

    const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0

    try {
      await onSubmit({
        response: response.trim(),
        wordCount,
        timeSpent,
      })

      // Clear saved draft after successful submission
      localStorage.removeItem(`celpip-draft-${taskType}`)
    } catch (error) {
      toast.error('Failed to submit. Please try again.')
      setIsSubmitting(false)
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Word Count */}
              <div className="flex items-center text-sm">
                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                <span className={getWordCountColor()}>
                  {wordCount} / {wordTarget.min}-{wordTarget.max} words
                </span>
              </div>

              {/* Timer */}
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span className={getTimeColor()}>
                  {formatTime(timeRemaining)}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Prompt */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {taskType === 'email' ? 'Email Writing Task' : 'Survey Response Task'}
            </h2>
            
            <div className="prose max-w-none">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Instructions:</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {taskType === 'email' 
                    ? 'Write a formal or informal email in response to the situation below. Include proper greeting and closing.'
                    : 'Respond to the survey questions below with detailed answers. Support your opinions with examples.'
                  }
                </p>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-celpip-500 rounded-full mr-2"></div>
                    Write {wordTarget.min}-{wordTarget.max} words
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-celpip-500 rounded-full mr-2"></div>
                    Time limit: {timeLimit} minutes
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-celpip-500 rounded-full mr-2"></div>
                    Address all points in the prompt
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Prompt:</h3>
                <div className="text-sm text-blue-700 whitespace-pre-wrap">
                  {prompt}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Editor */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Your Response</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      localStorage.setItem(`celpip-draft-${taskType}`, response)
                      setLastSaved(new Date())
                      toast.success('Draft saved!')
                    }}
                    className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </button>
                </div>
              </div>

              <textarea
                ref={textareaRef}
                value={response}
                onChange={handleTextChange}
                placeholder="Start writing your response here..."
                className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-celpip-500 focus:border-transparent editor-container text-gray-900 bg-white"
                disabled={isSubmitting}
              />

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {wordCount < wordTarget.min && (
                    <span className="text-red-600">
                      Write at least {wordTarget.min - wordCount} more words
                    </span>
                  )}
                  {wordCount >= wordTarget.min && wordCount <= wordTarget.max && (
                    <span className="text-green-600">
                      Good length! ({wordCount} words)
                    </span>
                  )}
                  {wordCount > wordTarget.max && (
                    <span className="text-orange-600">
                      Consider shortening your response
                    </span>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || wordCount < wordTarget.min}
                  className="flex items-center px-6 py-2 bg-celpip-600 text-white rounded-md hover:bg-celpip-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-celpip-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
    </div>
  )
} 