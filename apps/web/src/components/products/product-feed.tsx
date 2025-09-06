'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, SortAsc, SortDesc } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProductCard } from './product-card'
import { ProductCardSkeleton } from './product-card-skeleton'
import { useAppStore } from '@/store'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Product, CATEGORIES } from '@/types'

const SORT_OPTIONS = [
  { value: 'created_at_desc', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
] as const;

export function ProductFeed() {
  const { searchQuery, selectedCategory, sortBy, setSelectedCategory, setSortBy } = useAppStore()
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', searchQuery, selectedCategory, sortBy, page],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          profiles:owner_id (username, avatar_url)
        `)
        .eq('is_active', true)

      // Add search filter
      if (searchQuery) {
        query = query.textSearch('title', searchQuery)
      }

      // Add category filter
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory)
      }

      // Add sorting
      switch (sortBy) {
        case 'price_asc':
          query = query.order('price_cents', { ascending: true })
          break
        case 'price_desc':
          query = query.order('price_cents', { ascending: false })
          break
        default:
          query = query.order('created_at', { ascending: false })
      }

      // Add pagination
      const limit = 24
      const offset = (page - 1) * limit
      query = query.range(offset, offset + limit - 1)

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data as Product[]
    },
  })

  const products = data || []

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    setPage(1)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Filter className="w-12 h-12 text-red-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">Error loading products</h3>
        <p className="text-gray-600 mb-6">
          Something went wrong while loading the products. Please try again.
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="hover:border-emerald-500 hover:text-emerald-600"
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryFilter('all')}
              className={selectedCategory === 'all' 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'hover:border-emerald-500 hover:text-emerald-600'
              }
            >
              All
            </Button>
            {CATEGORIES.map((category) => (
              <motion.div
                key={category}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryFilter(category)}
                  className={selectedCategory === category
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'hover:border-emerald-500 hover:text-emerald-600'
                  }
                >
                  {category}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {option.value.includes('price') ? (
                        option.value.includes('asc') ? (
                          <SortAsc className="w-4 h-4" />
                        ) : (
                          <SortDesc className="w-4 h-4" />
                        )
                      ) : (
                        <SortDesc className="w-4 h-4" />
                      )}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {searchQuery && (
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
              Search: &quot;{searchQuery}&quot;
            </Badge>
          )}
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
              Category: {selectedCategory}
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </AnimatePresence>

        {/* Loading Skeletons */}
        {isLoading && products.length === 0 && (
          Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))
        )}
      </motion.div>

      {/* Empty State */}
      {!isLoading && products.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || selectedCategory !== 'all'
              ? 'Try adjusting your search or filters'
              : 'No listings yet. Be the first to sell something you love!'
            }
          </p>
          <Button
            onClick={() => {
              setSelectedCategory('all')
              setPage(1)
            }}
            variant="outline"
            className="hover:border-emerald-500 hover:text-emerald-600"
          >
            Clear Filters
          </Button>
        </motion.div>
      )}
    </div>
  )
}
