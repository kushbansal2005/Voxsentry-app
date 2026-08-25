// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotiView } from 'moti';
import { Shield } from 'lucide-react-native';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (email && password) {
      await AsyncStorage.setItem('user_session', 'mock_token_123');
      navigation.replace('MainTabs');
    }
  };

  const handleGuest = async () => {
    await AsyncStorage.setItem('user_session', 'guest_session');
    navigation.replace('MainTabs');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#0A0A1F]"
    >
      <View className="flex-1 justify-center px-6">
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800 }}
          className="items-center mb-10"
        >
          <View className="bg-[#1E1042] p-4 rounded-full mb-4 border border-[#22D3EE]/30">
            <Shield color="#22D3EE" size={40} />
          </View>
          <Text className="text-white text-3xl font-bold">Welcome Back</Text>
          <Text className="text-[#A855F7] mt-2">Log in to protect your voice</Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 200 }}
        >
          <View className="mb-4">
            <Text className="text-gray-400 mb-2 ml-1">Email</Text>
            <TextInput
              className={`bg-[#1E1042] text-white px-4 py-4 rounded-xl border ${isEmailFocused ? 'border-[#22D3EE]' : 'border-transparent'}`}
              placeholder="Enter your email"
              placeholderTextColor="#6B7280"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View className="mb-8">
            <Text className="text-gray-400 mb-2 ml-1">Password</Text>
            <TextInput
              className={`bg-[#1E1042] text-white px-4 py-4 rounded-xl border ${isPasswordFocused ? 'border-[#22D3EE]' : 'border-transparent'}`}
              placeholder="Enter your password"
              placeholderTextColor="#6B7280"
              value={password}
              onChangeText={setPassword}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            className="bg-[#22D3EE] py-4 rounded-xl items-center mb-4 shadow-lg shadow-cyan-500/50"
            onPress={handleLogin}
          >
            <Text className="text-[#0A0A1F] font-bold text-lg">Login</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="border border-[#10B981] py-4 rounded-xl items-center mb-6 bg-[#10B981]/10"
            onPress={handleGuest}
          >
            <Text className="text-[#10B981] font-bold text-lg">Continue as Guest (Judge Mode)</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center">
            <Text className="text-gray-400">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text className="text-[#A855F7] font-bold">Sign up</Text>
            </TouchableOpacity>
          </View>
        </MotiView>
      </View>
    </KeyboardAvoidingView>
  );
}
