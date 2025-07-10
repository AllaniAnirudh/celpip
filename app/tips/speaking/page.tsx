'use client'

import Navigation from '@/components/Navigation'
import { Mic, Clock, Target, Users, CheckCircle, AlertCircle, Lightbulb, BookOpen } from 'lucide-react'

export default function SpeakingTipsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <Mic className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CELPIP Speaking Tips
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master the CELPIP Speaking test with proven strategies, time management techniques, and sample responses for all question types.
          </p>
        </div>

        {/* General Strategies */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-green-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Target className="h-6 w-6 mr-3" />
              General Speaking Strategies
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Preparation Phase</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Read the question carefully and identify key points to address</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Plan your response structure (introduction, main points, conclusion)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Think of relevant examples and personal experiences</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Practice clear pronunciation and natural intonation</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Delivery Phase</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Speak at a natural pace - not too fast or slow</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Use clear transitions between ideas</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Maintain good eye contact and confident posture</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">End with a clear conclusion that summarizes your main points</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Time Management */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Clock className="h-6 w-6 mr-3" />
              Time Management Techniques
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">30s</div>
                <h3 className="font-semibold text-gray-900 mb-2">Preparation</h3>
                <p className="text-sm text-gray-600">Read question, plan structure, think of examples</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">60s</div>
                <h3 className="font-semibold text-gray-900 mb-2">Response</h3>
                <p className="text-sm text-gray-600">Deliver your answer with clear structure</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-2">10s</div>
                <h3 className="font-semibold text-gray-900 mb-2">Conclusion</h3>
                <p className="text-sm text-gray-600">Summarize and wrap up your response</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">Pro Tip</h4>
                  <p className="text-yellow-700 text-sm">
                    Practice with a timer to develop a natural sense of timing. Aim to speak for 45-50 seconds to leave room for a strong conclusion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Types */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-purple-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <BookOpen className="h-6 w-6 mr-3" />
              Common Question Types
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Personal Experience Questions</h3>
                <p className="text-gray-600 mb-3">"Tell me about a time when..." or "Describe an experience where..."</p>
                <div className="bg-purple-50 p-3 rounded">
                  <h4 className="font-medium text-purple-800 mb-1">Strategy:</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Use the STAR method (Situation, Task, Action, Result)</li>
                    <li>• Include specific details and emotions</li>
                    <li>• Explain what you learned from the experience</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Opinion Questions</h3>
                <p className="text-gray-600 mb-3">"What do you think about..." or "Do you agree or disagree with..."</p>
                <div className="bg-blue-50 p-3 rounded">
                  <h4 className="font-medium text-blue-800 mb-1">Strategy:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• State your position clearly in the introduction</li>
                    <li>• Provide 2-3 supporting reasons with examples</li>
                    <li>• Address potential counterarguments</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Problem-Solving Questions</h3>
                <p className="text-gray-600 mb-3">"How would you solve..." or "What would you do if..."</p>
                <div className="bg-green-50 p-3 rounded">
                  <h4 className="font-medium text-green-800 mb-1">Strategy:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Identify the problem clearly</li>
                    <li>• Propose 2-3 possible solutions</li>
                    <li>• Explain the pros and cons of each approach</li>
                    <li>• Recommend the best solution with justification</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Comparison Questions</h3>
                <p className="text-gray-600 mb-3">"Compare and contrast..." or "What are the differences between..."</p>
                <div className="bg-orange-50 p-3 rounded">
                  <h4 className="font-medium text-orange-800 mb-1">Strategy:</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Use clear transition words (however, on the other hand, similarly)</li>
                    <li>• Compare multiple aspects (cost, convenience, effectiveness)</li>
                    <li>• Provide specific examples for each point</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Response Structure */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-indigo-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Lightbulb className="h-6 w-6 mr-3" />
              Sample Response Structure
            </h2>
          </div>
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">Question: "Tell me about a challenging situation you faced at work and how you handled it."</h3>
              
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                  <h4 className="font-medium text-blue-800 mb-1">Introduction (10-15 seconds)</h4>
                  <p className="text-sm text-gray-700 italic">
                    "I'd like to share a challenging situation I encountered while working as a project manager at my previous company..."
                  </p>
                </div>
                
                <div className="bg-white p-3 rounded border-l-4 border-green-500">
                  <h4 className="font-medium text-green-800 mb-1">Main Content (30-35 seconds)</h4>
                  <p className="text-sm text-gray-700 italic">
                    "The challenge was that our team was behind schedule due to unexpected technical issues. I immediately called a team meeting to assess the situation and identify solutions. We decided to work overtime and bring in additional resources..."
                  </p>
                </div>
                
                <div className="bg-white p-3 rounded border-l-4 border-purple-500">
                  <h4 className="font-medium text-purple-800 mb-1">Conclusion (5-10 seconds)</h4>
                  <p className="text-sm text-gray-700 italic">
                    "In the end, we successfully completed the project on time. This experience taught me the importance of proactive communication and flexible problem-solving."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vocabulary and Phrases */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-teal-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Users className="h-6 w-6 mr-3" />
              Useful Vocabulary and Phrases
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Transition Words</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">First of all, To begin with</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Furthermore, Moreover, Additionally</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">However, On the other hand</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">In conclusion, To sum up</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Opinion Phrases</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">In my opinion, I believe that</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">From my perspective, I think</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">It seems to me that</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">I would say that</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Tips */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-amber-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Lightbulb className="h-6 w-6 mr-3" />
              Practice Tips
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Daily Practice</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Record yourself speaking and listen for areas of improvement</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Practice with a timer to develop timing awareness</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Read English articles aloud to improve pronunciation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Watch English videos and mimic native speakers</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Test Day Preparation</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Get a good night's sleep before the test</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Arrive early and familiarize yourself with the testing environment</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Take deep breaths and stay calm during the test</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Remember that confidence is key - speak clearly and naturally</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 