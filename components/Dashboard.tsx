'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Mail, FileText, BarChart3, Clock, Target } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface Stats {
  totalAttempts: number
  averageScore: number
  timePracticed: number
  wordsWritten: number
  recentAttempts: any[]
}

export default function Dashboard() {
  const { user, loading, hasUsedFreeTest } = useAuth()
  const [stats, setStats] = useState<Stats>({
    totalAttempts: 0,
    averageScore: 0,
    timePracticed: 0,
    wordsWritten: 0,
    recentAttempts: []
  })
  const [statsLoading, setStatsLoading] = useState(true)
  const [authTransition, setAuthTransition] = useState(false)
  const [lastUserState, setLastUserState] = useState<string | null>(null)

  // Function to fetch user statistics
  const fetchUserStats = async () => {
    try {
      setStatsLoading(true)
      console.log('Fetching stats for user:', user?.id || 'guest')
      
      const response = await fetch('/api/stats', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      if (response.ok) {
        const data = await response.json()
        console.log('Received stats:', data)
        setStats(data)
      } else {
        console.error('Failed to fetch stats:', response.status)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  // Fetch stats on mount and when auth state changes
  useEffect(() => {
    if (!loading) {
      const currentUserState = user?.id || 'guest'
      
      // Only refresh if user state actually changed
      if (lastUserState !== currentUserState) {
        console.log('User state changed from', lastUserState, 'to', currentUserState)
        setLastUserState(currentUserState)
        
        // Add a small delay to show transition animation
        setAuthTransition(true)
        setTimeout(() => {
          fetchUserStats()
          setAuthTransition(false)
        }, 300)
      } else if (lastUserState === null) {
        // Initial load
        setLastUserState(currentUserState)
        fetchUserStats()
      }
    }
  }, [loading, user, lastUserState])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-celpip-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-opacity duration-300 ${authTransition ? 'opacity-50' : 'opacity-100'}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to CELPIP Writing Practice!
        </h1>
        <p className="text-gray-600 mb-6">
          Practice your CELPIP Writing skills with AI-powered feedback
          {user && (
            <span className="block text-sm text-celpip-600 mt-1">
              Signed in as: {user.email}
            </span>
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          {hasUsedFreeTest ? (
            <Link
              href="/pay"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-celpip-600 hover:bg-celpip-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-celpip-500 transition-colors"
            >
              Unlock More Tests
              <FileText className="ml-2 h-4 w-4" />
            </Link>
          ) : (
            <Link
              href="/practice"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-celpip-600 hover:bg-celpip-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-celpip-500 transition-colors"
            >
              Start Practice
              <FileText className="ml-2 h-4 w-4" />
            </Link>
          )}
          <Link
            href="/tips"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-celpip-500 transition-colors"
          >
            View Writing Tips
            <FileText className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-celpip-100 rounded-lg">
              <Target className="h-6 w-6 text-celpip-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Attempts</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? '...' : stats.totalAttempts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? '...' : (stats.averageScore > 0 ? `${(stats.averageScore * 11 / 9).toFixed(1)}/11` : '-')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Time Practiced</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? '...' : (stats.timePracticed > 0 ? `${Math.floor(stats.timePracticed / 60)}h ${stats.timePracticed % 60}m` : '0h')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Words Written</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? '...' : stats.wordsWritten}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Writing Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task 1: Email Writing */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-celpip-100 rounded-lg">
                <Mail className="h-6 w-6 text-celpip-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  Task 1: Writing an Email
                </h3>
                <p className="text-sm text-gray-600">27 minutes</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Write a formal or informal email in response to a given situation. 
              You will be randomly assigned a scenario and asked to compose an appropriate email.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-celpip-500 rounded-full mr-2"></div>
                Write 150-200 words
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-celpip-500 rounded-full mr-2"></div>
                Include proper greeting and closing
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-celpip-500 rounded-full mr-2"></div>
                Address all points in the prompt
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-celpip-500 rounded-full mr-2"></div>
                Random prompt selection
              </div>
            </div>
          </div>
        </div>

        {/* Task 2: Survey Response */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  Task 2: Responding to Survey Questions
                </h3>
                <p className="text-sm text-gray-600">26 minutes</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Respond to survey questions by providing detailed answers. 
              You will be randomly assigned a survey scenario and asked to write comprehensive responses.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Write 150-200 words
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Provide detailed explanations
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Support opinions with examples
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Random prompt selection
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow">
          {statsLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-celpip-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading recent activity...</p>
            </div>
          ) : stats.recentAttempts && stats.recentAttempts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {stats.recentAttempts.map((attempt: any) => (
                <Link key={attempt.id} href={`/feedback/${attempt.id}`} className="block hover:bg-gray-50 transition-colors">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${
                          attempt.taskType === 'email' ? 'bg-celpip-100' : 'bg-green-100'
                        }`}>
                          {attempt.taskType === 'email' ? (
                            <Mail className="h-5 w-5 text-celpip-600" />
                          ) : (
                            <FileText className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {attempt.taskType === 'email' ? 'Email Writing' : 'Survey Response'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(attempt.createdAt).toLocaleDateString()} • {attempt.wordCount} words • {attempt.timeSpent} min
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {(attempt.score * 11 / 9).toFixed(1)}/11
                        </p>
                        <p className="text-sm text-gray-500">Score</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent writing attempts</p>
              <p className="text-sm">Start practicing to see your progress here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 