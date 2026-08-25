// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { MotiView } from 'moti';
import { CheckCircle, Loader } from 'lucide-react-native';

const steps = [
  "Uploading samples...",
  "Checking audio quality...",
  "Extracting voice embedding...",
  "Saving to your voice library..."
];

export default function ProcessingScreen({ navigation }) {
  const [completedSteps, setCompletedSteps] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setCompletedSteps(current);
      
      if (current === steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          navigation.replace('VoiceLibrary', { newProfileAdded: true });
        }, 1000);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [navigation]);

  return (
    <View className="flex-1 bg-[#0A0A1F] justify-center px-8">
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500 }}
        className="mb-12 items-center"
      >
        <Text className="text-white text-3xl font-bold text-center">Processing Voice</Text>
        <Text className="text-[#A855F7] mt-2 text-center">Please do not close the app</Text>
      </MotiView>

      <View className="bg-[#1E1042] p-6 rounded-2xl border border-white/5">
        {steps.map((step, index) => {
          const isCompleted = index < completedSteps;
          const isActive = index === completedSteps;
          const isPending = index > completedSteps;

          return (
            <MotiView
              key={index}
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: isPending ? 0.4 : 1, translateX: 0 }}
              transition={{ type: 'timing', duration: 500, delay: index * 100 }}
              className="flex-row items-center mb-6 last:mb-0"
            >
              <View className="w-8 h-8 mr-4 items-center justify-center">
                {isCompleted ? (
                  <CheckCircle color="#10B981" size={24} />
                ) : isActive ? (
                  <MotiView
                    from={{ rotate: '0deg' }}
                    animate={{ rotate: '360deg' }}
                    transition={{ type: 'timing', duration: 1000, loop: true, repeatReverse: false }}
                  >
                    <Loader color="#22D3EE" size={24} />
                  </MotiView>
                ) : (
                  <View className="w-3 h-3 rounded-full bg-gray-600" />
                )}
              </View>
              <Text className={`text-lg font-bold ${isCompleted ? 'text-[#10B981]' : isActive ? 'text-[#22D3EE]' : 'text-gray-500'}`}>
                {step}
              </Text>
            </MotiView>
          );
        })}
      </View>
    </View>
  );
}
