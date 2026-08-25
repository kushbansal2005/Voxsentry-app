// @ts-nocheck
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Shield, AlertTriangle } from 'lucide-react-native';
import { MotiView } from 'moti';

export default function ConsentScreen({ navigation }) {
  return (
    <View className="flex-1 bg-[#0A0A1F]">
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          className="items-center mt-10 mb-8"
        >
          <View className="bg-[#1E1042] p-4 rounded-full mb-4 border border-[#A855F7]/30">
            <Shield color="#A855F7" size={40} />
          </View>
          <Text className="text-white text-3xl font-bold text-center">Data & Privacy Consent</Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 100 }}
          className="bg-[#1E1042] p-6 rounded-2xl border border-white/5 mb-6"
        >
          <Text className="text-white font-bold text-lg mb-4">How we use your voice</Text>
          <Text className="text-gray-400 mb-4 leading-6">
            To detect deepfakes, we need a small sample of your real voice. This creates an encrypted mathematical signature (voice embedding).
          </Text>
          <Text className="text-gray-400 mb-4 leading-6">
            • Your audio recordings never leave this device.{"\n"}
            • Only the mathematical embedding is saved.{"\n"}
            • We cannot recreate your voice from this data.
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 200 }}
          className="bg-[#EF4444]/10 p-6 rounded-2xl border border-[#EF4444]/30 mb-8"
        >
          <View className="flex-row items-center mb-3">
            <AlertTriangle color="#EF4444" size={24} />
            <Text className="text-[#EF4444] font-bold text-lg ml-2">Important</Text>
          </View>
          <Text className="text-[#EF4444]/80 leading-6">
            Please record your voice in a quiet room for the best accuracy. Background noise can reduce the effectiveness of the AI analysis.
          </Text>
        </MotiView>

      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 p-6 bg-[#0A0A1F]/90 pb-24">
        <TouchableOpacity
          className="bg-[#A855F7] p-4 rounded-xl items-center shadow-lg shadow-purple-500/50"
          onPress={() => navigation.navigate('Recording')}
        >
          <Text className="text-white font-bold text-lg">I Understand & Agree</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-4 items-center mt-2"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-gray-400 font-bold">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
