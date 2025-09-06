import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { Product, formatPrice, getImagePlaceholder } from '../../lib/supabase';
import { useCartStore } from '../../store';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      quantity: 1,
      products: product,
    });
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm mb-4 flex-1 mx-1"
    >
      <TouchableOpacity>
        <View className="relative">
          <Image
            source={{ 
              uri: product.images?.[0] || getImagePlaceholder() 
            }}
            className="w-full h-40 rounded-t-xl"
            resizeMode="cover"
          />
          <View className="absolute top-2 left-2">
            <View className="bg-white/90 px-2 py-1 rounded-full">
              <Text className="text-xs font-medium text-gray-700">
                {product.category}
              </Text>
            </View>
          </View>
        </View>

        <View className="p-3">
          <Text className="font-medium text-gray-900 text-sm mb-1" numberOfLines={2}>
            {product.title}
          </Text>
          <Text className="text-emerald-600 font-bold text-lg mb-2">
            {formatPrice(product.price_cents)}
          </Text>
          <Text className="text-gray-600 text-xs mb-3" numberOfLines={2}>
            {product.description}
          </Text>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-6 h-6 bg-emerald-100 rounded-full items-center justify-center mr-2">
                <Text className="text-emerald-700 text-xs font-medium">
                  {product.profiles?.username?.[0]?.toUpperCase() || 'U'}
                </Text>
              </View>
              <Text className="text-gray-600 text-xs">
                {product.profiles?.username || 'Unknown'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleAddToCart}
              className="bg-emerald-600 w-8 h-8 rounded-full items-center justify-center"
            >
              <Ionicons name="add" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
}
