import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { MotiView } from 'moti';

export function LoadingScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <MotiView
        from={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 1000 }}
        className="items-center"
      >
        <View className="w-20 h-20 bg-emerald-500 rounded-2xl items-center justify-center mb-4">
          <Text className="text-white text-2xl font-bold">E</Text>
        </View>
        <Text className="text-2xl font-bold text-gray-800 mb-2">EcoFinds</Text>
        <Text className="text-gray-600 mb-8">Loading...</Text>
        <ActivityIndicator size="large" color="#059669" />
      </MotiView>
    </View>
  );
}
