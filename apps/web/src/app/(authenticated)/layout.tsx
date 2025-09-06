'use client'

import React, { useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { CartSheet } from '@/components/cart/cart-sheet'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <CartSheet />
    </div>
  )
}
