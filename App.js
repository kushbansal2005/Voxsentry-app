import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import LiveProtectionScreen from './src/screens/LiveProtectionScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TrainNavigator from './src/screens/train/TrainNavigator';
import { ProtectionProvider } from './src/context/ProtectionContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Home, Shield, Mic, Clock, Settings as SettingsIcon } from 'lucide-react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- Screens Imported Above ---

// --- Tab Screens ---

const TabScreenPlaceholder = ({ name }) => (
  <View className="flex-1 bg-[#0A0A1F] items-center justify-center">
    <Text className="text-[#22D3EE] text-2xl font-bold">{name}</Text>
  </View>
);

// Tab placeholders removed or unused

// --- Navigators ---

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(10, 10, 31, 0.9)', // Translucent dark match
          borderTopColor: '#1E1042',
          position: 'absolute',
          paddingBottom: 5,
          height: 60,
          elevation: 0,
        },
        tabBarActiveTintColor: '#22D3EE', // Cyan
        tabBarInactiveTintColor: '#6B7280', // Gray
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Protection" 
        component={LiveProtectionScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Shield color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Train" 
        component={TrainNavigator} 
        options={{
          tabBarIcon: ({ color, size }) => <Mic color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Clock color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <SettingsIcon color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ProtectionProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="MainTabs" component={MainTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </ProtectionProvider>
    </SafeAreaProvider>
  );
}
