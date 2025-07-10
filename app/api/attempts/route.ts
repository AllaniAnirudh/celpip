import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    
    const {
      taskType,
      prompt,
      response,
      wordCount,
      timeSpent,
      score
    } = body

    // Validate required fields
    if (!taskType || !prompt || !response || !wordCount || !timeSpent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // For now, we'll just log the attempt since we don't have a real database
    // In production, this would save to MongoDB
    console.log('Saving attempt:', {
      userId: session?.user?.id || 'guest',
      taskType,
      wordCount,
      timeSpent,
      score,
      createdAt: new Date().toISOString()
    })

    // For authenticated users, we could save to database
    // For guest users, we could store in localStorage or session storage
    
    return NextResponse.json({ 
      success: true,
      message: 'Attempt saved successfully'
    })
  } catch (error) {
    console.error('Error saving attempt:', error)
    return NextResponse.json(
      { error: 'Failed to save attempt' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ attempts: [] })
    }

    // For now, return mock data for authenticated users
    // In production, this would query the database
    const mockAttempts = [
      {
        id: '1',
        taskType: 'email',
        score: 7.5,
        wordCount: 180,
        timeSpent: 15,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        taskType: 'survey',
        score: 6.8,
        wordCount: 165,
        timeSpent: 18,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        taskType: 'email',
        score: 7.3,
        wordCount: 195,
        timeSpent: 12,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    return NextResponse.json({ attempts: mockAttempts })
  } catch (error) {
    console.error('Error fetching attempts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attempts' },
      { status: 500 }
    )
  }
} 