import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/auth/login-screen';
import { SignUpScreen } from '../screens/auth/signup-screen';

const Stack = createStackNavigator();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}
