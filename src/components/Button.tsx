import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({ 
  title, 
  variant = 'primary', 
  isLoading = false, 
  disabled = false,
  style, 
  textStyle,
  ...props 
}: ButtonProps) {
  
  const getBackgroundColor = () => {
    if (disabled) return theme.colors.surfaceElevated;
    switch (variant) {
      case 'primary': return theme.colors.accentTeal;
      case 'secondary': return theme.colors.surface;
      case 'danger': return theme.colors.dangerRed;
      case 'ghost': return 'transparent';
      default: return theme.colors.accentTeal;
    }
  };

  const getBorderColor = () => {
    if (disabled) return theme.colors.border;
    switch (variant) {
      case 'secondary': return theme.colors.border;
      default: return getBackgroundColor();
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.textDisabled;
    switch (variant) {
      case 'primary': return '#000000'; // Dark text on teal
      case 'secondary': return theme.colors.textPrimary;
      case 'danger': return '#FFFFFF';
      case 'ghost': return theme.colors.accentTeal;
      default: return '#000000';
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
        style,
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
});
