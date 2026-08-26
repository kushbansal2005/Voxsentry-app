import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Shield, AlertTriangle } from 'lucide-react-native';
import { MotiView } from 'moti';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { theme } from '../../constants/theme';

export default function ConsentScreen({ navigation }: any) {
  return (
    <ScreenContainer scrollViewProps={{ contentContainerStyle: { paddingBottom: 100 } }}>
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500 }}
        style={styles.header}
      >
        <View style={styles.iconContainer}>
          <Shield color={theme.colors.accentTeal} size={40} />
        </View>
        <Text style={[theme.typography.display, styles.title]}>Data & Privacy Consent</Text>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500, delay: 100 }}
      >
        <Card style={styles.card}>
          <Text style={[theme.typography.heading, { marginBottom: theme.spacing.md }]}>How we use your voice</Text>
          <Text style={[theme.typography.body, styles.bodyText]}>
            To detect deepfakes, we need a small sample of your real voice. This creates an encrypted mathematical signature (voice embedding).
          </Text>
          <Text style={[theme.typography.body, styles.bodyText]}>
            • Your audio recordings never leave this device.{"\n"}
            • Only the mathematical embedding is saved.{"\n"}
            • We cannot recreate your voice from this data.
          </Text>
        </Card>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500, delay: 200 }}
      >
        <Card style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <AlertTriangle color={theme.colors.dangerRed} size={24} />
            <Text style={[theme.typography.heading, styles.alertTitle]}>Important</Text>
          </View>
          <Text style={[theme.typography.body, styles.alertBody]}>
            Please record your voice in a quiet room for the best accuracy. Background noise can reduce the effectiveness of the AI analysis.
          </Text>
        </Card>
      </MotiView>

      <View style={styles.footer}>
        <Button 
          title="I Understand & Agree"
          onPress={() => navigation.navigate('Recording')}
          style={styles.primaryButton}
        />
        <Button 
          title="Cancel"
          variant="ghost"
          onPress={() => navigation.goBack()}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  iconContainer: {
    backgroundColor: `${theme.colors.accentTeal}20`,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: `${theme.colors.accentTeal}50`,
  },
  title: {
    textAlign: 'center',
  },
  card: {
    marginBottom: theme.spacing.lg,
  },
  bodyText: {
    marginBottom: theme.spacing.md,
    lineHeight: 24,
  },
  alertCard: {
    backgroundColor: `${theme.colors.dangerRed}10`,
    borderColor: `${theme.colors.dangerRed}30`,
    borderWidth: 1,
    marginBottom: theme.spacing.xxl,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  alertTitle: {
    color: theme.colors.dangerRed,
    marginLeft: theme.spacing.sm,
  },
  alertBody: {
    color: `${theme.colors.dangerRed}cc`,
    lineHeight: 24,
  },
  footer: {
    paddingVertical: theme.spacing.xl,
  },
  primaryButton: {
    marginBottom: theme.spacing.md,
  },
});
