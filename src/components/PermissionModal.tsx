import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import { Button } from './Button';

interface PermissionModalProps {
  visible: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  onAllow: () => void;
  onDeny: () => void;
}

export function PermissionModal({ visible, icon, title, description, onAllow, onDeny }: PermissionModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            {icon}
          </View>
          <Text style={[theme.typography.heading, styles.title]}>{title}</Text>
          <Text style={[theme.typography.body, styles.description]}>{description}</Text>
          
          <View style={styles.buttonRow}>
            <Button 
              title="Not Now" 
              variant="secondary" 
              onPress={onDeny} 
              style={styles.button}
            />
            <View style={styles.spacer} />
            <Button 
              title="Allow" 
              variant="primary" 
              onPress={onAllow} 
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 15, 26, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  modalContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${theme.colors.accentTeal}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  description: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
  },
  button: {
    flex: 1,
  },
  spacer: {
    width: theme.spacing.md,
  },
});
