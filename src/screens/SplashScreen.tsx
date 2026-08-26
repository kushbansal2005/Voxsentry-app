import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Shield } from 'lucide-react-native';
import { MotiView } from 'moti';
import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../constants/theme';

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
    <ScreenContainer>
      <View style={styles.container}>
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 1000 }}
          style={styles.content}
        >
          <View style={styles.iconContainer}>
            <Shield color={theme.colors.accentTeal} size={48} />
          </View>
          <Text style={[theme.typography.display, styles.title]}>VOXSENTRY</Text>
          <Text style={[theme.typography.caption, styles.subtitle]}>INITIALIZING...</Text>
        </MotiView>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: theme.colors.surfaceElevated,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: `${theme.colors.accentTeal}30`,
  },
  title: {
    color: theme.colors.accentTeal,
    letterSpacing: 2,
  },
  subtitle: {
    marginTop: theme.spacing.md,
    letterSpacing: 4,
  },
});
