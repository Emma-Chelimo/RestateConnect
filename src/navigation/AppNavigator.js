import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PropertyDetailScreen from '../screens/PropertyDetailScreen';

import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import PersonalInfoScreen from '../screens/PersonalInfoScreen';
import PaymentMethodsScreen from '../screens/PaymentMethodsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: 'home-outline',
  Explore: 'search-outline',
  Favorites: 'heart-outline',
  Profile: 'person-outline',
};

// Bottom tabs: Home, Explore, Favorites, Profile
const MainTabs = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarIcon: ({ color, size }) => (
          <Icon name={TAB_ICONS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Signed-in stack: tabs + PropertyDetail + every Profile sub-screen
const AuthenticatedStack = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="PropertyDetail" component={PropertyDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} options={{ title: 'Personal Information' }} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} options={{ title: 'Payment Methods' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} options={{ title: 'Help & Support' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Stack.Navigator>
  );
};

// Signed-out stack: SignIn + SignUp
const UnauthenticatedStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

// Root: waits for Firebase auth state, then routes to the right stack
const AppNavigator = () => {
  const { user, initializing } = useAuth();
  const { colors, isDark } = useTheme();

  if (initializing) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      {user ? <AuthenticatedStack /> : <UnauthenticatedStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
