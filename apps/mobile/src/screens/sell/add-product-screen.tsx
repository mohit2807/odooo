import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store';
import { supabase } from '../../lib/supabase';
import { CATEGORIES } from '@ecofinds/types';

export function AddProductScreen() {
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description || !category || !price) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'Please sign in to add a product');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .insert({
          owner_id: user.id,
          title,
          description,
          category,
          price_cents: Math.round(parseFloat(price) * 100),
          images: [],
        });

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Product added successfully!');
      setTitle('');
      setDescription('');
      setCategory('');
      setPrice('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <ScrollView className="flex-1">
        <MotiView
          from={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4"
        >
          <View className="bg-white rounded-xl p-6 shadow-sm">
            <View className="items-center mb-6">
              <View className="w-16 h-16 bg-emerald-500 rounded-2xl items-center justify-center mb-4">
                <Ionicons name="add" size={32} color="white" />
              </View>
              <Text className="text-2xl font-bold text-gray-800">Add New Product</Text>
              <Text className="text-gray-600 text-center mt-2">
                Share something sustainable with the community
              </Text>
            </View>

            <View className="space-y-4">
              {/* Title */}
              <View>
                <Text className="text-gray-700 font-medium mb-2">Product Title *</Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g., Vintage Leather Jacket"
                  className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                />
              </View>

              {/* Category */}
              <View>
                <Text className="text-gray-700 font-medium mb-2">Category *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row space-x-2">
                    {CATEGORIES.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        onPress={() => setCategory(cat)}
                        className={`px-4 py-2 rounded-full ${
                          category === cat ? 'bg-emerald-600' : 'bg-gray-100'
                        }`}
                      >
                        <Text
                          className={`font-medium ${
                            category === cat ? 'text-white' : 'text-gray-700'
                          }`}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Price */}
              <View>
                <Text className="text-gray-700 font-medium mb-2">Price (₹) *</Text>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0.00"
                  keyboardType="numeric"
                  className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                />
              </View>

              {/* Description */}
              <View>
                <Text className="text-gray-700 font-medium mb-2">Description *</Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe your product's condition, features, and why someone would love it..."
                  multiline
                  numberOfLines={4}
                  className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                  textAlignVertical="top"
                />
              </View>

              {/* Submit Button */}
              <MotiView
                from={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 200 }}
              >
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={loading}
                  className="bg-emerald-600 rounded-xl py-4 items-center mt-6"
                >
                  <Text className="text-white font-semibold text-lg">
                    {loading ? 'Adding Product...' : 'Add Product'}
                  </Text>
                </TouchableOpacity>
              </MotiView>
            </View>
          </View>
        </MotiView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
