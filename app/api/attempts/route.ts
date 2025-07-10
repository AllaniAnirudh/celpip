import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabaseServer'
import type { Database } from '@/lib/database.types'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    // Allow both authenticated and guest users to save attempts
    // For guest users, user will be null but we still save the attempt

    const body = await request.json()
    const { taskType, prompt, response, wordCount, timeSpent, score } = body

    // Validate required fields
    if (!taskType || !prompt || !response || !wordCount || !timeSpent || !score) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Insert the attempt into the database
    const { data, error } = await supabase
      .from('writing_attempts')
      .insert({
        user_id: user?.id || null,
        task_type: taskType,
        prompt: prompt,
        response: response,
        word_count: wordCount,
        time_spent: timeSpent,
        score: score
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to save attempt' }, { status: 500 })
    }

    console.log('Attempt saved successfully:', data)
    return NextResponse.json({ success: true, data })

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerComponentClient()
    const { searchParams } = new URL(request.url)
    const attemptId = searchParams.get('id')
    const limit = searchParams.get('limit')

    if (attemptId) {
      // Fetch by attempt ID (for feedback page)
      const { data, error } = await supabase
        .from('writing_attempts')
        .select('*')
        .eq('id', attemptId)
        .single()
      if (error || !data) {
        return NextResponse.json({ error: 'Attempt not found' }, { status: 404 })
      }
      return NextResponse.json({ attempt: data })
    }

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    let query = supabase.from('writing_attempts').select('*')
    if (user && !authError) {
      query = query.eq('user_id', user.id)
    } else {
      query = query.is('user_id', null)
    }
    
    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit, 10)
      if (!isNaN(limitNum) && limitNum > 0) {
        query = query.limit(limitNum)
      }
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 })
    }

    return NextResponse.json({ attempts: data || [] })

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 