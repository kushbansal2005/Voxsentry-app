// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotiView } from 'moti';
import { Shield } from 'lucide-react-native';

export default function SignupScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleSignup = async () => {
    if (name && email && password) {
      await AsyncStorage.setItem('user_session', 'mock_token_123');
      navigation.replace('MainTabs');
    }
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
          <View className="bg-[#1E1042] p-4 rounded-full mb-4 border border-[#A855F7]/30">
            <Shield color="#A855F7" size={40} />
          </View>
          <Text className="text-white text-3xl font-bold">Create Account</Text>
          <Text className="text-[#22D3EE] mt-2">Join Voxsentry to secure your identity</Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 200 }}
        >
          <View className="mb-4">
            <Text className="text-gray-400 mb-2 ml-1">Full Name</Text>
            <TextInput
              className={`bg-[#1E1042] text-white px-4 py-4 rounded-xl border ${isNameFocused ? 'border-[#A855F7]' : 'border-transparent'}`}
              placeholder="Enter your name"
              placeholderTextColor="#6B7280"
              value={name}
              onChangeText={setName}
              onFocus={() => setIsNameFocused(true)}
              onBlur={() => setIsNameFocused(false)}
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-400 mb-2 ml-1">Email</Text>
            <TextInput
              className={`bg-[#1E1042] text-white px-4 py-4 rounded-xl border ${isEmailFocused ? 'border-[#A855F7]' : 'border-transparent'}`}
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
              className={`bg-[#1E1042] text-white px-4 py-4 rounded-xl border ${isPasswordFocused ? 'border-[#A855F7]' : 'border-transparent'}`}
              placeholder="Create a password"
              placeholderTextColor="#6B7280"
              value={password}
              onChangeText={setPassword}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            className="bg-[#A855F7] py-4 rounded-xl items-center mb-6 shadow-lg shadow-purple-500/50"
            onPress={handleSignup}
          >
            <Text className="text-white font-bold text-lg">Sign Up</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center">
            <Text className="text-gray-400">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text className="text-[#22D3EE] font-bold">Log in</Text>
            </TouchableOpacity>
          </View>
        </MotiView>
      </View>
    </KeyboardAvoidingView>
  );
}
