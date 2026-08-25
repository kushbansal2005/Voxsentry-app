// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { ShieldAlert, ShieldCheck, Info, Power, AlertTriangle, Smartphone } from 'lucide-react-native';
import { useProtection } from '../context/ProtectionContext';
import { OverlayBridge } from '../lib/OverlayBridge';

export default function LiveProtectionScreen() {
  const { isProtectionActive, setIsProtectionActive } = useProtection();
  const [hasPermission, setHasPermission] = useState(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);

  // We assume on init we need to verify permission, or default to false until granted.
  // In a real app we'd query the native bridge on mount for the current status.
  
  const handleGrantPermission = async () => {
    setIsCheckingPermission(true);
    const granted = await OverlayBridge.checkAndRequestOverlayPermission();
    setHasPermission(granted);
    setIsCheckingPermission(false);
  };

  const handleToggleProtection = async () => {
    if (isProtectionActive) {
      await OverlayBridge.stopProtection();
      setIsProtectionActive(false);
    } else {
      await OverlayBridge.startProtection();
      setIsProtectionActive(true);
    }
  };

  return (
    <View className="flex-1 bg-[#0A0A1F]">
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 100 }}>
        
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          className="mb-8 flex-row justify-between items-center"
        >
          <View>
            <Text className="text-white text-3xl font-bold">Live Protection</Text>
            <Text className="text-gray-400 mt-2">Real-time deepfake detection</Text>
          </View>
          
          {/* Detection Method Badge */}
          <View className="bg-[#22D3EE]/20 border border-[#22D3EE]/50 rounded-full px-3 py-1 flex-row items-center">
            <Smartphone color="#22D3EE" size={14} />
            <Text className="text-[#22D3EE] text-xs font-bold ml-1">On-Device inference</Text>
          </View>
        </MotiView>

        {!hasPermission ? (
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 400 }}
            className="bg-[#1E1042] rounded-2xl p-6 border border-[#EF4444]/30 mb-8"
          >
            <View className="bg-[#EF4444]/20 w-12 h-12 rounded-full items-center justify-center mb-4">
              <ShieldAlert color="#EF4444" size={24} />
            </View>
            <Text className="text-white text-xl font-bold mb-3">Permission Required</Text>
            <Text className="text-gray-400 mb-6 leading-6">
              To display live threat alerts during phone calls, VoxSentry requires the "Display over other apps" permission. 
              We only use this to show the detection overlay bubble when a call is active.
            </Text>
            
            <TouchableOpacity
              className="bg-[#EF4444] rounded-xl py-4 items-center shadow-lg shadow-red-500/30"
              onPress={handleGrantPermission}
              disabled={isCheckingPermission}
            >
              <Text className="text-white font-bold text-lg">
                {isCheckingPermission ? 'Checking...' : 'Grant Permission'}
              </Text>
            </TouchableOpacity>
          </MotiView>
        ) : (
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 400 }}
            className={`rounded-3xl p-8 mb-8 border items-center shadow-2xl ${isProtectionActive ? 'bg-[#10B981]/10 border-[#10B981]/50 shadow-emerald-500/20' : 'bg-[#1E1042] border-white/10'}`}
          >
            <View className={`w-24 h-24 rounded-full items-center justify-center mb-6 ${isProtectionActive ? 'bg-[#10B981]/20' : 'bg-gray-800'}`}>
              {isProtectionActive ? (
                <ShieldCheck color="#10B981" size={48} />
              ) : (
                <Power color="#9CA3AF" size={48} />
              )}
            </View>
            <Text className="text-white text-2xl font-bold mb-2">
              {isProtectionActive ? 'Protection Active' : 'Protection Paused'}
            </Text>
            <Text className="text-gray-400 text-center mb-8">
              {isProtectionActive 
                ? 'Your calls are currently being monitored for synthetic voices.' 
                : 'Tap below to enable real-time detection on your calls.'}
            </Text>

            <TouchableOpacity
              className={`rounded-full py-4 px-12 items-center w-full shadow-lg ${isProtectionActive ? 'bg-[#EF4444] shadow-red-500/30' : 'bg-[#10B981] shadow-emerald-500/30'}`}
              onPress={handleToggleProtection}
            >
              <Text className="text-white font-bold text-lg">
                {isProtectionActive ? 'Stop Protection' : 'Start Protection'}
              </Text>
            </TouchableOpacity>
          </MotiView>
        )}

        <View className="mb-6">
          <Text className="text-white font-bold text-lg mb-4">What's Active</Text>
          <View className="bg-[#1E1042] rounded-xl p-4 border border-white/5 flex-row items-start">
            <Info color="#22D3EE" size={20} className="mt-1" />
            <Text className="text-gray-400 ml-3 flex-1 leading-6">
              VoxSentry is listening for synthetic voice patterns during speakerphone and app calls (like WhatsApp or Telegram).
            </Text>
          </View>
        </View>

        <View className="bg-[#A855F7]/10 rounded-xl p-4 border border-[#A855F7]/30 flex-row items-start">
          <AlertTriangle color="#A855F7" size={20} className="mt-1" />
          <Text className="text-[#A855F7] ml-3 flex-1 leading-6">
            Note: Due to Android OS limitations, standard SIM (cellular) calls cannot be intercepted directly without being placed on speakerphone.
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}
