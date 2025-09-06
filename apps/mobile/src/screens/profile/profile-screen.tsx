import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store';
import { supabase } from '../../lib/supabase';

export function ProfileScreen() {
  const { user, profile, setUser, setProfile } = useAuthStore();
  const navigation = useNavigation();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabase.auth.signOut();
              setUser(null);
              setProfile(null);
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-6 border-b border-gray-200">
        <MotiView
          from={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="items-center"
        >
          <View className="w-20 h-20 bg-emerald-100 rounded-full items-center justify-center mb-4">
            <Text className="text-emerald-700 text-2xl font-bold">
              {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
            </Text>
          </View>
          <Text className="text-xl font-bold text-gray-800 mb-1">
            {profile?.username || 'User'}
          </Text>
          <Text className="text-gray-600">{user?.email}</Text>
        </MotiView>
      </View>

      {/* Menu Items */}
      <View className="flex-1 px-4 py-6">
        <MotiView
          from={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 200 }}
          className="space-y-4"
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('Orders' as never)}
            className="bg-white rounded-xl p-4 flex-row items-center justify-between shadow-sm"
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-emerald-100 rounded-lg items-center justify-center mr-3">
                <Ionicons name="receipt" size={20} color="#059669" />
              </View>
              <Text className="text-lg font-medium text-gray-800">My Orders</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('MyListings' as never)}
            className="bg-white rounded-xl p-4 flex-row items-center justify-between shadow-sm"
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-emerald-100 rounded-lg items-center justify-center mr-3">
                <Ionicons name="cube" size={20} color="#059669" />
              </View>
              <Text className="text-lg font-medium text-gray-800">My Listings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert('Coming Soon', 'Settings feature coming soon!')}
            className="bg-white rounded-xl p-4 flex-row items-center justify-between shadow-sm"
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-emerald-100 rounded-lg items-center justify-center mr-3">
                <Ionicons name="settings" size={20} color="#059669" />
              </View>
              <Text className="text-lg font-medium text-gray-800">Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert('Coming Soon', 'Help & Support feature coming soon!')}
            className="bg-white rounded-xl p-4 flex-row items-center justify-between shadow-sm"
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-emerald-100 rounded-lg items-center justify-center mr-3">
                <Ionicons name="help-circle" size={20} color="#059669" />
              </View>
              <Text className="text-lg font-medium text-gray-800">Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </MotiView>
      </View>

      {/* Sign Out Button */}
      <View className="px-4 pb-6">
        <MotiView
          from={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 400 }}
        >
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-red-50 border border-red-200 rounded-xl p-4 items-center"
          >
            <Text className="text-red-600 font-semibold text-lg">Sign Out</Text>
          </TouchableOpacity>
        </MotiView>
      </View>
    </View>
  );
}
