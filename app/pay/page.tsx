'use client'

import { useAuth } from '@/hooks/useAuth'
import Navigation from '@/components/Navigation'
import { CreditCard, CheckCircle, Star, Zap, FileText, Gift, X, Check } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function PayPage() {
  const router = useRouter()
  const { applyPromoCode, promoCodeApplied, remainingTests } = useAuth()
  const [promoCode, setPromoCode] = useState('')
  const [promoCodeLoading, setPromoCodeLoading] = useState(false)
  const [lastAttemptId, setLastAttemptId] = useState<string | null>(null)

  // Fetch last attempt ID on mount
  useEffect(() => {
    const fetchLastAttempt = async () => {
      try {
        const response = await fetch('/api/attempts?limit=1')
        if (response.ok) {
          const data = await response.json()
          if (data.attempts && data.attempts.length > 0) {
            setLastAttemptId(data.attempts[0].id)
          }
        }
      } catch (error) {
        console.error('Error fetching last attempt:', error)
      }
    }

    fetchLastAttempt()
  }, [])

  const handleReviewTest = () => {
    if (lastAttemptId) {
      router.push(`/feedback/${lastAttemptId}`)
    }
  }

  const handlePromoCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!promoCode.trim()) return

    setPromoCodeLoading(true)
    try {
      const success = await applyPromoCode(promoCode.trim())
      if (success) {
        setPromoCode('')
        toast.success('Promo code applied! You now have 10 more tests available.')
        // Redirect to practice page after a short delay
        setTimeout(() => {
          router.push('/practice')
        }, 1500)
      } else {
        toast.error('Invalid promo code. Please try again.')
      }
    } catch (error) {
      toast.error('Error applying promo code. Please try again.')
    } finally {
      setPromoCodeLoading(false)
    }
  }

  const clearPromoCode = () => {
    setPromoCode('')
    // Note: We can't clear the promo code from the global state here
    // as it's already applied. The user would need to refresh or sign out.
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {promoCodeApplied && remainingTests > 0 
              ? `You have ${remainingTests} tests remaining!`
              : "You've Completed Your Free Test!"
            }
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {promoCodeApplied && remainingTests > 0 
              ? `Great! You have ${remainingTests} practice tests available. Start practicing to improve your CELPIP writing skills.`
              : "Great job! You've used your free CELPIP writing practice test. Unlock unlimited practice to improve your skills."
            }
          </p>
        </div>

        {/* Start Practice Button - Show when user has remaining tests */}
        {promoCodeApplied && remainingTests > 0 && (
          <div className="max-w-md mx-auto mb-8">
            <Link
              href="/practice"
              className="w-full bg-celpip-600 hover:bg-celpip-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center text-lg"
            >
              <Zap className="h-5 w-5 mr-2" />
              Start Practice ({remainingTests} tests left)
            </Link>
          </div>
        )}

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

        {/* Pricing Card - Only show if user has no remaining tests */}
        {(!promoCodeApplied || remainingTests === 0) && (
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
        )}

        {/* Promo Code Section - Only show if user has no remaining tests */}
        {(!promoCodeApplied || remainingTests === 0) && (
          <div className="max-w-md mx-auto mt-6 bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-4">
                <Gift className="h-6 w-6 text-celpip-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-gray-900">Have a Promo Code?</h3>
                <p className="text-sm text-gray-600">Enter your code to unlock more tests</p>
              </div>

              {promoCodeApplied ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-semibold">Promo Code Applied!</span>
                  </div>
                  <p className="text-green-700 text-sm">You now have 10 more tests available</p>
                  <button
                    onClick={clearPromoCode}
                    className="mt-2 text-green-600 hover:text-green-800 text-sm underline"
                  >
                    Use different code
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePromoCodeSubmit} className="space-y-3">
                  <div className="flex">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Enter promo code"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-celpip-500 focus:border-transparent"
                      maxLength={10}
                    />
                    <button
                      type="submit"
                      disabled={promoCodeLoading || !promoCode.trim()}
                      className="px-4 py-2 bg-celpip-600 hover:bg-celpip-700 disabled:bg-gray-400 text-white font-semibold rounded-r-lg transition-colors flex items-center"
                    >
                      {promoCodeLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        'Apply'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Remaining Tests Info - Show when user has tests */}
        {promoCodeApplied && remainingTests > 0 && (
          <div className="max-w-md mx-auto mt-6 bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="text-center">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-semibold">Tests Available!</span>
                  </div>
                  <p className="text-green-700 text-sm mb-3">
                    You have <strong>{remainingTests}</strong> practice tests remaining from your promo code.
                  </p>
                  <p className="text-green-600 text-xs">
                    Use them wisely to improve your CELPIP writing skills!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

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