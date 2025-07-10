'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import WritingInterface from '@/components/WritingInterface'
import toast from 'react-hot-toast'

const SURVEY_PROMPTS = [
  {
    id: 1,
    title: 'Work-Life Balance Survey',
    prompt: `A local business magazine is conducting a survey about work-life balance. Please respond to the following questions:

1. How many hours do you typically work per week?
2. What challenges do you face in maintaining a good work-life balance?
3. What strategies do you use to manage stress and maintain well-being?
4. How has your work-life balance changed over the past five years?
5. What advice would you give to someone struggling with work-life balance?

Provide detailed answers with specific examples and explanations. Write 200-250 words.`,
  },
  {
    id: 2,
    title: 'Technology Usage Survey',
    prompt: `A technology research company is studying how people use digital devices in their daily lives. Please answer the following questions:

1. What types of digital devices do you use most frequently?
2. How has technology changed the way you communicate with others?
3. What are the benefits and drawbacks of increased technology use?
4. How do you manage screen time and digital wellness?
5. What technology trends do you think will be most important in the next decade?

Support your opinions with personal experiences and examples. Write 200-250 words.`,
  },
  {
    id: 3,
    title: 'Environmental Awareness Survey',
    prompt: `An environmental organization is gathering opinions about climate change and sustainability. Please respond to these questions:

1. How concerned are you about climate change and why?
2. What environmental practices do you follow in your daily life?
3. What barriers prevent you from being more environmentally friendly?
4. How do you think individuals can make the biggest impact on environmental issues?
5. What role should governments and businesses play in addressing climate change?

Provide thoughtful responses with specific examples and suggestions. Write 200-250 words.`,
  },
  {
    id: 4,
    title: 'Education and Learning Survey',
    prompt: `A university is conducting research on lifelong learning and education preferences. Please answer these questions:

1. What motivates you to continue learning new skills or knowledge?
2. What are the most effective learning methods for you personally?
3. How has your approach to learning changed since you were younger?
4. What challenges do you face when trying to learn something new?
5. How do you think education should adapt to meet future workforce needs?

Include personal experiences and specific examples in your responses. Write 200-250 words.`,
  },
  {
    id: 5,
    title: 'Community Involvement Survey',
    prompt: `A community development organization is studying civic engagement and volunteerism. Please respond to these questions:

1. How involved are you in your local community and why?
2. What types of community activities or organizations interest you most?
3. What barriers prevent people from getting more involved in their communities?
4. How do you think technology affects community engagement?
5. What would make you more likely to participate in community events or volunteer work?

Provide detailed answers with examples from your own experience. Write 200-250 words.`,
  },
]

export default function SurveyPracticePage() {
  const [selectedPrompt, setSelectedPrompt] = useState(SURVEY_PROMPTS[0])
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
          taskType: 'survey',
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
            taskType: 'survey',
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
            <div className="px-6 py-4 bg-green-600 text-white">
              <h1 className="text-2xl font-bold">Your Results</h1>
              <p className="text-green-100">Survey Response Task</p>
            </div>

            <div className="p-6">
              {/* Score Overview */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Score Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{results.overall || 'N/A'}</div>
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
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
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
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Try Another Prompt
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Survey Response Practice</h1>
          <p className="text-gray-600">Choose a survey and practice responding to multiple questions</p>
        </div>

        {/* Prompt Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select a Survey</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SURVEY_PROMPTS.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => setSelectedPrompt(prompt)}
                className={`p-4 text-left border rounded-lg transition-colors ${
                  selectedPrompt.id === prompt.id
                    ? 'border-green-500 bg-green-50'
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
          taskType="survey"
          prompt={selectedPrompt.prompt}
          timeLimit={26}
          wordTarget={{ min: 200, max: 250 }}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
} 