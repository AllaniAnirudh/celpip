import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
// import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Mail, FileText, BarChart3, Clock, Target } from 'lucide-react'
import Navigation from '@/components/Navigation'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  // Remove mandatory authentication for now
  // if (!session) {
  //   redirect('/auth/signin')
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {session ? `Welcome back, ${session.user?.name}!` : 'Welcome to CELPIP Writing Practice!'}
          </h1>
          <p className="text-gray-600 mb-6">
            Practice your CELPIP Writing skills with AI-powered feedback
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/practice"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-celpip-600 hover:bg-celpip-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-celpip-500 transition-colors"
            >
              Start Practice
              <FileText className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/tips"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-celpip-500 transition-colors"
            >
              View Writing Tips
              <FileText className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Free Attempt Notice */}
        {!session && (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Free Trial:</strong> Try one practice session without signing up. Sign in to continue practicing and track your progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-celpip-100 rounded-lg">
                <Target className="h-6 w-6 text-celpip-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Attempts</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
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
                <p className="text-2xl font-bold text-gray-900">-</p>
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
                <p className="text-2xl font-bold text-gray-900">0h</p>
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
                <p className="text-2xl font-bold text-gray-900">0</p>
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
                  Write 200-250 words
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
            <div className="p-6 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent writing attempts</p>
              <p className="text-sm">Start practicing to see your progress here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 