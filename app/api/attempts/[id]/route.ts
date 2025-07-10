import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabaseServer'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerComponentClient()
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()
    
    // Fetch the attempt by ID
    const { data: attempt, error } = await supabase
      .from('writing_attempts')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 })
    }

    // Check if user has access to this attempt
    // Users can only access their own attempts, or guest attempts if they're not signed in
    if (user && attempt.user_id && attempt.user_id !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (!user && attempt.user_id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Transform the data to match the expected format
    const transformedAttempt = {
      id: attempt.id,
      taskType: attempt.task_type,
      prompt: attempt.prompt,
      response: attempt.response,
      score: attempt.score,
      wordCount: attempt.word_count,
      timeSpent: attempt.time_spent,
      createdAt: attempt.created_at
    }

    return NextResponse.json(transformedAttempt)

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 