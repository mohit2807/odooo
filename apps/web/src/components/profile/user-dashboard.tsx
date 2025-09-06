'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { User, Camera, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/store'
import { supabase } from '@/lib/supabase'
import { profileSchema, type ProfileFormData } from '@/lib/validations'
import { toast } from 'sonner'
import Image from 'next/image'

export function UserDashboard() {
  const { user, profile, setProfile } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || '',
    },
  })

  const watchedUsername = watch('username')

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image too large', {
        description: 'Please select an image smaller than 5MB',
      })
      return
    }

    setIsUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id)

      if (updateError) {
        throw updateError
      }

      setProfile({ ...profile!, avatar_url: data.publicUrl })
      toast.success('Avatar updated!')
    } catch (error) {
      console.error('Avatar upload error:', error)
      toast.error('Failed to upload avatar', {
        description: error instanceof Error ? error.message : 'Please try again',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return

    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username: data.username })
        .eq('id', user.id)

      if (error) {
        throw error
      }

      setProfile({ ...profile!, username: data.username })
      toast.success('Profile updated!')
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Failed to update profile', {
        description: error instanceof Error ? error.message : 'Please try again',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 text-2xl">
                      {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="avatar-upload"
                    disabled={isUploading}
                  />
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Click the camera icon to upload a new avatar
                </p>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Choose a username"
                  {...register('username')}
                  className="h-12"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username.message}</p>
                )}
              </div>

              {/* Email (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="h-12 bg-gray-50"
                />
                <p className="text-sm text-gray-500">
                  Email cannot be changed. Contact support if you need to update your email.
                </p>
              </div>

              {/* Current Username Display */}
              {watchedUsername && watchedUsername !== profile?.username && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg">
                  <span className="text-sm text-gray-600">New username:</span>
                  <span className="font-medium text-emerald-800">{watchedUsername}</span>
                </div>
              )}

              {/* Submit Button */}
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-lg font-medium shadow-lg"
                  disabled={isLoading || isUploading}
                >
                  {isLoading ? (
                    'Saving...'
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
