'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, ShoppingCart, User, Calendar, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCartStore } from '@/store'
import { formatPrice, getImagePlaceholder } from '@/lib/supabase'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import { toast } from 'sonner'
import Image from 'next/image'

interface ProductDetailProps {
  productId: string
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCartStore()
  const router = useRouter()

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          profiles:owner_id (username, avatar_url)
        `)
        .eq('id', productId)
        .single()

      if (error) {
        throw error
      }

      return data as Product
    },
  })

  const handleAddToCart = async () => {
    if (!product) return

    try {
      addItem({
        product_id: product.id,
        quantity,
        products: product,
      })

      toast.success('Added to cart!', {
        description: `${quantity}x ${product.title}`,
      })
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-2xl"></div>
              <div className="flex space-x-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto text-center py-16">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-12 h-12 text-red-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">Product not found</h3>
        <p className="text-gray-600 mb-6">
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button
          onClick={() => router.push('/feed')}
          variant="outline"
          className="hover:border-emerald-500 hover:text-emerald-600"
        >
          Back to Feed
        </Button>
      </div>
    )
  }

  const images = product.images.length > 0 ? product.images : [getImagePlaceholder()]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
            <Image
              src={images[selectedImageIndex]}
              alt={product.title}
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
          
          {images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index
                      ? 'border-emerald-500'
                      : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                {product.category}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
            <p className="text-3xl font-bold text-emerald-600 mb-6">
              {formatPrice(product.price_cents)}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Seller Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={product.profiles?.avatar_url} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700">
                    {product.profiles?.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">
                    {product.profiles?.username || 'Unknown Seller'}
                  </p>
                  <p className="text-sm text-gray-500">Seller</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                Quantity:
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-8 w-8 p-0"
                >
                  -
                </Button>
                <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="h-8 w-8 p-0"
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex space-x-3">
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-lg font-medium shadow-lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
              </motion.div>
              
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => toast.info('Favorites feature coming soon!')}
                  className="px-6"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Product Details */}
          <div className="pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Listed {new Date(product.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Package className="w-4 h-4" />
                <span>Category: {product.category}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
