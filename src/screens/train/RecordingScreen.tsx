// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { Mic, StopCircle } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

const sentences = [
  "My voice is my password, verify me.",
  "The quick brown fox jumps over the lazy dog.",
  "In a world of deepfakes, authenticity matters.",
  "I am authorizing this transaction with my voice.",
  "Security requires constant vigilance."
];

export default function RecordingScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  
  const scale = useSharedValue(1);

  const animatedWaveStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const startAnimation = () => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 400 }),
        withTiming(1.0, { duration: 400 })
      ),
      -1,
      true
    );
  };

  const stopAnimation = () => {
    scale.value = withTiming(1, { duration: 300 });
  };

  async function startRecording() {
    try {
      if (permissionResponse?.status !== 'granted') {
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY );
      setRecording(recording);
      setIsRecording(true);
      startAnimation();
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    setIsRecording(false);
    stopAnimation();
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    
    // We mock storing the URI for now
    const uri = recording.getURI();
    setRecording(null);

    if (currentStep < sentences.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      navigation.replace('Processing');
    }
  }

  return (
    <View className="flex-1 bg-[#0A0A1F] items-center justify-center p-6">
      
      <View className="flex-row mb-12">
        {sentences.map((_, idx) => (
          <View 
            key={idx} 
            className={`w-3 h-3 rounded-full mx-1 ${idx === currentStep ? 'bg-[#A855F7]' : idx < currentStep ? 'bg-[#A855F7]/50' : 'bg-[#1E1042]'}`} 
          />
        ))}
      </View>

      <Text className="text-[#A855F7] font-bold mb-4">STEP {currentStep + 1} OF {sentences.length}</Text>
      
      <View className="bg-[#1E1042] p-8 rounded-2xl border border-white/5 w-full mb-12 min-h-[160px] items-center justify-center">
        <Text className="text-white text-2xl font-bold text-center leading-8">
          "{sentences[currentStep]}"
        </Text>
      </View>

      <View className="items-center justify-center h-48 w-48 mb-8 relative">
        {isRecording && (
          <Animated.View 
            style={[animatedWaveStyle]} 
            className="absolute w-32 h-32 bg-[#A855F7]/30 rounded-full"
          />
        )}
        <TouchableOpacity 
          className={`w-24 h-24 rounded-full items-center justify-center z-10 ${isRecording ? 'bg-[#EF4444]' : 'bg-[#A855F7]'}`}
          onPress={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? <StopCircle color="#fff" size={40} /> : <Mic color="#fff" size={40} />}
        </TouchableOpacity>
      </View>

      <Text className="text-gray-400">
        {isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
      </Text>

    </View>
  );
}
