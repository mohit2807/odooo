import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../store';
import { formatPrice, getImagePlaceholder } from '../../lib/supabase';

export function CartScreen() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();

  const totalAmount = items.reduce((sum, item) => 
    sum + (item.products?.price_cents || 0) * item.quantity, 0
  );

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    Alert.alert(
      'Checkout',
      `Total: ${formatPrice(totalAmount)}\n\nThis is a demo checkout. No real payment is processed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Checkout',
          onPress: () => {
            clearCart();
            Alert.alert('Success', 'Order placed successfully!');
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <MotiView
      from={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 100 }}
      className="bg-white rounded-xl p-4 mb-4 mx-4 shadow-sm"
    >
      <View className="flex-row">
        <View className="w-16 h-16 bg-gray-100 rounded-lg mr-4">
          {/* Product image would go here */}
        </View>

        <View className="flex-1">
          <Text className="font-medium text-gray-900 text-sm mb-1" numberOfLines={2}>
            {item.products?.title}
          </Text>
          <Text className="text-emerald-600 font-bold text-lg mb-2">
            {formatPrice((item.products?.price_cents || 0) * item.quantity)}
          </Text>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center bg-gray-100 rounded-lg">
              <TouchableOpacity
                onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 items-center justify-center"
              >
                <Ionicons name="remove" size={16} color="#374151" />
              </TouchableOpacity>
              <Text className="mx-3 font-medium">{item.quantity}</Text>
              <TouchableOpacity
                onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 items-center justify-center"
                disabled={item.quantity >= 10}
              >
                <Ionicons name="add" size={16} color="#374151" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => removeItem(item.id)}
              className="w-8 h-8 bg-red-100 rounded-full items-center justify-center"
            >
              <Ionicons name="trash" size={16} color="#dc2626" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </MotiView>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 500 }}
            className="items-center"
          >
            <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
              <Ionicons name="cart-outline" size={48} color="#9ca3af" />
            </View>
            <Text className="text-xl font-medium text-gray-800 mb-2">
              Your cart is feeling eco-lonely
            </Text>
            <Text className="text-gray-600 text-center">
              Add some sustainable treasures to get started!
            </Text>
          </MotiView>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 16 }}
          />

          {/* Checkout Section */}
          <View className="bg-white border-t border-gray-200 p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-gray-900">Total</Text>
              <Text className="text-2xl font-bold text-emerald-600">
                {formatPrice(totalAmount)}
              </Text>
            </View>

            <MotiView
              from={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 200 }}
            >
              <TouchableOpacity
                onPress={handleCheckout}
                className="bg-emerald-600 rounded-xl py-4 items-center"
              >
                <Text className="text-white font-semibold text-lg">
                  Checkout ({formatPrice(totalAmount)})
                </Text>
              </TouchableOpacity>
            </MotiView>

            <Text className="text-xs text-center text-gray-500 mt-2">
              This is a demo checkout. No real payment is processed.
            </Text>
          </View>
        </>
      )}
    </View>
  );
}
