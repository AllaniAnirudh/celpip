'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { Mail, FileText, ArrowLeft, Clock, Target } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

interface Attempt {
  id: string
  taskType: 'email' | 'survey'
  prompt: string
  response: string
  score: {
    overall: number
    grammar: number
    vocabulary: number
    coherence: number
    taskRelevance: number
    feedback: string
    improvementTips: string[]
  }
  wordCount: number
  timeSpent: number
  createdAt: string
}

export default function FeedbackPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/attempts/${params.id}`)
        
        if (!response.ok) {
          throw new Error('Attempt not found')
        }
        
        const data = await response.json()
        setAttempt(data)
      } catch (err) {
        console.error('Error fetching attempt:', err)
        setError('Failed to load attempt details')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchAttempt()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-celpip-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading feedback...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Attempt Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The requested attempt could not be found.'}</p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-celpip-600 hover:bg-celpip-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {attempt.taskType === 'email' ? 'Email Writing' : 'Survey Response'} Feedback
              </h1>
              <p className="text-gray-600">
                Submitted on {formatDate(attempt.createdAt)}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-celpip-600">
                {attempt.score.overall}/11
              </div>
              <p className="text-sm text-gray-500">Overall Score</p>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Score Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-celpip-600">{attempt.score.grammar}</div>
              <p className="text-sm text-gray-600">Grammar</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-celpip-600">{attempt.score.vocabulary}</div>
              <p className="text-sm text-gray-600">Vocabulary</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-celpip-600">{attempt.score.coherence}</div>
              <p className="text-sm text-gray-600">Coherence</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-celpip-600">{attempt.score.taskRelevance}</div>
              <p className="text-sm text-gray-600">Task Relevance</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Target className="h-6 w-6 text-celpip-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Word Count</p>
                <p className="text-2xl font-bold text-gray-900">{attempt.wordCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-celpip-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Time Spent</p>
                <p className="text-2xl font-bold text-gray-900">{formatTime(attempt.timeSpent)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-celpip-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Task Type</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">{attempt.taskType}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prompt and Response */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Prompt */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Writing Prompt</h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{attempt.prompt}</p>
            </div>
          </div>

          {/* Response */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Response</h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{attempt.response}</p>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Feedback</h2>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 mb-6">{attempt.score.feedback}</p>
            
            {attempt.score.improvementTips && attempt.score.improvementTips.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Improvement Tips</h3>
                <ul className="space-y-2">
                  {attempt.score.improvementTips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-celpip-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/practice"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-celpip-600 hover:bg-celpip-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-celpip-500 transition-colors"
          >
            <FileText className="mr-2 h-4 w-4" />
            Try Another Task
          </Link>
          <Link
            href="/tips"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-celpip-500 transition-colors"
          >
            View Writing Tips
          </Link>
        </div>
      </div>
    </div>
  )
} 