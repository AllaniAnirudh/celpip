'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import WritingInterface from '@/components/WritingInterface'
import toast from 'react-hot-toast'

const EMAIL_PROMPTS = [
  {
    id: 1,
    title: 'Complaint Email',
    prompt: `You recently purchased a laptop from TechStore, but it has been experiencing technical issues since the first day. Write an email to the customer service department at TechStore.

Include the following information:
- Your name and order number (use any order number)
- Description of the problems you're experiencing
- Request for a replacement or refund
- Your preferred resolution

Write 150-200 words.`,
  },
  {
    id: 2,
    title: 'Apology Email',
    prompt: `You were supposed to meet your friend Sarah for lunch yesterday, but you completely forgot about the appointment. Write an email to Sarah apologizing for missing the lunch.

Include the following:
- A sincere apology
- Explanation for why you missed the appointment
- Offer to reschedule
- Suggest a way to make it up to her

Write 150-200 words.`,
  },
  {
    id: 3,
    title: 'Job Application Follow-up',
    prompt: `You applied for a marketing position at ABC Company two weeks ago and haven't heard back yet. Write a follow-up email to the hiring manager.

Include the following:
- Reference to your original application
- Reiterate your interest in the position
- Mention any relevant updates since your application
- Request information about the hiring timeline

Write 150-200 words.`,
  },
  {
    id: 4,
    title: 'Recommendation Request',
    prompt: `You're applying for a graduate program and need a letter of recommendation from your former professor, Dr. Johnson. Write an email requesting this recommendation.

Include the following:
- Remind Dr. Johnson of your academic relationship
- Explain the program you're applying to
- Provide the deadline for the recommendation
- Offer to provide any additional information needed

Write 150-200 words.`,
  },
  {
    id: 5,
    title: 'Meeting Request',
    prompt: `You need to discuss an important project with your colleague, Mike, who works in a different department. Write an email requesting a meeting.

Include the following:
- Brief description of the project
- Why you need to meet with Mike specifically
- Suggest a few possible meeting times
- Mention the expected duration of the meeting

Write 150-200 words.`,
  },
]

export default function EmailPracticePage() {
  const [selectedPrompt, setSelectedPrompt] = useState(EMAIL_PROMPTS[0])
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<any>(null)
  const router = useRouter()

  const handleSubmit = async (data: {
    response: string
    wordCount: number
    timeSpent: number
  }) => {
    try {
      // First, get AI scoring
      const scoringResponse = await fetch('/api/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskType: 'email',
          prompt: selectedPrompt.prompt,
          response: data.response,
          wordCount: data.wordCount,
        }),
      })

      if (!scoringResponse.ok) {
        throw new Error('Failed to score response')
      }

      const scoringResult = await scoringResponse.json()

      // Save attempt to database (optional for now)
      try {
        const saveResponse = await fetch('/api/attempts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            taskType: 'email',
            prompt: selectedPrompt.prompt,
            response: data.response,
            wordCount: data.wordCount,
            timeSpent: data.timeSpent,
            score: scoringResult,
          }),
        })

        if (!saveResponse.ok) {
          console.warn('Failed to save attempt to database')
        }
      } catch (error) {
        console.warn('Could not save attempt:', error)
      }

      setResults({
        ...scoringResult,
        response: data.response,
        wordCount: data.wordCount,
        timeSpent: data.timeSpent,
      })
      setShowResults(true)
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Failed to submit response. Please try again.')
    }
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-celpip-600 text-white">
              <h1 className="text-2xl font-bold">Your Results</h1>
              <p className="text-celpip-100">Email Writing Task</p>
            </div>

            <div className="p-6">
              {/* Score Overview */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Score Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-celpip-600">{results.overall || 'N/A'}</div>
                    <div className="text-sm text-gray-600">Overall</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{results.grammar || 'N/A'}</div>
                    <div className="text-sm text-gray-600">Grammar</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{results.vocabulary || 'N/A'}</div>
                    <div className="text-sm text-gray-600">Vocabulary</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{results.coherence || 'N/A'}</div>
                    <div className="text-sm text-gray-600">Coherence</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{results.taskRelevance || 'N/A'}</div>
                    <div className="text-sm text-gray-600">Task Relevance</div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">{results.wordCount}</div>
                    <div className="text-sm text-gray-600">Words Written</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">
                      {Math.floor(results.timeSpent / 60)}:{(results.timeSpent % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="text-sm text-gray-600">Time Spent</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">
                      {Math.round((results.wordCount / results.timeSpent) * 60)} wpm
                    </div>
                    <div className="text-sm text-gray-600">Writing Speed</div>
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Feedback</h2>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <div className="text-sm text-blue-800 whitespace-pre-wrap">
                    {results.feedback || 'No detailed feedback available.'}
                  </div>
                </div>
              </div>

              {/* Improvement Tips */}
              {results.improvementTips && results.improvementTips.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Improvement Tips</h2>
                  <ul className="space-y-2">
                    {results.improvementTips.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-celpip-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Your Response */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Response</h2>
                <div className="bg-gray-50 border rounded-lg p-4">
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {results.response}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    setShowResults(false)
                    setResults(null)
                  }}
                  className="flex-1 px-6 py-3 bg-celpip-600 text-white rounded-md hover:bg-celpip-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-celpip-500 transition-colors"
                >
                  Try Another Prompt
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-celpip-500 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Writing Practice</h1>
          <p className="text-gray-600">Choose a prompt and start practicing your email writing skills</p>
        </div>

        {/* Prompt Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select a Prompt</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EMAIL_PROMPTS.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => setSelectedPrompt(prompt)}
                className={`p-4 text-left border rounded-lg transition-colors ${
                  selectedPrompt.id === prompt.id
                    ? 'border-celpip-500 bg-celpip-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <h3 className="font-medium text-gray-900 mb-2">{prompt.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {prompt.prompt.split('\n')[0]}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Writing Interface */}
        <WritingInterface
          taskType="email"
          prompt={selectedPrompt.prompt}
          timeLimit={27}
          wordTarget={{ min: 150, max: 200 }}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
} 