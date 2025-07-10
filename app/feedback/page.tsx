'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Navigation from '@/components/Navigation'
import { ArrowLeft, FileText, Clock, Target, Star, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface FeedbackData {
  taskType: 'email' | 'survey'
  prompt: string
  response: string
  wordCount: number
  timeSpent: number
  score: {
    overall: number
    grammar: number
    vocabulary: number
    coherence: number
    taskRelevance: number
    feedback: string
    improvementTips: string[]
  }
}

export default function FeedbackPage() {
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null)
  const [user, setUser] = useState<any>(null)
  const [hasUsedFreeTest, setHasUsedFreeTest] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get user session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    // Check if user has used free test
    const checkFreeTestUsage = async () => {
      if (user) {
        // Check from database for signed-in users
        const { data, error } = await supabase
          .from('users')
          .select('has_used_free_test')
          .eq('id', user.id)
          .single()
        
        if (!error && data) {
          setHasUsedFreeTest(data.has_used_free_test)
        }
      } else {
        // Check localStorage for guest users
        const freeTestUsed = localStorage.getItem('celpip-free-test-used')
        setHasUsedFreeTest(freeTestUsed === 'true')
      }
    }

    checkFreeTestUsage()

    // Get feedback data from API or localStorage
    const attemptId = searchParams.get('attempt')
    if (attemptId) {
      // Try to fetch from API
      fetch(`/api/attempts?id=${attemptId}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.attempt) {
            setFeedbackData(data.attempt)
          } else {
            // Fallback to localStorage (legacy/guest)
            const storedAttempts = localStorage.getItem('celpip-attempts')
            if (storedAttempts) {
              const attempts = JSON.parse(storedAttempts)
              const attempt = attempts.find((a: any) => a.id === attemptId)
              if (attempt) {
                setFeedbackData(attempt)
              }
            }
          }
          setLoading(false)
        })
        .catch(() => {
          // Fallback to localStorage on error
          const storedAttempts = localStorage.getItem('celpip-attempts')
          if (storedAttempts) {
            const attempts = JSON.parse(storedAttempts)
            const attempt = attempts.find((a: any) => a.id === attemptId)
            if (attempt) {
              setFeedbackData(attempt)
            }
          }
          setLoading(false)
        })
    } else {
      // Get the most recent attempt from localStorage
      const storedAttempts = localStorage.getItem('celpip-attempts')
      if (storedAttempts) {
        const attempts = JSON.parse(storedAttempts)
        if (attempts.length > 0) {
          setFeedbackData(attempts[attempts.length - 1])
        }
      }
      setLoading(false)
    }

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [user, searchParams])

  const handleTryAnotherTask = () => {
    if (hasUsedFreeTest) {
      router.push('/pay')
    } else {
      router.push('/practice')
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (score >= 6) return <AlertCircle className="h-5 w-5 text-yellow-600" />
    return <AlertCircle className="h-5 w-5 text-red-600" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-celpip-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your feedback...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!feedbackData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No Feedback Available</h1>
            <p className="text-gray-600 mb-8">We couldn't find your writing attempt. Please try submitting a new task.</p>
            <Link
              href="/practice"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-celpip-600 hover:bg-celpip-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-celpip-500 transition-colors"
            >
              Start New Task
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Writing Feedback</h1>
          <p className="text-gray-600">
            {feedbackData.taskType === 'email' ? 'Email Writing Task' : 'Survey Response Task'}
          </p>
        </div>

        {/* Score Overview */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className={`px-6 py-4 ${feedbackData.taskType === 'email' ? 'bg-celpip-600' : 'bg-green-600'} text-white`}>
            <h2 className="text-xl font-bold">Score Overview</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${getScoreColor(feedbackData.score.overall)}`}>
                  {feedbackData.score.overall}
                </div>
                <div className="text-sm text-gray-600">Overall</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${getScoreColor(feedbackData.score.grammar)}`}>
                  {feedbackData.score.grammar}
                </div>
                <div className="text-sm text-gray-600">Grammar</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${getScoreColor(feedbackData.score.vocabulary)}`}>
                  {feedbackData.score.vocabulary}
                </div>
                <div className="text-sm text-gray-600">Vocabulary</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${getScoreColor(feedbackData.score.coherence)}`}>
                  {feedbackData.score.coherence}
                </div>
                <div className="text-sm text-gray-600">Coherence</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${getScoreColor(feedbackData.score.taskRelevance)}`}>
                  {feedbackData.score.taskRelevance}
                </div>
                <div className="text-sm text-gray-600">Task Relevance</div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Target className="h-6 w-6 text-celpip-600 mr-3" />
                <div>
                  <div className="text-lg font-semibold text-gray-900">{feedbackData.wordCount}</div>
                  <div className="text-sm text-gray-600">Words Written</div>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.floor(feedbackData.timeSpent / 60)}:{(feedbackData.timeSpent % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600">Time Spent</div>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Star className="h-6 w-6 text-purple-600 mr-3" />
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.round((feedbackData.wordCount / feedbackData.timeSpent) * 60)} wpm
                  </div>
                  <div className="text-sm text-gray-600">Writing Speed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Original Prompt */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gray-100 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Original Prompt</h2>
          </div>
          <div className="p-6">
            <div className="text-gray-700 whitespace-pre-wrap">
              {feedbackData.prompt}
            </div>
          </div>
        </div>

        {/* Your Response */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gray-100 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Your Response</h2>
          </div>
          <div className="p-6">
            <div className="text-gray-700 whitespace-pre-wrap">
              {feedbackData.response}
            </div>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 bg-blue-100 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Detailed Feedback</h2>
          </div>
          <div className="p-6">
            <div className="text-gray-700 whitespace-pre-wrap">
              {feedbackData.score.feedback}
            </div>
          </div>
        </div>

        {/* Improvement Tips */}
        {feedbackData.score.improvementTips && feedbackData.score.improvementTips.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="px-6 py-4 bg-green-100 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Improvement Tips</h2>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {feedbackData.score.improvementTips.map((tip: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleTryAnotherTask}
            className="flex-1 px-6 py-3 bg-celpip-600 text-white rounded-md hover:bg-celpip-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-celpip-500 transition-colors"
          >
            {hasUsedFreeTest ? 'Unlock More Tasks' : 'Try Another Task'}
          </button>
          <Link
            href="/"
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-celpip-500 transition-colors text-center"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
} 