'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { User, LogOut, Home, FileText, LogIn, BookOpen } from 'lucide-react'

export default function Navigation() {
  const { data: session } = useSession()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center text-xl font-bold text-celpip-600"
            >
              <FileText className="h-8 w-8 mr-2" />
              CELPIP Practice
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Home className="h-4 w-4 mr-1" />
              Dashboard
            </Link>

            <Link
              href="/tips"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Writing Tips
            </Link>

            {session ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center text-sm text-gray-700">
                  <User className="h-4 w-4 mr-1" />
                  {session.user?.name}
                </div>
                
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-celpip-600 hover:bg-celpip-700 rounded-md transition-colors"
              >
                <LogIn className="h-4 w-4 mr-1" />
                Sign In / Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 