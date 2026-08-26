import React from 'react';
import { View, StyleSheet, ScrollView, ViewStyle, ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';

type Props = {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  scrollViewProps?: ScrollViewProps;
  paddingHorizontal?: number;
};

export function ScreenContainer({ 
  children, 
  scrollable = true, 
  style, 
  contentContainerStyle,
  scrollViewProps,
  paddingHorizontal = theme.spacing.lg
}: Props) {
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    {
      paddingTop: insets.top,
      paddingBottom: Math.max(insets.bottom, 80),
    },
    style,
  ];

  if (scrollable) {
    return (
      <View style={containerStyle}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingHorizontal, paddingTop: theme.spacing.xl, paddingBottom: theme.spacing.xl, flexGrow: 1, gap: theme.spacing.lg },
            contentContainerStyle
          ]}
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[
      containerStyle, 
      { paddingHorizontal, paddingTop: theme.spacing.xl, paddingBottom: theme.spacing.xl, gap: theme.spacing.lg }, 
      contentContainerStyle
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
