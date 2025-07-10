'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasUsedFreeTest, setHasUsedFreeTest] = useState(false)
  const [promoCodeApplied, setPromoCodeApplied] = useState(false)
  const [remainingTests, setRemainingTests] = useState(0)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Check free test usage based on user state
      if (session?.user) {
        await ensureUserExists(session.user)
        await checkFreeTestUsage(session.user.id)
      } else {
        // Check guest free test usage on initial load
        checkGuestFreeTestUsage()
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)

        // If user signed in, ensure they exist in users table
        if (session?.user) {
          await ensureUserExists(session.user)
          await checkFreeTestUsage(session.user.id)
        } else {
          // User signed out, check guest free test usage
          checkGuestFreeTestUsage()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Ensure user exists in users table
  const ensureUserExists = async (user: User) => {
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!existingUser) {
        await supabase.from('users').insert({
          id: user.id,
          email: user.email,
          created_at: new Date().toISOString(),
          has_used_free_test: false
        })
      }
    } catch (error) {
      console.error('Error ensuring user exists:', error)
    }
  }

  // Check if signed-in user has used free test
  const checkFreeTestUsage = async (userId: string) => {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('has_used_free_test, promo_code_applied, remaining_tests')
        .eq('id', userId)
        .single()

      setHasUsedFreeTest(user?.has_used_free_test ?? false)
      setPromoCodeApplied(user?.promo_code_applied ?? false)
      setRemainingTests(user?.remaining_tests ?? 0)
    } catch (error) {
      console.error('Error checking free test usage:', error)
      setHasUsedFreeTest(false)
      setPromoCodeApplied(false)
      setRemainingTests(0)
    }
  }

  // Check if guest has used free test
  const checkGuestFreeTestUsage = () => {
    try {
      const guestData = localStorage.getItem('celpip_guest_data')
      console.log('Checking guest free test usage. Guest data:', guestData)
      
      if (guestData) {
        const { hasUsedFreeTest: guestHasUsed, promoCodeApplied: guestPromoApplied, remainingTests: guestRemaining } = JSON.parse(guestData)
        console.log('Parsed guest data:', { guestHasUsed, guestPromoApplied, guestRemaining })
        setHasUsedFreeTest(guestHasUsed ?? false)
        setPromoCodeApplied(guestPromoApplied ?? false)
        setRemainingTests(guestRemaining ?? 0)
      } else {
        console.log('No guest data found, setting defaults')
        setHasUsedFreeTest(false)
        setPromoCodeApplied(false)
        setRemainingTests(0)
      }
    } catch (error) {
      console.error('Error checking guest free test usage:', error)
      setHasUsedFreeTest(false)
      setPromoCodeApplied(false)
      setRemainingTests(0)
    }
  }

  // Mark free test as used
  const markFreeTestAsUsed = async () => {
    if (user) {
      // Signed-in user
      try {
        await supabase
          .from('users')
          .update({ has_used_free_test: true })
          .eq('id', user.id)
        setHasUsedFreeTest(true)
      } catch (error) {
        console.error('Error marking free test as used:', error)
      }
    } else {
      // Guest user
      try {
        const guestData = localStorage.getItem('celpip_guest_data')
        const existingData = guestData ? JSON.parse(guestData) : {}
        
        const newData = {
          ...existingData,
          anon_id: existingData.anon_id || uuidv4(),
          hasUsedFreeTest: true
        }
        
        localStorage.setItem('celpip_guest_data', JSON.stringify(newData))
        setHasUsedFreeTest(true)
      } catch (error) {
        console.error('Error marking guest free test as used:', error)
      }
    }
  }

  // Apply promo code
  const applyPromoCode = async (code: string): Promise<boolean> => {
    // Static promo code validation
    if (code === 'CELPIP10') {
      if (user) {
        // Signed-in user
        try {
          await supabase
            .from('users')
            .update({ 
              promo_code_applied: true,
              remaining_tests: 10
            })
            .eq('id', user.id)
          
          setPromoCodeApplied(true)
          setRemainingTests(10)
          return true
        } catch (error) {
          console.error('Error applying promo code for signed-in user:', error)
          return false
        }
      } else {
        // Guest user
        try {
          const guestData = localStorage.getItem('celpip_guest_data')
          const existingData = guestData ? JSON.parse(guestData) : {}
          
          const newData = {
            ...existingData,
            anon_id: existingData.anon_id || uuidv4(),
            promoCodeApplied: true,
            remainingTests: 10
          }
          
          localStorage.setItem('celpip_guest_data', JSON.stringify(newData))
          setPromoCodeApplied(true)
          setRemainingTests(10)
          return true
        } catch (error) {
          console.error('Error applying promo code for guest:', error)
          return false
        }
      }
    }
    return false
  }

  // Get guest anon_id
  const getGuestAnonId = () => {
    try {
      const guestData = localStorage.getItem('celpip_guest_data')
      if (guestData) {
        const { anon_id } = JSON.parse(guestData)
        return anon_id
      }
      
      // Generate new anon_id if none exists
      const newAnonId = uuidv4()
      const newData = {
        anon_id: newAnonId,
        hasUsedFreeTest: false,
        promoCodeApplied: false,
        remainingTests: 0
      }
      localStorage.setItem('celpip_guest_data', JSON.stringify(newData))
      return newAnonId
    } catch (error) {
      console.error('Error getting guest anon_id:', error)
      return null
    }
  }

  // Check if user can take more tests
  const canTakeMoreTests = () => {
    const result = promoCodeApplied && remainingTests > 0 ? true : !hasUsedFreeTest
    console.log('canTakeMoreTests check:', {
      user: user?.id || 'guest',
      promoCodeApplied,
      remainingTests,
      hasUsedFreeTest,
      result
    })
    return result
  }

  // Decrement remaining tests
  const decrementRemainingTests = async () => {
    if (remainingTests > 0) {
      if (user) {
        // Signed-in user
        try {
          await supabase
            .from('users')
            .update({ remaining_tests: remainingTests - 1 })
            .eq('id', user.id)
          setRemainingTests(remainingTests - 1)
        } catch (error) {
          console.error('Error decrementing remaining tests:', error)
        }
      } else {
        // Guest user
        try {
          const guestData = localStorage.getItem('celpip_guest_data')
          const existingData = guestData ? JSON.parse(guestData) : {}
          
          const newData = {
            ...existingData,
            remainingTests: remainingTests - 1
          }
          
          localStorage.setItem('celpip_guest_data', JSON.stringify(newData))
          setRemainingTests(remainingTests - 1)
        } catch (error) {
          console.error('Error decrementing remaining tests for guest:', error)
        }
      }
    }
  }

  return {
    user,
    loading,
    hasUsedFreeTest,
    promoCodeApplied,
    remainingTests,
    markFreeTestAsUsed,
    getGuestAnonId,
    applyPromoCode,
    canTakeMoreTests,
    decrementRemainingTests
  }
} 