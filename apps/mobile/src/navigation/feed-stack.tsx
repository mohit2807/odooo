import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { FeedScreen } from '../screens/feed/feed-screen';
import { ProductDetailScreen } from '../screens/products/product-detail-screen';

const Stack = createStackNavigator();

export function FeedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="FeedHome" 
        component={FeedScreen} 
        options={{ title: 'EcoFinds' }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{ title: 'Product Details' }}
      />
    </Stack.Navigator>
  );
}
