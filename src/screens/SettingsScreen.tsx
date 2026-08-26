// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotiView } from 'moti';
import { Shield, Bell, Lock, CircleHelp as HelpCircle, LogOut, ChevronRight, User, Volume2, Smartphone, Cloud, Info } from 'lucide-react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/Card';
import { theme } from '../constants/theme';
import { useProtection } from '../context/ProtectionContext';

const SETTINGS_KEY = 'voxsentry_settings';

export default function SettingsScreen({ navigation }: any) {
  const { isProtectionActive, toggleProtection } = useProtection();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [processingMode, setProcessingMode] = useState<'device' | 'cloud'>('device');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    loadSettings();
    loadUserData();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const { push, sound } = JSON.parse(stored);
        setPushEnabled(push ?? true);
        setSoundEnabled(sound ?? true);
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    }
  };

  const loadUserData = async () => {
    const name = await AsyncStorage.getItem('user_name');
    const email = await AsyncStorage.getItem('user_email');
    setUserName(name || 'Guest User');
    setUserEmail(email || 'Not provided');
  };

  const saveSettings = async (newSettings: any) => {
    try {
      const current = { push: pushEnabled, sound: soundEnabled, ...newSettings };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(current));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  };

  const handleTogglePush = (val: boolean) => {
    setPushEnabled(val);
    saveSettings({ push: val });
  };

  const handleToggleSound = (val: boolean) => {
    setSoundEnabled(val);
    saveSettings({ sound: val });
  };

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem('user_session');
            await AsyncStorage.removeItem('user_name');
            await AsyncStorage.removeItem('user_email');
            navigation.getParent()?.replace('Login') || navigation.replace('Login');
          }
        }
      ]
    );
  };

  const showPrivacyModal = () => {
    Alert.alert(
      "Privacy & Compliance",
      "VoxSentry complies with local privacy regulations by defaulting to On-Device inference. Your voice data and biometric embeddings never leave your device unless you explicitly opt-in to Cloud Processing (Coming Soon).\n\nVersion 1.0.0"
    );
  };

  const SettingRow = ({ icon: Icon, title, subtitle, rightElement, onPress, isDestructive = false }: any) => (
    <TouchableOpacity 
      style={styles.settingRow}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.iconContainer, isDestructive && { backgroundColor: `${theme.colors.dangerRed}15` }]}>
        <Icon color={isDestructive ? theme.colors.dangerRed : theme.colors.accentTeal} size={20} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[theme.typography.body, isDestructive && { color: theme.colors.dangerRed, fontWeight: '700' }]}>{title}</Text>
        {subtitle && <Text style={[theme.typography.caption, { marginTop: 2 }]}>{subtitle}</Text>}
      </View>
      {rightElement || (onPress && <ChevronRight color={theme.colors.textSecondary} size={20} />)}
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500 }}
        style={styles.header}
      >
        <Text style={theme.typography.display}>Settings</Text>
      </MotiView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400, delay: 100 }}>
          <Card style={styles.profileCard}>
            <View style={styles.profileIcon}>
              <User color={theme.colors.accentTeal} size={32} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={theme.typography.heading}>{userName}</Text>
              <Text style={theme.typography.caption}>{userEmail}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </Card>
        </MotiView>

        {/* Protection & Privacy */}
        <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400, delay: 200 }}>
          <Text style={[theme.typography.caption, styles.sectionTitle]}>PROTECTION & PRIVACY</Text>
          <Card style={styles.settingsCard}>
            <SettingRow 
              icon={Shield} 
              title="Real-time Protection" 
              subtitle={isProtectionActive ? "Active" : "Inactive"}
              rightElement={
                <Switch 
                  value={isProtectionActive}
                  onValueChange={toggleProtection}
                  trackColor={{ false: theme.colors.surfaceElevated, true: theme.colors.accentTeal }}
                  thumbColor="#ffffff"
                />
              }
            />
            <View style={styles.divider} />
            <SettingRow 
              icon={Lock} 
              title="Privacy Policy" 
              onPress={showPrivacyModal}
            />
          </Card>
        </MotiView>

        {/* Preferences */}
        <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400, delay: 300 }}>
          <Text style={[theme.typography.caption, styles.sectionTitle]}>PREFERENCES</Text>
          <Card style={styles.settingsCard}>
            <SettingRow 
              icon={Bell} 
              title="Push Notifications" 
              subtitle="Alerts for detected threats"
              rightElement={
                <Switch 
                  value={pushEnabled}
                  onValueChange={handleTogglePush}
                  trackColor={{ false: theme.colors.surfaceElevated, true: theme.colors.accentTeal }}
                  thumbColor="#ffffff"
                />
              }
            />
            <View style={styles.divider} />
            <SettingRow 
              icon={Volume2} 
              title="Sound Alerts" 
              rightElement={
                <Switch 
                  value={soundEnabled}
                  onValueChange={handleToggleSound}
                  trackColor={{ false: theme.colors.surfaceElevated, true: theme.colors.accentTeal }}
                  thumbColor="#ffffff"
                />
              }
            />
          </Card>
        </MotiView>

        {/* Support & Account */}
        <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400, delay: 400 }}>
          <Text style={[theme.typography.caption, styles.sectionTitle]}>SUPPORT & ACCOUNT</Text>
          <Card style={styles.settingsCard}>
            <SettingRow 
              icon={HelpCircle} 
              title="Help & Support" 
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <SettingRow 
              icon={LogOut} 
              title="Log Out" 
              onPress={handleLogout}
              isDestructive={true}
            />
          </Card>
        </MotiView>
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.xl,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  profileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${theme.colors.accentTeal}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  editButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.full,
  },
  editButtonText: {
    color: theme.colors.accentTeal,
    fontWeight: '600',
    fontSize: 14,
  },
  sectionTitle: {
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    letterSpacing: 1,
  },
  settingsCard: {
    padding: 0,
    marginBottom: theme.spacing.xl,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${theme.colors.accentTeal}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginLeft: 68,
  },
  bottomSpacer: {
    height: 40,
  }
});
