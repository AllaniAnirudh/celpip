import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
// import dbConnect from '@/lib/mongodb'
// import WritingAttempt from '@/models/WritingAttempt'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { taskType, prompt, response, wordCount, timeSpent, score } = await request.json()

    if (!taskType || !prompt || !response || !wordCount || !timeSpent || !score) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Mock save attempt for local testing
    // In production, this would save to MongoDB
    console.log('Mock save attempt:', { taskType, wordCount, timeSpent, score })

    return NextResponse.json(
      { 
        message: 'Attempt saved successfully (mock)',
        attemptId: 'mock-attempt-id'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Save attempt error:', error)
    return NextResponse.json(
      { error: 'Failed to save attempt' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Mock attempts data for local testing
    // In production, this would fetch from MongoDB
    const mockAttempts = [
      {
        id: 'mock-1',
        taskType: 'email',
        prompt: 'Write an email...',
        response: 'Dear...',
        wordCount: 180,
        timeSpent: 1200,
        score: {
          overall: 8,
          grammar: 8,
          vocabulary: 7,
          coherence: 9,
          taskRelevance: 8,
        },
        feedback: 'Good work!',
        improvementTips: ['Improve vocabulary'],
        submittedAt: new Date().toISOString(),
      }
    ]

    return NextResponse.json(mockAttempts)
  } catch (error) {
    console.error('Get attempts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attempts' },
      { status: 500 }
    )
  }
} 