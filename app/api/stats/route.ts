import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      // For non-authenticated users, return basic stats from localStorage or show 0
      return NextResponse.json({
        totalAttempts: 0,
        averageScore: 0,
        timePracticed: 0,
        wordsWritten: 0,
        recentAttempts: []
      })
    }

    // For authenticated users, fetch from database
    // Since we're using mocked data for now, let's return some sample data
    // In production, this would query the database for the user's attempts
    
    // Try to fetch attempts from the attempts API
    try {
      const attemptsResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/attempts`, {
        cache: 'no-store'
      })
      
      if (attemptsResponse.ok) {
        const { attempts } = await attemptsResponse.json()
        
        if (attempts && attempts.length > 0) {
          const totalAttempts = attempts.length
          const averageScore = attempts.reduce((sum: number, attempt: any) => sum + attempt.score, 0) / totalAttempts
          const timePracticed = attempts.reduce((sum: number, attempt: any) => sum + attempt.timeSpent, 0)
          const wordsWritten = attempts.reduce((sum: number, attempt: any) => sum + attempt.wordCount, 0)
          const recentAttempts = attempts.slice(0, 5) // Show last 5 attempts
          
          return NextResponse.json({
            totalAttempts,
            averageScore,
            timePracticed,
            wordsWritten,
            recentAttempts
          })
        }
      }
    } catch (error) {
      console.error('Error fetching attempts for stats:', error)
    }
    
    // Fallback to mock data if fetch fails
    const mockStats = {
      totalAttempts: 3,
      averageScore: 7.2,
      timePracticed: 45, // in minutes
      wordsWritten: 450,
      recentAttempts: [
        {
          id: '1',
          taskType: 'email',
          score: 7.5,
          wordCount: 180,
          timeSpent: 15,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
        },
        {
          id: '2',
          taskType: 'survey',
          score: 6.8,
          wordCount: 165,
          timeSpent: 18,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
        },
        {
          id: '3',
          taskType: 'email',
          score: 7.3,
          wordCount: 195,
          timeSpent: 12,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
        }
      ]
    }

    return NextResponse.json(mockStats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
} 