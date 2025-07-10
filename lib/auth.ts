import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import crypto from 'crypto'

// Generate a secure fallback secret if none is provided
const generateSecret = () => {
  if (process.env.NEXTAUTH_SECRET) {
    return process.env.NEXTAUTH_SECRET
  }
  
  // Generate a secure random secret for production
  if (process.env.NODE_ENV === 'production') {
    return crypto.randomBytes(32).toString('hex')
  }
  
  // Development fallback
  return 'development-secret-key-change-in-production-12345'
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Mock authentication for local testing
        // In production, this would connect to MongoDB and verify credentials
        if (credentials.email === 'test@example.com' && credentials.password === 'password') {
          return {
            id: 'mock-user-id',
            email: credentials.email,
            name: 'Test User',
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: generateSecret(),
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    // signUp: '/auth/signup', // Not supported by NextAuth
  },
} 