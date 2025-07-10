export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
  lastLogin: Date
}

export interface WritingAttempt {
  id: string
  userId: string
  taskType: 'email' | 'survey'
  prompt: string
  response: string
  wordCount: number
  timeSpent: number
  score: {
    overall: number
    grammar: number
    vocabulary: number
    coherence: number
    taskRelevance: number
  }
  feedback: string
  improvementTips: string[]
  submittedAt: Date
}

export interface ScoringResult {
  overall: number
  grammar: number
  vocabulary: number
  coherence: number
  taskRelevance: number
  feedback: string
  improvementTips: string[]
}

export interface WritingPrompt {
  id: number
  title: string
  prompt: string
}

export interface Session {
  user: {
    id: string
    name: string
    email: string
  }
  expires: string
} 