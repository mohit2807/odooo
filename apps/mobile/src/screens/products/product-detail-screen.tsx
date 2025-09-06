import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Product } from '@ecofinds/types';
import { formatPrice, getImagePlaceholder } from '../../lib/supabase';
import { useCartStore } from '../../store';

export function ProductDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params as { productId: string };
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          profiles:owner_id (username, avatar_url)
        `)
        .eq('id', productId)
        .single();

      if (error) {
        throw error;
      }

      return data as Product;
    },
  });

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      product_id: product.id,
      quantity,
      products: product,
    });

    Alert.alert('Success', 'Added to cart!');
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-600">Loading...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-600">Product not found</Text>
      </View>
    );
  }

  const images = product.images.length > 0 ? product.images : [getImagePlaceholder()];

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">Product Details</Text>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Images */}
      <View className="relative">
        <Image
          source={{ uri: images[selectedImageIndex] }}
          className="w-full h-80"
          resizeMode="cover"
        />
        {images.length > 1 && (
          <View className="absolute bottom-4 left-0 right-0 flex-row justify-center space-x-2">
            {images.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImageIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  selectedImageIndex === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </View>
        )}
      </View>

      {/* Product Info */}
      <View className="p-4">
        <View className="flex-row items-center justify-between mb-2">
          <View className="bg-emerald-100 px-3 py-1 rounded-full">
            <Text className="text-emerald-800 text-sm font-medium">
              {product.category}
            </Text>
          </View>
        </View>

        <Text className="text-2xl font-bold text-gray-900 mb-2">
          {product.title}
        </Text>

        <Text className="text-3xl font-bold text-emerald-600 mb-4">
          {formatPrice(product.price_cents)}
        </Text>

        <Text className="text-gray-600 leading-relaxed mb-6">
          {product.description}
        </Text>

        {/* Seller Info */}
        <View className="bg-gray-50 rounded-xl p-4 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-2">Seller</Text>
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-emerald-100 rounded-full items-center justify-center mr-3">
              <Text className="text-emerald-700 font-medium">
                {product.profiles?.username?.[0]?.toUpperCase() || 'U'}
              </Text>
            </View>
            <View>
              <Text className="font-medium text-gray-900">
                {product.profiles?.username || 'Unknown Seller'}
              </Text>
              <Text className="text-gray-600 text-sm">Verified Seller</Text>
            </View>
          </View>
        </View>

        {/* Quantity Selector */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Quantity</Text>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 bg-gray-200 rounded-lg items-center justify-center"
            >
              <Ionicons name="remove" size={20} color="#374151" />
            </TouchableOpacity>
            <Text className="mx-4 text-lg font-medium">{quantity}</Text>
            <TouchableOpacity
              onPress={() => setQuantity(Math.min(10, quantity + 1))}
              className="w-10 h-10 bg-gray-200 rounded-lg items-center justify-center"
            >
              <Ionicons name="add" size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Add to Cart Button */}
        <MotiView
          from={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 300 }}
        >
          <TouchableOpacity
            onPress={handleAddToCart}
            className="bg-emerald-600 rounded-xl py-4 items-center"
          >
            <Text className="text-white font-semibold text-lg">
              Add to Cart - {formatPrice(product.price_cents * quantity)}
            </Text>
          </TouchableOpacity>
        </MotiView>
      </View>
    </ScrollView>
  );
}
