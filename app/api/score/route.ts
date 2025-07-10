import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabaseServer'
// import OpenAI from 'openai'

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// })

const CELPIP_SCORING_PROMPT = `
You are a CELPIP Writing examiner. Evaluate the following writing response based on the CELPIP scoring rubric (bands 1-11).

CELPIP Writing Band Descriptors:
- Bands 9-11: Excellent command of English with minimal errors
- Bands 6-8: Good command with some errors that don't impede communication
- Bands 3-5: Adequate command with errors that may impede communication
- Bands 1-2: Limited command with frequent errors that impede communication

Scoring Criteria:
1. Grammar (25%): Accuracy of grammar structures
2. Vocabulary (25%): Range and appropriateness of vocabulary
3. Coherence (25%): Logical organization and flow
4. Task Relevance (25%): How well the response addresses the prompt

Provide scores for each criterion (1-11) and an overall score. Include detailed feedback and specific improvement tips.

Task Type: {taskType}
Prompt: {prompt}
Response: {response}
Word Count: {wordCount}
`

export async function POST(request: NextRequest) {
  try {
    const { taskType, prompt, response, wordCount, timeSpent, guestId } = await request.json()

    if (!taskType || !prompt || !response || !wordCount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get access token from Authorization header
    const authHeader = request.headers.get('authorization')
    const accessToken = authHeader?.split(' ')[1]

    // Mock scoring result for local testing (using 11-band scale)
    const scoringResult = {
      overall: 8,
      grammar: 8,
      vocabulary: 8,
      coherence: 8,
      taskRelevance: 8,
      feedback: 'This is a mock feedback. Your writing is clear and relevant. (AI feedback will appear here in production.)',
      improvementTips: [
        'Review grammar structures',
        'Expand vocabulary usage',
        'Improve paragraph organization',
        'Ensure all parts of the prompt are addressed'
      ]
    }

    // Save attempt to database
    const supabase = createServerComponentClient(accessToken)
    
    // Get user from session
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data: attempt, error } = await supabase
      .from('writing_attempts')
      .insert({
        user_id: user?.id || null,
        guest_id: !user?.id ? guestId : null, // Save guest_id only for guest users
        task_type: taskType,
        prompt: prompt,
        response: response,
        word_count: wordCount,
        time_spent: timeSpent || 0,
        score: scoringResult,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving attempt:', error)
      return NextResponse.json(
        { error: 'Failed to save attempt' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ...scoringResult,
      attemptId: attempt.id
    })
  } catch (error) {
    console.error('Scoring error:', error)
    return NextResponse.json(
      { error: 'Failed to score writing' },
      { status: 500 }
    )
  }
} 