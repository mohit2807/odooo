import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileScreen } from '../screens/profile/profile-screen';
import { OrdersScreen } from '../screens/profile/orders-screen';

const Stack = createStackNavigator();

export function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileHome" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }}
      />
      <Stack.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{ title: 'My Orders' }}
      />
    </Stack.Navigator>
  );
}
