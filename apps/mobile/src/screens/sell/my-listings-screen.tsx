import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { Product } from '@ecofinds/types';
import { formatPrice, getImagePlaceholder } from '../../lib/supabase';
import { useAuthStore } from '../../store';

export function MyListingsScreen() {
  const { user } = useAuthStore();

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['my-products'],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as Product[];
    },
  });

  const handleDelete = async (productId: string) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabase
                .from('products')
                .delete()
                .eq('id', productId);
              
              refetch();
              Alert.alert('Success', 'Product deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete product');
            }
          },
        },
      ]
    );
  };

  const renderProduct = ({ item, index }: { item: Product; index: number }) => (
    <MotiView
      from={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 100 }}
      className="bg-white rounded-xl shadow-sm mb-4 mx-4"
    >
      <View className="flex-row p-4">
        <View className="w-20 h-20 bg-gray-100 rounded-lg mr-4">
          {/* Product image would go here */}
        </View>
        
        <View className="flex-1">
          <Text className="font-medium text-gray-900 text-sm mb-1" numberOfLines={2}>
            {item.title}
          </Text>
          <Text className="text-emerald-600 font-bold text-lg mb-1">
            {formatPrice(item.price_cents)}
          </Text>
          <Text className="text-gray-600 text-xs mb-2">
            {item.category}
          </Text>
          <View className="flex-row items-center">
            <View className={`px-2 py-1 rounded-full ${
              item.is_active ? 'bg-emerald-100' : 'bg-gray-100'
            }`}>
              <Text className={`text-xs font-medium ${
                item.is_active ? 'text-emerald-800' : 'text-gray-600'
              }`}>
                {item.is_active ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          className="w-8 h-8 bg-red-100 rounded-full items-center justify-center"
        >
          <Ionicons name="trash" size={16} color="#dc2626" />
        </TouchableOpacity>
      </View>
    </MotiView>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-600">Loading your listings...</Text>
        </View>
      ) : (
        <FlatList
          data={products || []}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 16 }}
          ListEmptyComponent={
            <View className="items-center py-16">
              <Ionicons name="cube-outline" size={48} color="#d1d5db" />
              <Text className="text-lg font-medium text-gray-800 mt-4">
                No listings yet
              </Text>
              <Text className="text-gray-600 text-center mt-2">
                You haven't listed anything. Tap + Add Product to get started!
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
