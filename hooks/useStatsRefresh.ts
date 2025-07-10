import { useCallback } from 'react'

export const useStatsRefresh = () => {
  const refreshStats = useCallback(() => {
    // Force a page refresh to update stats
    // In a more sophisticated implementation, we could use SWR or React Query
    // to invalidate and refetch the stats data
    window.location.reload()
  }, [])

  return { refreshStats }
} 