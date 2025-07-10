'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import WritingInterface from '@/components/WritingInterface'
import { useStatsRefresh } from '@/hooks/useStatsRefresh'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'react-hot-toast'

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
  const router = useRouter()
  const { refreshStats } = useStatsRefresh()
  const { user, loading, hasUsedFreeTest, markFreeTestAsUsed, getGuestAnonId } = useAuth()
  const [selectedTask, setSelectedTask] = useState<{
    type: 'email' | 'survey'
    prompt: { prompt: string; title: string }
    timeLimit: number
    wordTarget: { min: number; max: number }
  } | null>(null)

  // Function to generate a new random task
  const generateNewTask = () => {
    const taskTypes: ('email' | 'survey')[] = ['email', 'survey']
    const randomType = taskTypes[Math.floor(Math.random() * taskTypes.length)]
    
    let prompts: { prompt: string; title: string }[]
    let timeLimit: number
    let wordTarget: { min: number; max: number }
    
    if (randomType === 'email') {
      prompts = EMAIL_PROMPTS
      timeLimit = 20 * 60 // 20 minutes
      wordTarget = { min: 150, max: 200 }
    } else {
      prompts = SURVEY_PROMPTS
      timeLimit = 26 * 60 // 26 minutes
      wordTarget = { min: 150, max: 200 }
    }
    
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]
    
    const newTask = {
      type: randomType,
      prompt: randomPrompt,
      timeLimit,
      wordTarget
    }
    
    return newTask
  }

  // Check if user has used their free attempt and redirect if needed
  useEffect(() => {
    if (!loading && hasUsedFreeTest) {
      toast.error('You have already used your free test. Please upgrade to continue.')
      router.push('/pay')
    }
  }, [loading, hasUsedFreeTest, router])

  // Generate initial task when component mounts
  useEffect(() => {
    if (!loading && !hasUsedFreeTest) {
      setSelectedTask(generateNewTask())
    }
  }, [loading, hasUsedFreeTest])

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

  if (hasUsedFreeTest) {
    return null // Will redirect to /pay
  }

  if (!selectedTask) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-celpip-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Preparing your writing task...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (data: {
    response: string
    wordCount: number
    timeSpent: number
  }) => {
    try {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: selectedTask.prompt.prompt,
          response: data.response,
          taskType: selectedTask.type,
          wordCount: data.wordCount,
          timeSpent: data.timeSpent,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit response')
      }

      const result = await response.json()
      
      // Mark free test as used after successful submission
      await markFreeTestAsUsed()
      
      // Store attempt data for feedback page
      const attemptData = {
        id: result.attemptId,
        prompt: selectedTask.prompt.prompt,
        response: data.response,
        score: result.score,
        feedback: result.feedback,
        taskType: selectedTask.type,
        wordCount: data.wordCount,
        timeSpent: data.timeSpent,
        submittedAt: new Date().toISOString()
      }

      // Store in localStorage for guest users or redirect to feedback page
      if (!user) {
        localStorage.setItem('celpip_last_attempt', JSON.stringify(attemptData))
      }

      // Refresh stats
      refreshStats()

      // Redirect to feedback page
      router.push(`/feedback/${result.attemptId}`)
    } catch (error) {
      console.error('Error submitting response:', error)
      toast.error('Failed to submit response. Please try again.')
    }
  }

  const handleNewTask = () => {
    if (hasUsedFreeTest) {
      router.push('/pay')
      return
    }
    setSelectedTask(generateNewTask())
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {selectedTask.type === 'email' ? 'Email Writing Task' : 'Survey Response Task'}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {selectedTask.type === 'email' 
              ? 'Write a formal or informal email in response to the given situation.'
              : 'Respond to the survey questions with detailed answers.'
            }
          </p>
        </div>

        <WritingInterface
          prompt={selectedTask.prompt.prompt}
          timeLimit={selectedTask.timeLimit}
          wordTarget={selectedTask.wordTarget}
          onSubmit={handleSubmit}
          onTryAnotherTask={handleNewTask}
          taskType={selectedTask.type}
          isSignedIn={!!user}
          hasUsedFreeAttempt={hasUsedFreeTest}
        />
      </div>
    </div>
  )
} 