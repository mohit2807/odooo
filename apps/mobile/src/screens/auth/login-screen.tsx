import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store';
import { supabase } from '../../lib/supabase';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { setUser, setProfile } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      if (data.user) {
        setUser(data.user);
        
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profile) {
          setProfile(profile);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gradient-to-br from-emerald-50 to-green-50"
    >
      <View className="flex-1 justify-center px-6">
        <MotiView
          from={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 500 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
        >
          {/* Logo */}
          <MotiView
            from={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 200, type: 'spring', stiffness: 200 }}
            className="items-center mb-8"
          >
            <View className="w-16 h-16 bg-emerald-500 rounded-2xl items-center justify-center mb-4">
              <Ionicons name="leaf" size={32} color="white" />
            </View>
            <Text className="text-2xl font-bold text-gray-800">Welcome to EcoFinds</Text>
            <Text className="text-gray-600 text-center mt-2">Sustainable second-hand marketplace</Text>
          </MotiView>

          {/* Form */}
          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 font-medium mb-2">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
              />
            </View>

            <View>
              <Text className="text-gray-700 font-medium mb-2">Password</Text>
              <View className="relative">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Your password"
                  secureTextEntry={!showPassword}
                  className="border border-gray-300 rounded-lg px-4 py-3 pr-12 text-gray-800"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                >
                  <Ionicons 
                    name={showPassword ? 'eye-off' : 'eye'} 
                    size={20} 
                    color="#6b7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className="bg-emerald-600 rounded-lg py-4 items-center mt-6"
            >
              <Text className="text-white font-semibold text-lg">
                {loading ? 'Signing in...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-600">Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp' as never)}>
                <Text className="text-emerald-600 font-medium">Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </MotiView>
      </View>
    </KeyboardAvoidingView>
  );
}
