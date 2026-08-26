import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotiView } from 'moti';
import { Shield } from 'lucide-react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { theme } from '../constants/theme';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setIsLoading(true);
    
    // Mock network request
    setTimeout(async () => {
      await AsyncStorage.setItem('user_session', 'mock_token_123');
      await AsyncStorage.setItem('user_name', 'Vineet Doe');
      await AsyncStorage.setItem('user_email', email);
      setIsLoading(false);
      navigation.replace('MainTabs');
    }, 1500);
  };

  const handleGuest = async () => {
    await AsyncStorage.setItem('user_session', 'guest_session');
    await AsyncStorage.setItem('user_name', 'Guest User');
    navigation.replace('MainTabs');
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800 }}
          style={styles.header}
        >
          <View style={styles.iconContainer}>
            <Shield color={theme.colors.accentTeal} size={48} />
          </View>
          <Text style={[theme.typography.display, { marginBottom: theme.spacing.sm }]}>Welcome Back</Text>
          <Text style={theme.typography.caption}>Log in to protect your voice</Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 200 }}
          style={styles.form}
        >
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            error={error && !email ? 'Email is required' : undefined}
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={error && !password ? 'Password is required' : undefined}
            style={{ marginBottom: theme.spacing.md }}
          />
          
          {error && email && password ? (
            <Text style={[theme.typography.caption, { color: theme.colors.dangerRed, marginBottom: theme.spacing.md }]}>
              {error}
            </Text>
          ) : null}

          <Button 
            title="Log In" 
            onPress={handleLogin} 
            isLoading={isLoading} 
            style={styles.loginButton} 
          />

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={[theme.typography.caption, styles.dividerText]}>or</Text>
            <View style={styles.divider} />
          </View>

          <Button 
            title="Continue as Guest" 
            variant="secondary" 
            onPress={handleGuest} 
            style={styles.guestButton} 
          />

          <View style={styles.footer}>
            <Text style={theme.typography.caption}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={[theme.typography.caption, { color: theme.colors.accentTeal, fontWeight: '700' }]}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </MotiView>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  iconContainer: {
    backgroundColor: `${theme.colors.accentTeal}15`,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: `${theme.colors.accentTeal}30`,
  },
  form: {
    width: '100%',
  },
  loginButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    marginHorizontal: theme.spacing.md,
  },
  guestButton: {
    marginBottom: theme.spacing.xxl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
