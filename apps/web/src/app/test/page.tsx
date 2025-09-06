'use client'

import { useAuthStore } from '@/store/auth'

export default function TestPage() {
  const { user, profile, loading } = useAuthStore()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
      <div className="space-y-4">
        <div>
          <strong>Loading:</strong> {loading ? 'true' : 'false'}
        </div>
        <div>
          <strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'null'}
        </div>
        <div>
          <strong>Profile:</strong> {profile ? JSON.stringify(profile, null, 2) : 'null'}
        </div>
        <div>
          <strong>Environment:</strong> {process.env.NODE_ENV}
        </div>
      </div>
    </div>
  )
}
