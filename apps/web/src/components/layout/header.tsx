'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, ShoppingCart, Plus, User, Leaf, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuthStore, useCartStore, useAppStore } from '@/store'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export function Header() {
  const { user, profile, setUser, setProfile } = useAuthStore()
  const { items, toggleCart } = useCartStore()
  const { searchQuery, setSearchQuery } = useAppStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      toast.success('Signed out successfully')
      router.push('/login')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out')
    }
  }

  const navItems = [
    { id: 'feed', label: 'Browse', icon: Search, href: '/feed' },
    { id: 'sell', label: 'Sell', icon: Plus, href: '/sell/new' },
    { id: 'dashboard', label: 'Profile', icon: User, href: '/dashboard' },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push('/feed')}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">EcoFinds</span>
        </motion.div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search sustainable products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <motion.div key={item.id} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(item.href)}
                  className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              </motion.div>
            )
          })}
          
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCart}
              className="relative text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 bg-emerald-600 hover:bg-emerald-700 min-w-[20px] h-5 text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </motion.div>
          
          {/* User Avatar */}
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-emerald-100 text-emerald-700">
                {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="text-gray-600 hover:text-red-600"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t bg-white"
        >
          <div className="px-4 py-4 space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <motion.div key={item.id} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => {
                      router.push(item.href)
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full justify-start text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </motion.div>
              )
            })}
            
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  toggleCart()
                  setIsMobileMenuOpen(false)
                }}
                className="w-full justify-start text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
                {cartItemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="ml-auto bg-emerald-600 hover:bg-emerald-700 min-w-[20px] h-5 text-xs"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </motion.div>

            <div className="pt-4 border-t">
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 text-lg">
                    {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{profile?.username}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
