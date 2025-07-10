import mongoose from 'mongoose'

const WritingAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  taskType: {
    type: String,
    enum: ['email', 'survey'],
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  wordCount: {
    type: Number,
    required: true,
  },
  timeSpent: {
    type: Number, // in seconds
    required: true,
  },
  score: {
    overall: {
      type: Number,
      min: 1,
      max: 12,
    },
    grammar: {
      type: Number,
      min: 1,
      max: 12,
    },
    vocabulary: {
      type: Number,
      min: 1,
      max: 12,
    },
    coherence: {
      type: Number,
      min: 1,
      max: 12,
    },
    taskRelevance: {
      type: Number,
      min: 1,
      max: 12,
    },
  },
  feedback: {
    type: String,
    required: true,
  },
  improvementTips: [{
    type: String,
  }],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.WritingAttempt || mongoose.model('WritingAttempt', WritingAttemptSchema) 