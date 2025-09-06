'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'

export default function HomePage() {
  const { user, loading } = useAuthStore()
  const router = useRouter()
  
  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/feed')
      } else {
        router.push('/login')
      }
    }
  }, [user, loading, router])
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return null
}
