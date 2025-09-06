import { motion } from 'motion/react';
import { Heart, ShoppingCart, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Product, formatPrice, getImagePlaceholder } from '../../utils/supabase/client';
import { useAppStore, useCartStore } from '../../lib/store';
import { toast } from 'sonner@2.0.3';

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { setCurrentPage } = useAppStore();
  const { addItem } = useCartStore();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      // Add to local cart state
      addItem({
        id: `temp-${Date.now()}`,
        cart_id: 'temp',
        product_id: product.id,
        quantity: 1,
        products: product,
      });

      toast.success('Added to cart!', {
        description: product.title,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleViewProduct = () => {
    // For this demo, we'll just show a toast
    toast.info('Product details', {
      description: `Viewing ${product.title}`,
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className="group cursor-pointer bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
        onClick={handleViewProduct}
      >
        <div className="relative aspect-square overflow-hidden">
          <ImageWithFallback
            src={product.images?.[0] || getImagePlaceholder()}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.info('Favorites feature coming soon!');
                  }}
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>

            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-md"
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-700 text-xs">
              {product.category}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Title and Price */}
            <div>
              <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-green-700 transition-colors">
                {product.title}
              </h3>
              <p className="text-lg font-bold text-green-600 mt-1">
                {formatPrice(product.price_cents)}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>

            {/* Seller Info */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={product.profiles?.avatar_url} />
                  <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                    {product.profiles?.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">
                  {product.profiles?.username || 'Unknown'}
                </span>
              </div>

              <div className="text-xs text-gray-400">
                {new Date(product.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}