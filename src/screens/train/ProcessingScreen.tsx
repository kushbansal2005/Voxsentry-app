import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { CheckCircle, Loader } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { theme } from '../../constants/theme';

const steps = [
  "Uploading samples...",
  "Checking audio quality...",
  "Extracting voice embedding...",
  "Saving to your voice library..."
];

export default function ProcessingScreen({ navigation }: any) {
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
    <ScreenContainer>
      <View style={styles.container}>
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          style={styles.header}
        >
          <Text style={[theme.typography.display, styles.title]}>Processing Voice</Text>
          <Text style={[theme.typography.caption, styles.subtitle]}>Please do not close the app</Text>
        </MotiView>

        <Card style={styles.card}>
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
                style={[styles.stepRow, index === steps.length - 1 && styles.lastStepRow]}
              >
                <View style={styles.iconContainer}>
                  {isCompleted ? (
                    <CheckCircle color={theme.colors.successGreen} size={24} />
                  ) : isActive ? (
                    <MotiView
                      from={{ rotate: '0deg' }}
                      animate={{ rotate: '360deg' }}
                      transition={{ type: 'timing', duration: 1000, loop: true, repeatReverse: false }}
                    >
                      <Loader color={theme.colors.accentTeal} size={24} />
                    </MotiView>
                  ) : (
                    <View style={styles.pendingDot} />
                  )}
                </View>
                <Text 
                  style={[
                    theme.typography.body, 
                    { fontWeight: '700' },
                    isCompleted ? { color: theme.colors.successGreen } : isActive ? { color: theme.colors.accentTeal } : { color: theme.colors.textDisabled }
                  ]}
                >
                  {step}
                </Text>
              </MotiView>
            );
          })}
        </Card>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    marginTop: theme.spacing.sm,
    color: theme.colors.accentTeal,
  },
  card: {
    padding: theme.spacing.xl,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  lastStepRow: {
    marginBottom: 0,
  },
  iconContainer: {
    width: 32,
    height: 32,
    marginRight: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.surfaceElevated,
  },
});
