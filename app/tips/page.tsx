import Navigation from '@/components/Navigation'
import { BookOpen, Clock, Target, Lightbulb, FileText, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function TipsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                CELPIP Writing Tips & Strategies
              </h1>
              <p className="text-gray-600">
                Master your CELPIP Writing tasks with these proven strategies and tips
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
              <Link
                href="/practice"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-celpip-600 hover:bg-celpip-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-celpip-500 transition-colors"
              >
                Start Practice
                <FileText className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-celpip-500 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Planning Your Response */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 ml-3">
                  How to Plan Your Response
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-blue-600 text-sm font-medium">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Read the prompt carefully</h3>
                    <p className="text-gray-600 text-sm">
                      Identify the key points you need to address. Underline or highlight important information.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-blue-600 text-sm font-medium">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Create a quick outline</h3>
                    <p className="text-gray-600 text-sm">
                      Spend 2-3 minutes organizing your thoughts. Plan your introduction, main points, and conclusion.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-blue-600 text-sm font-medium">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Structure your response</h3>
                    <p className="text-gray-600 text-sm">
                      Use clear paragraphs with topic sentences. Include an introduction, body paragraphs, and conclusion.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Common CELPIP Vocabulary */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 ml-3">
                  Common CELPIP Vocabulary
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Formal Language</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-gray-700">I would appreciate if you could...</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-gray-700">I am writing to inform you...</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-gray-700">Thank you for your attention to this matter</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-gray-700">I look forward to hearing from you</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Transition Words</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-gray-700">Furthermore, Moreover, Additionally</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-gray-700">However, Nevertheless, On the other hand</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-gray-700">In conclusion, To summarize, Therefore</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-gray-700">For example, Specifically, In particular</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Management */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 ml-3">
                  Time Management Strategies
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                  <h3 className="font-medium text-orange-800 mb-2">Email Task (27 minutes)</h3>
                  <div className="text-sm text-orange-700 space-y-1">
                    <div>• 2-3 minutes: Read and plan</div>
                    <div>• 20-22 minutes: Write your response</div>
                    <div>• 2-3 minutes: Review and edit</div>
                  </div>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <h3 className="font-medium text-green-800 mb-2">Survey Task (26 minutes)</h3>
                  <div className="text-sm text-green-700 space-y-1">
                    <div>• 3-4 minutes: Read and plan</div>
                    <div>• 18-20 minutes: Write your response</div>
                    <div>• 2-3 minutes: Review and edit</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Pro Tips:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Don't spend too much time on perfect grammar - focus on completing all points</li>
                    <li>• Keep track of your word count as you write</li>
                    <li>• Leave time to check for basic spelling and punctuation errors</li>
                    <li>• If you're running out of time, focus on addressing all prompt points</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sample High-Scoring Answers */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Lightbulb className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 ml-3">
                  Sample High-Scoring Answers
                </h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Email Task Example</h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm">
                    <p className="text-gray-700 mb-2">
                      <strong>Subject:</strong> Complaint Regarding Recent Purchase
                    </p>
                    <p className="text-gray-700 mb-2">
                      Dear Customer Service Team,
                    </p>
                    <p className="text-gray-700 mb-2">
                      I am writing to express my dissatisfaction with a laptop I purchased from your store on March 15th, 2024 (Order #TS-2024-001234). Since the first day of use, the device has been experiencing significant technical issues that prevent me from using it effectively.
                    </p>
                    <p className="text-gray-700 mb-2">
                      The main problems include frequent system crashes, extremely slow performance, and the battery draining within 30 minutes of use. I have attempted to resolve these issues by restarting the computer and updating the system, but the problems persist.
                    </p>
                    <p className="text-gray-700 mb-2">
                      Given these circumstances, I would appreciate if you could provide me with either a replacement laptop of the same model or a full refund. I would prefer a replacement if possible, as I need a reliable computer for my work.
                    </p>
                    <p className="text-gray-700 mb-2">
                      I look forward to your prompt response and resolution of this matter.
                    </p>
                    <p className="text-gray-700">
                      Best regards,<br />
                      John Smith
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Survey Task Example</h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm">
                    <p className="text-gray-700 mb-2">
                      Regarding work-life balance, I typically work 45 hours per week, which presents several challenges in maintaining a healthy balance between my professional and personal life.
                    </p>
                    <p className="text-gray-700 mb-2">
                      The main challenges I face include difficulty disconnecting from work emails after hours, limited time for exercise and hobbies, and the pressure to be constantly available for work-related matters. Additionally, the blurred boundaries between work and home life, especially since remote work became common, have made it increasingly difficult to maintain clear separation.
                    </p>
                    <p className="text-gray-700 mb-2">
                      To manage stress and maintain well-being, I have implemented several strategies. I schedule regular exercise sessions three times per week, practice mindfulness meditation for 15 minutes daily, and set strict boundaries by turning off work notifications after 6 PM. I also make it a priority to spend quality time with family and friends on weekends.
                    </p>
                    <p className="text-gray-700 mb-2">
                      Over the past five years, my work-life balance has become more challenging due to increased work demands and the rise of remote work. However, I have also become more intentional about setting boundaries and prioritizing self-care activities.
                    </p>
                    <p className="text-gray-700">
                      For someone struggling with work-life balance, I would advise them to start by setting clear boundaries, learning to say no to excessive work demands, and making time for activities that bring them joy and relaxation. It's also important to communicate openly with employers about workload concerns and to remember that taking care of oneself ultimately leads to better work performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Tips */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Target className="h-5 w-5 text-celpip-600 mr-2 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    Always address all points mentioned in the prompt
                  </div>
                </div>
                <div className="flex items-start">
                  <Target className="h-5 w-5 text-celpip-600 mr-2 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    Use appropriate tone (formal for emails, conversational for surveys)
                  </div>
                </div>
                <div className="flex items-start">
                  <Target className="h-5 w-5 text-celpip-600 mr-2 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    Include specific examples and details to support your points
                  </div>
                </div>
                <div className="flex items-start">
                  <Target className="h-5 w-5 text-celpip-600 mr-2 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    Vary your sentence structure and vocabulary
                  </div>
                </div>
                <div className="flex items-start">
                  <Target className="h-5 w-5 text-celpip-600 mr-2 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    Proofread for basic spelling and grammar errors
                  </div>
                </div>
              </div>
            </div>

            {/* Common Mistakes */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Mistakes to Avoid</h3>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <strong className="text-red-600">✗</strong> Not addressing all prompt points
                </div>
                <div className="text-sm text-gray-600">
                  <strong className="text-red-600">✗</strong> Writing too informally in email tasks
                </div>
                <div className="text-sm text-gray-600">
                  <strong className="text-red-600">✗</strong> Using repetitive vocabulary
                </div>
                <div className="text-sm text-gray-600">
                  <strong className="text-red-600">✗</strong> Not providing specific examples
                </div>
                <div className="text-sm text-gray-600">
                  <strong className="text-red-600">✗</strong> Ignoring word count requirements
                </div>
                <div className="text-sm text-gray-600">
                  <strong className="text-red-600">✗</strong> Poor paragraph organization
                </div>
              </div>
            </div>

            {/* Practice Now */}
            <div className="bg-celpip-50 border border-celpip-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-celpip-900 mb-4">Ready to Practice?</h3>
              <p className="text-sm text-celpip-700 mb-4">
                Apply these tips in your next writing practice session
              </p>
              <div className="space-y-2">
                <Link
                  href="/practice"
                  className="block w-full text-center px-4 py-2 bg-celpip-600 text-white rounded-md hover:bg-celpip-700 transition-colors text-sm"
                >
                  Start Practice (Random Task)
                </Link>
                <Link
                  href="/"
                  className="block w-full text-center px-4 py-2 border border-celpip-300 text-celpip-700 bg-white rounded-md hover:bg-celpip-50 transition-colors text-sm"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 