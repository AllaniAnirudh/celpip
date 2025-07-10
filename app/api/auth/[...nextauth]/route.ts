import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
// import bcrypt from 'bcryptjs'
// import dbConnect from '@/lib/mongodb'
// import User from '@/models/User'

const handler = NextAuth({
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
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-for-development',
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
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
})

export { handler as GET, handler as POST } 