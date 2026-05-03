// src/contexts/UserContext.tsx
// Auth state + activityVersion cache-busting
// bumpActivity() must be called after EVERY mutation in the app

import {
    createContext, useContext, useState,
    useCallback, useEffect, type ReactNode
  } from 'react'
  import type { User } from '@supabase/supabase-js'
  import { supabase } from '../lib/supabase'
  
  interface UserContextType {
    user: User | null
    authLoading: boolean
    activityVersion: number   // increment to trigger re-fetch in all hooks
    bumpActivity: () => void  // call after every log/save mutation
  }
  
  const UserContext = createContext<UserContextType | null>(null)
  
  export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser]                     = useState<User | null>(null)
    const [authLoading, setAuthLoading]       = useState(true)
    const [activityVersion, setActivityVersion] = useState(0)
  
    useEffect(() => {
      // Get existing session on mount
      supabase.auth.getSession().then(({ data }) => {
        setUser(data.session?.user ?? null)
        setAuthLoading(false)
      })
  
      // Keep in sync with auth state changes (login, logout, token refresh)
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })
  
      return () => listener.subscription.unsubscribe()
    }, [])
  
    // Stable reference — safe to use in useEffect dependency arrays
    const bumpActivity = useCallback(() => {
      setActivityVersion(v => v + 1)
    }, [])
  
    return (
      <UserContext.Provider value={{ user, authLoading, activityVersion, bumpActivity }}>
        {children}
      </UserContext.Provider>
    )
  }
  
  export function useUserContext(): UserContextType {
    const ctx = useContext(UserContext)
    if (!ctx) throw new Error('useUserContext must be used inside UserProvider')
    return ctx
  }