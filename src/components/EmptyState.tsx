import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import { Card } from './Card';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <Card style={styles.container}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={[theme.typography.heading, styles.title]}>{title}</Text>
      <Text style={[theme.typography.caption, styles.description]}>{description}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    justifyContent: 'center',
    minHeight: 200,
  },
  iconContainer: {
    marginBottom: theme.spacing.md,
    opacity: 0.5,
  },
  title: {
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
});
