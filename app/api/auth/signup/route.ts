import { NextRequest, NextResponse } from 'next/server'
// import bcrypt from 'bcryptjs'
// import dbConnect from '@/lib/mongodb'
// import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Mock signup for local testing
    // In production, this would save to MongoDB
    console.log('Mock signup:', { name, email, password })

    return NextResponse.json(
      { 
        message: 'User created successfully (mock)',
        user: {
          id: 'mock-user-id',
          name,
          email,
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 