/**
 * useAuth — authentication state management hook
 */
import { useState, useEffect, useCallback, useRef } from 'react'

const API_BASE = 'https://watermelon-clock-api.yuchangzhou.workers.dev'
const TOKEN_KEY = 'wc_access_token'

export interface User {
  id: string
  email: string
  displayName: string | null
  avatarUrl: string | null
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current)
      refreshTimerRef.current = null
    }
  }, [])

  const scheduleRefresh = useCallback((token: string) => {
    // Parse JWT to get exp
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
      const expiresIn = payload.exp * 1000 - Date.now()
      // Refresh 1 minute before expiry
      const refreshIn = Math.max(expiresIn - 60_000, 10_000)
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
      refreshTimerRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`${API_BASE}/api/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
          })
          if (res.ok) {
            const data = await res.json() as { accessToken: string }
            localStorage.setItem(TOKEN_KEY, data.accessToken)
            scheduleRefresh(data.accessToken)
          } else {
            clearAuth()
          }
        } catch {
          clearAuth()
        }
      }, refreshIn)
    } catch {
      // Invalid token format
    }
  }, [clearAuth])

  const fetchMe = useCallback(async (token: string): Promise<User | null> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return null
      const data = await res.json() as { user: User }
      return data.user
    } catch {
      return null
    }
  }, [])

  // Initialize: check token + fetch user
  useEffect(() => {
    const init = async () => {
      // Check URL fragment for OAuth callback
      const hash = window.location.hash
      if (hash.includes('access_token=')) {
        const token = hash.split('access_token=')[1]?.split('&')[0]
        if (token) {
          localStorage.setItem(TOKEN_KEY, token)
          // Clean URL
          window.history.replaceState(null, '', window.location.pathname + window.location.search)
        }
      }

      const token = localStorage.getItem(TOKEN_KEY)
      if (!token) {
        setIsLoading(false)
        return
      }

      const me = await fetchMe(token)
      if (me) {
        setUser(me)
        scheduleRefresh(token)
      } else {
        localStorage.removeItem(TOKEN_KEY)
      }
      setIsLoading(false)
    }
    init()
  }, [fetchMe, scheduleRefresh])

  const login = useCallback(async (accessToken: string) => {
    localStorage.setItem(TOKEN_KEY, accessToken)
    const me = await fetchMe(accessToken)
    if (me) {
      setUser(me)
      scheduleRefresh(accessToken)
    }
  }, [fetchMe, scheduleRefresh])

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch {
      // Best effort
    }
    clearAuth()
  }, [clearAuth])

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  }
}
