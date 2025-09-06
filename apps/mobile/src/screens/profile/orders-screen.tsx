import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { formatPrice } from '../../lib/supabase';

export function OrdersScreen() {
  const { data: orders, isLoading } = useQuery({
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
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    },
  });

  const renderOrder = ({ item, index }: { item: any; index: number }) => (
    <MotiView
      from={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 100 }}
      className="bg-white rounded-xl p-4 mb-4 mx-4 shadow-sm"
    >
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-semibold text-gray-800">
          Order #{item.id.slice(-8)}
        </Text>
        <View className={`px-3 py-1 rounded-full ${
          item.status === 'PAID' ? 'bg-emerald-100' : 'bg-gray-100'
        }`}>
          <Text className={`text-sm font-medium ${
            item.status === 'PAID' ? 'text-emerald-800' : 'text-gray-600'
          }`}>
            {item.status === 'PAID' ? 'Paid' : 'Cancelled'}
          </Text>
        </View>
      </View>

      <View className="space-y-2 mb-3">
        {item.order_items.map((orderItem: any, itemIndex: number) => (
          <View key={itemIndex} className="flex-row items-center justify-between">
            <Text className="text-gray-600 flex-1" numberOfLines={1}>
              {orderItem.products.title} x{orderItem.quantity}
            </Text>
            <Text className="text-emerald-600 font-medium">
              {formatPrice(orderItem.price_cents * orderItem.quantity)}
            </Text>
          </View>
        ))}
      </View>

      <View className="flex-row items-center justify-between pt-3 border-t border-gray-200">
        <View className="flex-row items-center">
          <Ionicons name="calendar" size={16} color="#6b7280" />
          <Text className="text-gray-600 text-sm ml-1">
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        <Text className="text-lg font-bold text-emerald-600">
          {formatPrice(item.total_cents)}
        </Text>
      </View>
    </MotiView>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-600">Loading orders...</Text>
        </View>
      ) : (
        <FlatList
          data={orders || []}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 16 }}
          ListEmptyComponent={
            <View className="items-center py-16">
              <MotiView
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 500 }}
                className="items-center"
              >
                <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
                  <Ionicons name="receipt-outline" size={48} color="#9ca3af" />
                </View>
                <Text className="text-xl font-medium text-gray-800 mb-2">
                  No purchases yet
                </Text>
                <Text className="text-gray-600 text-center">
                  Start your sustainable journey by browsing our eco-friendly products!
                </Text>
              </MotiView>
            </View>
          }
        />
      )}
    </View>
  );
}
