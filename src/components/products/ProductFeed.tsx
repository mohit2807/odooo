import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, SortAsc, SortDesc } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import { useAppStore } from '../../lib/store';
import { CATEGORIES, Product, projectId, publicAnonKey } from '../../utils/supabase/client';

export function ProductFeed() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { searchQuery, selectedCategory, sortBy, setSelectedCategory, setSortBy } = useAppStore();

  const fetchProducts = async (pageNum = 1, reset = false) => {
    try {
      setIsLoading(true);
      
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '24',
        sort: sortBy,
      });
      
      if (searchQuery) params.append('query', searchQuery);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-353bc013/products?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      const newProducts = data.products || [];

      if (reset || pageNum === 1) {
        setProducts(newProducts);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }

      setHasMore(newProducts.length === 24);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchProducts(1, true);
  }, [searchQuery, selectedCategory, sortBy]);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

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
                ? 'bg-green-600 hover:bg-green-700' 
                : 'hover:border-green-500 hover:text-green-600'
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
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'hover:border-green-500 hover:text-green-600'
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
                <SelectItem value="created_at_desc">
                  <div className="flex items-center gap-2">
                    <SortDesc className="w-4 h-4" />
                    Newest First
                  </div>
                </SelectItem>
                <SelectItem value="price_asc">
                  <div className="flex items-center gap-2">
                    <SortAsc className="w-4 h-4" />
                    Price: Low to High
                  </div>
                </SelectItem>
                <SelectItem value="price_desc">
                  <div className="flex items-center gap-2">
                    <SortDesc className="w-4 h-4" />
                    Price: High to Low
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {searchQuery && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Search: "{searchQuery}"
            </Badge>
          )}
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
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
              setSelectedCategory('all');
              setSelectedCategory('all');
            }}
            variant="outline"
            className="hover:border-green-500 hover:text-green-600"
          >
            Clear Filters
          </Button>
        </motion.div>
      )}

      {/* Load More */}
      {!isLoading && products.length > 0 && hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <Button
            onClick={handleLoadMore}
            variant="outline"
            size="lg"
            className="hover:border-green-500 hover:text-green-600"
          >
            Load More Products
          </Button>
        </motion.div>
      )}
    </div>
  );
}