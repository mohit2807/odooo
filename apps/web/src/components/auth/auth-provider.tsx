'use client'

import React, { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, setLoading } = useAuthStore()

  useEffect(() => {
    // Development mode - bypass authentication for testing
    console.log('AuthProvider useEffect running, NODE_ENV:', process.env.NODE_ENV)
    
    // Always set mock user for now to test
    console.log('Setting mock user for testing')
    const mockUser = {
      id: 'dev-user-123',
      email: 'dev@ecofinds.com',
      user_metadata: {},
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    }
    
    const mockProfile = {
      id: 'dev-user-123',
      username: 'devuser',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    setUser(mockUser as any)
    setProfile(mockProfile)
    setLoading(false)
    return

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    )

    getInitialSession()

    return () => subscription.unsubscribe()
  }, [setUser, setProfile, setLoading])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error)
    }
  }

  return <>{children}</>
}
