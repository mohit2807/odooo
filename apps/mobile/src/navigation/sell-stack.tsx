import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AddProductScreen } from '../screens/sell/add-product-screen';
import { MyListingsScreen } from '../screens/sell/my-listings-screen';

const Stack = createStackNavigator();

export function SellStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="AddProduct" 
        component={AddProductScreen} 
        options={{ title: 'Add Product' }}
      />
      <Stack.Screen 
        name="MyListings" 
        component={MyListingsScreen}
        options={{ title: 'My Listings' }}
      />
    </Stack.Navigator>
  );
}
