import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabaseServer'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerComponentClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    let query = supabase.from('writing_attempts').select('*')
    if (user && !authError) {
      query = query.eq('user_id', user.id)
    } else {
      query = query.is('user_id', null)
    }
    const { data: attempts, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching attempts:', error)
      return NextResponse.json({
        totalAttempts: 0,
        averageScore: 0,
        timePracticed: 0,
        wordsWritten: 0,
        recentAttempts: []
      })
    }

    // Calculate statistics
    const totalAttempts = attempts?.length || 0
    const averageScore = attempts?.length > 0 
      ? attempts.reduce((sum, attempt) => {
          const score = attempt.score as any
          return sum + (score?.overall || 0)
        }, 0) / attempts.length
      : 0
    const timePracticed = attempts?.reduce((sum, attempt) => sum + (attempt.time_spent || 0), 0) || 0
    const wordsWritten = attempts?.reduce((sum, attempt) => sum + (attempt.word_count || 0), 0) || 0

    // Format recent attempts
    const recentAttempts = attempts?.slice(0, 5).map(attempt => ({
      id: attempt.id,
      taskType: attempt.task_type,
      score: (attempt.score as any)?.overall || 0,
      wordCount: attempt.word_count,
      timeSpent: attempt.time_spent,
      createdAt: attempt.created_at
    })) || []

    return NextResponse.json({
      totalAttempts,
      averageScore: Math.round(averageScore * 10) / 10, // Round to 1 decimal place
      timePracticed,
      wordsWritten,
      recentAttempts
    })

  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({
      totalAttempts: 0,
      averageScore: 0,
      timePracticed: 0,
      wordsWritten: 0,
      recentAttempts: []
    })
  }
} 