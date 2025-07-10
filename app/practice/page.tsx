'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import WritingInterface from '@/components/WritingInterface'
import toast from 'react-hot-toast'
import Navigation from '@/components/Navigation'
import { Mail, FileText, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// Combined prompts for random selection
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

Provide detailed answers with specific examples and explanations. Write 150-200 words.`,
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

Support your opinions with personal experiences and examples. Write 150-200 words.`,
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

Provide thoughtful responses with specific examples and suggestions. Write 150-200 words.`,
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

Include personal experiences and specific examples in your responses. Write 150-200 words.`,
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

Provide detailed answers with examples from your own experience. Write 150-200 words.`,
  },
]

export default function PracticePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedTask, setSelectedTask] = useState<{
    type: 'email' | 'survey'
    prompt: any
    timeLimit: number
    wordTarget: { min: number; max: number }
  } | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [hasUsedFreeAttempt, setHasUsedFreeAttempt] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)

  // Function to generate a new random task
  const generateNewTask = () => {
    console.log('generateNewTask called')
    const taskType = Math.random() < 0.5 ? 'email' : 'survey'
    const prompts = taskType === 'email' ? EMAIL_PROMPTS : SURVEY_PROMPTS
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]
    
    const newTask = {
      type: taskType as 'email' | 'survey',
      prompt: randomPrompt,
      timeLimit: taskType === 'email' ? 27 : 26,
      wordTarget: { min: 150, max: 200 }
    }
    
    console.log('Generated new task:', newTask)
    return newTask
  }

  // Check if user has used their free attempt
  useEffect(() => {
    const freeAttemptUsed = localStorage.getItem('celpip-free-attempt-used')
    if (freeAttemptUsed === 'true') {
      setHasUsedFreeAttempt(true)
    }
  }, [])

  // Randomly select a task on component mount
  useEffect(() => {
    console.log('Task generation useEffect triggered, selectedTask:', selectedTask)
    if (!selectedTask) {
      console.log('Generating new task...')
      const newTask = generateNewTask()
      setSelectedTask(newTask)
    }
  }, [selectedTask])

  const handleSubmit = async (data: {
    response: string
    wordCount: number
    timeSpent: number
  }) => {
    try {
      // Mark free attempt as used if user is not signed in
      if (!session) {
        localStorage.setItem('celpip-free-attempt-used', 'true')
        setHasUsedFreeAttempt(true)
      }

      // First, get AI scoring
      const scoringResponse = await fetch('/api/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskType: selectedTask!.type,
          prompt: selectedTask!.prompt.prompt,
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
            taskType: selectedTask!.type,
            prompt: selectedTask!.prompt.prompt,
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

  // Show sign-in prompt if user has used free attempt and is not signed in
  if (hasUsedFreeAttempt && !session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-celpip-100 rounded-full flex items-center justify-center mb-6">
              <Lock className="h-8 w-8 text-celpip-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Sign In to Continue Practicing
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              You've used your free practice attempt. Sign in or create an account to continue practicing with unlimited attempts and track your progress.
            </p>
            <div className="space-y-4">
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-celpip-600 hover:bg-celpip-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-celpip-500 transition-colors"
              >
                Sign In / Sign Up
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <div className="text-sm text-gray-500">
                <Link href="/" className="text-celpip-600 hover:text-celpip-700">
                  ← Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show results if available
  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className={`px-6 py-4 ${selectedTask?.type === 'email' ? 'bg-celpip-600' : 'bg-green-600'} text-white`}>
              <h1 className="text-2xl font-bold">Your Results</h1>
              <p className="text-opacity-80">
                {selectedTask?.type === 'email' ? 'Email Writing Task' : 'Survey Response Task'}
              </p>
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
                    console.log('Try Another Task clicked')
                    console.log('Session:', session)
                    console.log('Has used free attempt:', hasUsedFreeAttempt)
                    
                    // Check if user is signed in or hasn't used free attempt
                    if (session || !hasUsedFreeAttempt) {
                      console.log('Resetting state for new task')
                      setShowResults(false)
                      setResults(null)
                      // Generate a new task immediately instead of setting to null
                      const newTask = generateNewTask()
                      setSelectedTask(newTask)
                    } else {
                      console.log('Showing sign-in modal')
                      setShowSignInModal(true)
                    }
                  }}
                  className="flex-1 px-6 py-3 bg-celpip-600 text-white rounded-md hover:bg-celpip-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-celpip-500 transition-colors"
                >
                  Try Another Task
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

  // Sign-in Modal
  if (showSignInModal) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-celpip-100 rounded-full flex items-center justify-center mr-3">
                <Lock className="h-6 w-6 text-celpip-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Sign In Required</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Please sign in or create an account to try another task. You've used your free practice attempt.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowSignInModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-celpip-500 transition-colors"
              >
                Cancel
              </button>
              <Link
                href="/auth/signin"
                className="flex-1 px-4 py-2 bg-celpip-600 text-white rounded-md hover:bg-celpip-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-celpip-500 transition-colors text-center"
              >
                Sign In / Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show writing interface if task is selected
  if (selectedTask) {
    return (
      <WritingInterface
        taskType={selectedTask.type}
        prompt={selectedTask.prompt.prompt}
        timeLimit={selectedTask.timeLimit}
        wordTarget={selectedTask.wordTarget}
        onSubmit={handleSubmit}
        onTryAnotherTask={() => {
          console.log('onTryAnotherTask called from practice page')
          const newTask = generateNewTask()
          setSelectedTask(newTask)
        }}
        isSignedIn={!!session}
        hasUsedFreeAttempt={hasUsedFreeAttempt}
      />
    )
  }

  // Show loading state
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-celpip-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your writing task...</p>
        </div>
      </div>
    </div>
  )
} 