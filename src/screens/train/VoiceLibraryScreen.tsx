// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotiView } from 'moti';
import { Mic, UserPlus, PlayCircle, ShieldCheck } from 'lucide-react-native';

const STORAGE_KEY = 'voxsentry_voice_profiles';

export default function VoiceLibraryScreen({ navigation, route }) {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    loadProfiles();
  }, []);

  useEffect(() => {
    if (route.params?.newProfileAdded) {
      const addProfile = async () => {
        const newProfile = {
          id: Date.now().toString(),
          name: `Voice Profile ${profiles.length + 1}`,
          date: new Date().toLocaleDateString(),
        };
        const updated = [...profiles, newProfile];
        setProfiles(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      };
      addProfile();
      // Clear the param so it doesn't trigger again on focus
      navigation.setParams({ newProfileAdded: false });
    }
  }, [route.params?.newProfileAdded]);

  const loadProfiles = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfiles(JSON.parse(stored));
      } else {
        // Initial mock profile
        const initial = [{
          id: '1',
          name: 'Primary Voice',
          date: new Date().toLocaleDateString(),
        }];
        setProfiles(initial);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTestVoice = (profile) => {
    Alert.alert(
      "Test Voice",
      `Testing ${profile.name} with mock detection...`,
      [
        { text: "Simulate Safe Call", onPress: () => Alert.alert("Result", "✅ Verdict: Safe. Match Confidence: 99.8%") },
        { text: "Simulate Deepfake", onPress: () => Alert.alert("Result", "🚨 Verdict: AI Voice Detected. Match Confidence: 12.4%") },
        { text: "Cancel", style: "cancel" }
      ]
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
          <Text className="text-white text-3xl font-bold">Voice Library</Text>
          <Text className="text-gray-400 mt-2">Manage your trained voice embeddings</Text>
        </MotiView>

        <View className="flex-row flex-wrap justify-between">
          {profiles.map((profile, index) => (
            <MotiView
              key={profile.id}
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 400, delay: index * 100 }}
              className="w-[48%] bg-[#1E1042] rounded-2xl p-4 border border-white/5 mb-4 shadow-lg"
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="bg-[#A855F7]/20 p-2 rounded-full">
                  <ShieldCheck color="#A855F7" size={24} />
                </View>
              </View>
              <Text className="text-white font-bold mb-1">{profile.name}</Text>
              <Text className="text-gray-400 text-xs mb-4">Trained: {profile.date}</Text>
              
              <TouchableOpacity 
                className="bg-[#22D3EE]/10 border border-[#22D3EE]/30 py-2 rounded-lg flex-row items-center justify-center"
                onPress={() => handleTestVoice(profile)}
              >
                <PlayCircle color="#22D3EE" size={16} />
                <Text className="text-[#22D3EE] font-bold text-xs ml-1">Test</Text>
              </TouchableOpacity>
            </MotiView>
          ))}

          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 400, delay: profiles.length * 100 }}
            className="w-[48%] mb-4"
          >
            <TouchableOpacity 
              className="flex-1 border-2 border-dashed border-[#A855F7]/50 rounded-2xl items-center justify-center p-4 bg-[#1E1042]/50 min-h-[140px]"
              onPress={() => navigation.navigate('Consent')}
            >
              <View className="bg-[#A855F7]/20 p-3 rounded-full mb-3">
                <UserPlus color="#A855F7" size={28} />
              </View>
              <Text className="text-white font-bold text-center">Add New Voice</Text>
            </TouchableOpacity>
          </MotiView>
        </View>

      </ScrollView>
    </View>
  );
}
