'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useCartStore, useAuthStore } from '@/store'
import { formatPrice, getImagePlaceholder } from '@/lib/supabase'
import { toast } from 'sonner'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export function CartSheet() {
  const { isOpen, setOpen, items, updateQuantity, removeItem, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const router = useRouter()

  const totalAmount = items.reduce((sum, item) => 
    sum + (item.products?.price_cents || 0) * item.quantity, 0
  )

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to checkout')
      return
    }

    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    try {
      // For demo purposes, simulate a successful checkout
      const orderId = `order-${Date.now()}-${Math.random().toString(36).substring(7)}`
      
      // In a real app, we would call the checkout API here
      // const response = await fetch('/api/checkout', { ... })
      
      clearCart()
      setOpen(false)
      
      toast.success('Order placed successfully!', {
        description: `Total: ${formatPrice(totalAmount)}`,
        icon: <Sparkles className="w-4 h-4" />,
      })
      
      // Redirect to orders page
      router.push('/orders')
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Checkout failed', {
        description: 'Please try again',
      })
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Cart
            {items.length > 0 && (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                {items.reduce((sum, item) => sum + item.quantity, 0)} items
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-6 space-y-4">
            <AnimatePresence>
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Your cart is feeling eco-lonely</h3>
                  <p className="text-gray-600 text-sm">Add some sustainable treasures to get started!</p>
                </motion.div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="bg-white border rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.products?.images?.[0] || getImagePlaceholder()}
                          alt={item.products?.title || 'Product'}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {item.products?.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {item.products?.category}
                        </p>
                        <p className="text-lg font-bold text-emerald-600 mt-1">
                          {formatPrice((item.products?.price_cents || 0) * item.quantity)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>

                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1 h-8 w-8 hover:bg-gray-200"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 h-8 w-8 hover:bg-gray-200"
                            disabled={item.quantity >= 10}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Checkout Section */}
          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t pt-6 space-y-4"
            >
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-emerald-600">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-emerald-600">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleCheckout}
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-lg font-medium shadow-lg"
                >
                  Checkout ({formatPrice(totalAmount)})
                </Button>
              </motion.div>

              <p className="text-xs text-center text-gray-500">
                This is a demo checkout. No real payment is processed.
              </p>
            </motion.div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
