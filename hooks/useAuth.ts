'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasUsedFreeTest, setHasUsedFreeTest] = useState(false)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
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
        .select('has_used_free_test')
        .eq('id', userId)
        .single()

      setHasUsedFreeTest(user?.has_used_free_test ?? false)
    } catch (error) {
      console.error('Error checking free test usage:', error)
      setHasUsedFreeTest(false)
    }
  }

  // Check if guest has used free test
  const checkGuestFreeTestUsage = () => {
    try {
      const guestData = localStorage.getItem('celpip_guest_data')
      if (guestData) {
        const { hasUsedFreeTest: guestHasUsed } = JSON.parse(guestData)
        setHasUsedFreeTest(guestHasUsed ?? false)
      } else {
        setHasUsedFreeTest(false)
      }
    } catch (error) {
      console.error('Error checking guest free test usage:', error)
      setHasUsedFreeTest(false)
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
        hasUsedFreeTest: false
      }
      localStorage.setItem('celpip_guest_data', JSON.stringify(newData))
      return newAnonId
    } catch (error) {
      console.error('Error getting guest anon_id:', error)
      return null
    }
  }

  return {
    user,
    loading,
    hasUsedFreeTest,
    markFreeTestAsUsed,
    getGuestAnonId
  }
} 