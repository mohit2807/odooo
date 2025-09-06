import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store';
import { supabase } from '../../lib/supabase';

export function SignUpScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { setUser, setProfile } = useAuthStore();

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          }
        }
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      if (data.user) {
        setUser(data.user);
        
        // Create profile
        const { data: profile } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username,
          })
          .select()
          .single();
        
        if (profile) {
          setProfile(profile);
        }

        Alert.alert('Success', 'Account created! Please check your email to confirm your account.');
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
            <Text className="text-2xl font-bold text-gray-800">Join EcoFinds</Text>
            <Text className="text-gray-600 text-center mt-2">Start your sustainable journey today</Text>
          </MotiView>

          {/* Form */}
          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 font-medium mb-2">Username</Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Choose a username"
                autoCapitalize="none"
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
              />
            </View>

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
                  placeholder="Create a password"
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
              onPress={handleSignUp}
              disabled={loading}
              className="bg-emerald-600 rounded-lg py-4 items-center mt-6"
            >
              <Text className="text-white font-semibold text-lg">
                {loading ? 'Creating account...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
                <Text className="text-emerald-600 font-medium">Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </MotiView>
      </View>
    </KeyboardAvoidingView>
  );
}
