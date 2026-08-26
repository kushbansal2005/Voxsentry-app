import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card = ({ children, style }: CardProps) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

interface CardHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  iconBgColor?: string;
}

export const CardHeader = ({ icon, title, subtitle, rightAction, iconBgColor }: CardHeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        {icon && (
          <View style={[styles.iconContainer, iconBgColor ? { backgroundColor: iconBgColor } : null]}>
            {icon}
          </View>
        )}
        <View style={styles.headerTextContainer}>
          <Text style={theme.typography.heading}>{title}</Text>
          {subtitle && <Text style={[theme.typography.caption, { marginTop: 2 }]}>{subtitle}</Text>}
        </View>
      </View>
      {rightAction && <View>{rightAction}</View>}
    </View>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CardBody = ({ children, style }: CardBodyProps) => {
  return (
    <View style={[styles.bodyContainer, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: theme.spacing.lg,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  headerTextContainer: {
    flex: 1,
  },
  bodyContainer: {
    // default body container styles if needed
  }
});
