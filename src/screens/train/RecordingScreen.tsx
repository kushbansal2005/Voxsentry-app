import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { Mic, StopCircle } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { theme } from '../../constants/theme';

const sentences = [
  "My voice is my password, verify me.",
  "The quick brown fox jumps over the lazy dog.",
  "In a world of deepfakes, authenticity matters.",
  "I am authorizing this transaction with my voice.",
  "Security requires constant vigilance."
];

export default function RecordingScreen({ navigation }: any) {
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
    <ScreenContainer>
      <View style={styles.container}>
        
        <View style={styles.progressContainer}>
          {sentences.map((_, idx) => (
            <View 
              key={idx} 
              style={[
                styles.progressDot, 
                idx === currentStep ? styles.progressActive : idx < currentStep ? styles.progressPast : styles.progressInactive
              ]} 
            />
          ))}
        </View>

        <Text style={[theme.typography.caption, styles.stepText]}>
          STEP {currentStep + 1} OF {sentences.length}
        </Text>
        
        <Card style={styles.phraseCard}>
          <Text style={[theme.typography.display, styles.phraseText]}>
            "{sentences[currentStep]}"
          </Text>
        </Card>

        <View style={styles.recordContainer}>
          {isRecording && (
            <Animated.View 
              style={[styles.animatedWave, animatedWaveStyle]} 
            />
          )}
          <TouchableOpacity 
            style={[styles.recordButton, isRecording ? styles.recordButtonActive : styles.recordButtonIdle]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? <StopCircle color="#fff" size={40} /> : <Mic color="#fff" size={40} />}
          </TouchableOpacity>
        </View>

        <Text style={[theme.typography.caption, styles.helperText]}>
          {isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xxl,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  progressActive: {
    backgroundColor: theme.colors.accentTeal,
  },
  progressPast: {
    backgroundColor: `${theme.colors.accentTeal}80`,
  },
  progressInactive: {
    backgroundColor: theme.colors.surfaceElevated,
  },
  stepText: {
    color: theme.colors.accentTeal,
    fontWeight: '700',
    marginBottom: theme.spacing.lg,
  },
  phraseCard: {
    width: '100%',
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    marginBottom: 60,
  },
  phraseText: {
    textAlign: 'center',
    lineHeight: 32,
    fontSize: 24,
  },
  recordContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 160,
    width: 160,
    marginBottom: theme.spacing.xl,
    position: 'relative',
  },
  animatedWave: {
    position: 'absolute',
    width: 120,
    height: 120,
    backgroundColor: `${theme.colors.dangerRed}40`,
    borderRadius: 60,
  },
  recordButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recordButtonIdle: {
    backgroundColor: theme.colors.accentTeal,
  },
  recordButtonActive: {
    backgroundColor: theme.colors.dangerRed,
  },
  helperText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
  }
});
