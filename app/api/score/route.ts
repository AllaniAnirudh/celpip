import { NextRequest, NextResponse } from 'next/server'
// import OpenAI from 'openai'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// })

const CELPIP_SCORING_PROMPT = `
You are a CELPIP Writing examiner. Evaluate the following writing response based on the CELPIP scoring rubric (bands 1-12).

CELPIP Writing Band Descriptors:
- Bands 10-12: Excellent command of English with minimal errors
- Bands 7-9: Good command with some errors that don't impede communication
- Bands 4-6: Adequate command with errors that may impede communication
- Bands 1-3: Limited command with frequent errors that impede communication

Scoring Criteria:
1. Grammar (25%): Accuracy of grammar structures
2. Vocabulary (25%): Range and appropriateness of vocabulary
3. Coherence (25%): Logical organization and flow
4. Task Relevance (25%): How well the response addresses the prompt

Provide scores for each criterion (1-12) and an overall score. Include detailed feedback and specific improvement tips.

Task Type: {taskType}
Prompt: {prompt}
Response: {response}
Word Count: {wordCount}
`

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { taskType, prompt, response, wordCount } = await request.json()

    if (!taskType || !prompt || !response || !wordCount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Mock scoring result for local testing
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

    return NextResponse.json(scoringResult)
  } catch (error) {
    console.error('Scoring error:', error)
    return NextResponse.json(
      { error: 'Failed to score writing' },
      { status: 500 }
    )
  }
} 