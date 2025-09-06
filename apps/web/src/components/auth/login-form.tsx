'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { signInSchema, type SignInFormData } from '@/lib/validations'
import { toast } from 'sonner'
import Link from 'next/link'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true)
    
    try {
      console.log('Attempting to sign in with:', data.email)
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      console.log('Auth response:', { authData, error })

      if (error) {
        console.error('Sign in error:', error)
        
        if (error.message.includes('Email not confirmed')) {
          toast.error('Email not confirmed', {
            description: 'Please check your email and click the confirmation link before signing in.',
          })
        } else if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid credentials', {
            description: 'Please check your email and password.',
          })
        } else {
          toast.error('Sign in failed', {
            description: error.message,
          })
        }
      } else {
        console.log('Sign in successful:', authData)
        toast.success('Welcome back!', {
          description: 'You have successfully signed in.',
        })
        router.push('/feed')
      }
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error('An error occurred', {
        description: 'Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-4"
            >
              <Leaf className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl text-gray-800">Welcome to EcoFinds</CardTitle>
            <p className="text-gray-600 text-sm">Sustainable second-hand marketplace</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...register('email')}
                  className="h-12"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Your password"
                    {...register('password')}
                    className="h-12 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>

              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </motion.div>
            </form>

            <div className="mt-6 space-y-4">
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/signup"
                    className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
