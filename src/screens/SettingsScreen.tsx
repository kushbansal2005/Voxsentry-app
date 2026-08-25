// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotiView } from 'moti';
import { User, Bell, Volume2, Cloud, Smartphone, LogOut, ChevronRight, Info } from 'lucide-react-native';

const SETTINGS_KEY = 'voxsentry_settings';

export default function SettingsScreen({ navigation }: any) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [processingMode, setProcessingMode] = useState<'device' | 'cloud'>('device');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const { push, sound } = JSON.parse(stored);
        setPushEnabled(push ?? true);
        setSoundEnabled(sound ?? true);
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    }
  };

  const saveSettings = async (newSettings: any) => {
    try {
      const current = { push: pushEnabled, sound: soundEnabled, ...newSettings };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(current));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  };

  const handleTogglePush = (val: boolean) => {
    setPushEnabled(val);
    saveSettings({ push: val });
  };

  const handleToggleSound = (val: boolean) => {
    setSoundEnabled(val);
    saveSettings({ sound: val });
  };

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: async () => {
            // Clear session token but keep settings/history as a choice
            await AsyncStorage.removeItem('user_session');
            // Navigate back to Login. Because we are inside MainTabs nested in the Root Stack,
            // we use navigation.replace or navigation.navigate up to the Root Stack.
            navigation.getParent()?.replace('Login') || navigation.replace('Login');
          }
        }
      ]
    );
  };

  const showPrivacyModal = () => {
    Alert.alert(
      "Privacy & Compliance",
      "VoxSentry complies with local privacy regulations by defaulting to On-Device inference. Your voice data and biometric embeddings never leave your device unless you explicitly opt-in to Cloud Processing (Coming Soon).\n\nVersion 1.0.0"
    );
  };

  return (
    <View className="flex-1 bg-[#0A0A1F]">
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 100 }}>
        
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          className="mb-8"
        >
          <Text className="text-white text-3xl font-bold">Settings</Text>
        </MotiView>

        {/* Account Section */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 400, delay: 100 }}
          className="bg-[#1E1042] rounded-2xl p-6 border border-white/5 mb-8 flex-row items-center justify-between"
        >
          <View className="flex-row items-center flex-1">
            <View className="w-16 h-16 bg-[#22D3EE]/20 rounded-full items-center justify-center border border-[#22D3EE]/30">
              <User color="#22D3EE" size={32} />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-white text-xl font-bold">Alex Doe</Text>
              <Text className="text-gray-400 text-sm">alex@example.com</Text>
            </View>
          </View>
          <TouchableOpacity className="bg-white/5 p-2 rounded-xl">
            <Text className="text-[#22D3EE] font-bold text-xs">Edit</Text>
          </TouchableOpacity>
        </MotiView>

        {/* Notification Preferences */}
        <Text className="text-white font-bold text-lg mb-4">Notifications</Text>
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 200 }}
          className="bg-[#1E1042] rounded-2xl p-4 border border-white/5 mb-8"
        >
          <View className="flex-row items-center justify-between py-3 border-b border-white/5">
            <View className="flex-row items-center">
              <Bell color="#9CA3AF" size={20} />
              <Text className="text-white ml-3 text-base">Push Notifications</Text>
            </View>
            <Switch 
              value={pushEnabled} 
              onValueChange={handleTogglePush}
              trackColor={{ false: '#4B5563', true: '#22D3EE' }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <Volume2 color="#9CA3AF" size={20} />
              <Text className="text-white ml-3 text-base">Sound Alerts</Text>
            </View>
            <Switch 
              value={soundEnabled} 
              onValueChange={handleToggleSound}
              trackColor={{ false: '#4B5563', true: '#22D3EE' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </MotiView>

        {/* Data & Privacy */}
        <Text className="text-white font-bold text-lg mb-4">Data & Privacy</Text>
        <View className="flex-row justify-between mb-8">
          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 400, delay: 300 }}
            className="w-[48%]"
          >
            <TouchableOpacity 
              className={`rounded-2xl p-4 border ${processingMode === 'device' ? 'bg-[#10B981]/10 border-[#10B981]/50' : 'bg-[#1E1042] border-white/5'}`}
              onPress={() => setProcessingMode('device')}
            >
              <Smartphone color={processingMode === 'device' ? '#10B981' : '#6B7280'} size={24} className="mb-3" />
              <Text className={`font-bold ${processingMode === 'device' ? 'text-white' : 'text-gray-400'}`}>On-Device</Text>
              <Text className="text-gray-500 text-xs mt-1">Maximum privacy</Text>
            </TouchableOpacity>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 400, delay: 300 }}
            className="w-[48%]"
          >
            <TouchableOpacity 
              className="bg-[#1E1042] rounded-2xl p-4 border border-white/5 opacity-50"
              disabled
            >
              <Cloud color="#6B7280" size={24} className="mb-3" />
              <Text className="text-gray-400 font-bold">Cloud</Text>
              <View className="bg-[#A855F7]/20 self-start px-2 py-0.5 rounded-full mt-1">
                <Text className="text-[#A855F7] text-[10px] font-bold">Coming Soon</Text>
              </View>
            </TouchableOpacity>
          </MotiView>
        </View>

        {/* App Info */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 400 }}
          className="bg-[#1E1042] rounded-2xl p-2 border border-white/5 mb-8"
        >
          <TouchableOpacity 
            className="flex-row items-center justify-between p-4"
            onPress={showPrivacyModal}
          >
            <View className="flex-row items-center">
              <Info color="#22D3EE" size={20} />
              <Text className="text-white ml-3 text-base">Privacy & Compliance</Text>
            </View>
            <ChevronRight color="#6B7280" size={20} />
          </TouchableOpacity>
        </MotiView>

        <Text className="text-gray-500 text-center mb-8">Version 1.0.0</Text>

        {/* Log Out */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 500 }}
        >
          <TouchableOpacity
            className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl py-4 flex-row justify-center items-center"
            onPress={handleLogout}
          >
            <LogOut color="#EF4444" size={20} />
            <Text className="text-[#EF4444] font-bold text-lg ml-2">Log Out</Text>
          </TouchableOpacity>
        </MotiView>

      </ScrollView>
    </View>
  );
}
