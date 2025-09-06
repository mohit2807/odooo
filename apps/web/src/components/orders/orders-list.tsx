'use client'

import { motion } from 'framer-motion'
import { Package, Calendar, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/supabase'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Order, OrderItem } from '@/types'

export function OrdersList() {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              title,
              images
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data as (Order & { order_items: (OrderItem & { products: { title: string; images: string[] } })[] })[]
    },
  })

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      PAID: 'bg-emerald-100 text-emerald-800',
      CANCELLED: 'bg-red-100 text-red-800',
    }
    
    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Orders</h1>
          <p className="text-gray-600">Track your sustainable purchases</p>
        </motion.div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-12 h-12 text-red-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">Error loading orders</h3>
        <p className="text-gray-600 mb-6">
          Something went wrong while loading your orders. Please try again.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Orders</h1>
        <p className="text-gray-600">Track your sustainable purchases</p>
      </motion.div>

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.order_items.map((item, itemIndex) => (
                        <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{item.products.title}</p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-medium text-emerald-600">
                            {formatPrice(item.price_cents * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        <span className="text-lg font-bold text-emerald-600">
                          {formatPrice(order.total_cents)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No purchases yet</h3>
          <p className="text-gray-600 mb-6">
            Start your sustainable journey by browsing our eco-friendly products!
          </p>
        </motion.div>
      )}
    </div>
  )
}
