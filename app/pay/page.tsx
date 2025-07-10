'use client'

import { useAuth } from '@/hooks/useAuth'
import Navigation from '@/components/Navigation'
import { CreditCard, CheckCircle, Star, Zap, FileText } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PayPage() {
  const { user, hasUsedFreeTest, getGuestAnonId } = useAuth()
  const [lastAttemptId, setLastAttemptId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchLastAttempt = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/attempts?limit=1')
        if (response.ok) {
          const data = await response.json()
          if (data.attempts && data.attempts.length > 0) {
            setLastAttemptId(data.attempts[0].id)
          }
        }
      } catch (error) {
        console.error('Error fetching last attempt:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLastAttempt()
  }, [])

  const handleReviewTest = () => {
    if (lastAttemptId) {
      router.push(`/feedback/${lastAttemptId}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            You've Completed Your Free Test!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Great job! You've used your free CELPIP writing practice test. 
            Unlock unlimited practice to improve your skills.
          </p>
        </div>

        {/* Review Test Button */}
        {lastAttemptId && (
          <div className="max-w-md mx-auto mb-8">
            <button
              onClick={handleReviewTest}
              className="w-full bg-celpip-600 hover:bg-celpip-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center text-lg"
            >
              <FileText className="h-5 w-5 mr-2" />
              Review My Test
            </button>
          </div>
        )}

        {/* Pricing Card */}
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-celpip-600 to-celpip-700 px-6 py-8 text-white text-center">
            <Star className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Unlimited Practice</h2>
            <p className="text-celpip-100">Perfect for serious test preparation</p>
          </div>
          
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-2">
                <span className="text-4xl font-bold text-gray-900">$1</span>
                <span className="text-gray-500 ml-2">one-time</span>
              </div>
              <p className="text-gray-600">Lifetime access to all features</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700">Unlimited writing practice tests</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700">AI-powered feedback and scoring</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700">Progress tracking and analytics</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700">Writing tips and strategies</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700">Access to all task types</span>
              </div>
            </div>

            {/* Stripe Checkout Button (commented out for now) */}
            <button
              className="w-full bg-celpip-600 hover:bg-celpip-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              disabled
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Stripe Checkout (Coming Soon)
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              Secure payment processing with Stripe
            </p>
          </div>
        </div>

        {/* Alternative Actions */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-celpip-500 transition-colors"
            >
              <Zap className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
            <Link
              href="/tips"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              View Writing Tips
            </Link>
          </div>
        </div>

        {/* Testimonials or Benefits */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Zap className="h-8 w-8 text-celpip-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Practice Makes Perfect</h3>
              <p className="text-gray-600">
                Regular practice with AI feedback helps you identify and improve your weak areas.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Star className="h-8 w-8 text-celpip-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real CELPIP Format</h3>
              <p className="text-gray-600">
                Practice with authentic CELPIP writing tasks and timing to build confidence.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <CheckCircle className="h-8 w-8 text-celpip-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Feedback</h3>
              <p className="text-gray-600">
                Get detailed scoring and improvement suggestions immediately after each attempt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 