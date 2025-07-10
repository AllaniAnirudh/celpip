import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'

export function useStatsRefresh() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { user, getGuestAnonId } = useAuth()

  const refreshStats = useCallback(async () => {
    setIsRefreshing(true)
    try {
      // Get guest ID for guest users
      const guestId = !user ? getGuestAnonId() : null
      
      // Build URL with guest ID for guest users
      const url = guestId ? `/api/stats?guestId=${guestId}` : '/api/stats'
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to refresh stats')
      }
      
      // Trigger a page refresh to update the dashboard
      window.location.reload()
    } catch (error) {
      console.error('Error refreshing stats:', error)
    } finally {
      setIsRefreshing(false)
    }
  }, [user, getGuestAnonId])

  return { refreshStats, isRefreshing }
} 