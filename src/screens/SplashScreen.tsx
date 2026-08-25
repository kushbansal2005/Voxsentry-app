// @ts-nocheck
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Shield } from 'lucide-react-native';
import { MotiView } from 'moti';

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    const checkSession = async () => {
      // Mock loading delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      try {
        const session = await AsyncStorage.getItem('user_session');
        if (session) {
          navigation.replace('MainTabs');
        } else {
          navigation.replace('Login');
        }
      } catch (error) {
        navigation.replace('Login');
      }
    };

    checkSession();
  }, [navigation]);

  return (
    <View className="flex-1 bg-[#0A0A1F] items-center justify-center">
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 1000 }}
        className="items-center"
      >
        <View className="bg-[#1E1042] p-4 rounded-full mb-4 border border-[#22D3EE]/30">
          <Shield color="#22D3EE" size={48} />
        </View>
        <Text className="text-[#22D3EE] text-4xl font-bold tracking-wider">VOXSENTRY</Text>
        <Text className="text-[#A855F7] mt-2 text-lg tracking-widest">INITIALIZING...</Text>
      </MotiView>
    </View>
  );
}
