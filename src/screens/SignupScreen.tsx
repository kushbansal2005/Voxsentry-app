import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotiView } from 'moti';
import { Shield } from 'lucide-react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { theme } from '../constants/theme';

export default function SignupScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(async () => {
      await AsyncStorage.setItem('user_session', 'mock_token_123');
      await AsyncStorage.setItem('user_name', name);
      await AsyncStorage.setItem('user_email', email);
      setIsLoading(false);
      navigation.replace('MainTabs');
    }, 1500);
  };

  return (
    <ScreenContainer scrollViewProps={{ contentContainerStyle: { flexGrow: 1, justifyContent: 'center' } }}>
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
          <Text style={[theme.typography.display, { marginBottom: theme.spacing.sm }]}>Create Account</Text>
          <Text style={theme.typography.caption}>Join VoxSentry to secure your identity</Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 200 }}
          style={styles.form}
        >
          <Input
            label="Full Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            error={error && !name ? 'Name is required' : undefined}
          />
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
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={error && !password ? 'Password is required' : undefined}
            style={{ marginBottom: theme.spacing.md }}
          />

          {error && name && email && password ? (
            <Text style={[theme.typography.caption, { color: theme.colors.dangerRed, marginBottom: theme.spacing.md }]}>
              {error}
            </Text>
          ) : null}

          <Button 
            title="Sign Up" 
            onPress={handleSignup} 
            isLoading={isLoading} 
            style={styles.signupButton} 
          />

          <View style={styles.footer}>
            <Text style={theme.typography.caption}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={[theme.typography.caption, { color: theme.colors.accentTeal, fontWeight: '700' }]}>Log in</Text>
            </TouchableOpacity>
          </View>
        </MotiView>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xxl,
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
  signupButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: theme.spacing.xxl,
  },
});
