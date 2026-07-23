src/navigation/AppNavigator.js

javascript
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import PropertyDetailScreen from '../screens/PropertyDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;