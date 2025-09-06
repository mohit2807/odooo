import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { Product } from '@ecofinds/types';
import { ProductCard } from '../../components/products/product-card';

export function FeedScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['products', searchQuery, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          profiles:owner_id (username, avatar_url)
        `)
        .eq('is_active', true);

      if (searchQuery) {
        query = query.textSearch('title', searchQuery);
      }

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as Product[];
    },
  });

  const categories = [
    'all', 'Electronics', 'Fashion & Apparel', 'Home & Living', 
    'Books & Media', 'Sports & Outdoors', 'Toys & Games', 
    'Automotive', 'Collectibles', 'Other'
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderProduct = ({ item, index }: { item: Product; index: number }) => (
    <MotiView
      from={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 100 }}
    >
      <ProductCard product={item} />
    </MotiView>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center space-x-3 mb-4">
          <View className="w-8 h-8 bg-emerald-500 rounded-lg items-center justify-center">
            <Ionicons name="leaf" size={20} color="white" />
          </View>
          <Text className="text-xl font-bold text-gray-800">EcoFinds</Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search sustainable products..."
            className="flex-1 ml-2 text-gray-800"
          />
        </View>
      </View>

      {/* Category Filter */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedCategory(item)}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedCategory === item
                  ? 'bg-emerald-600'
                  : 'bg-gray-100'
              }`}
            >
              <Text
                className={`font-medium ${
                  selectedCategory === item
                    ? 'text-white'
                    : 'text-gray-700'
                }`}
              >
                {item === 'all' ? 'All' : item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      </View>

      {/* Products List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-600">Loading products...</Text>
        </View>
      ) : (
        <FlatList
          data={products || []}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 16 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View className="items-center py-16">
              <Ionicons name="search" size={48} color="#d1d5db" />
              <Text className="text-lg font-medium text-gray-800 mt-4">
                No products found
              </Text>
              <Text className="text-gray-600 text-center mt-2">
                Try adjusting your search or filters
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
