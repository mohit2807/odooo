import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CartScreen } from '../screens/cart/cart-screen';

const Stack = createStackNavigator();

export function CartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CartHome" 
        component={CartScreen} 
        options={{ title: 'Your Cart' }}
      />
    </Stack.Navigator>
  );
}
