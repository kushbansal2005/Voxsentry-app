export const theme = {
  colors: {
    background: '#0B0F1A',
    surface: '#151B2B',
    surfaceElevated: '#1C2338',
    border: '#2A3350',
    
    textPrimary: '#F5F7FA',
    textSecondary: '#9BA3B8',
    textDisabled: '#5C6478',

    accentTeal: '#2DD4E8',
    successGreen: '#34D399',
    dangerRed: '#F87171',
    warningAmber: '#FBBF24',
  },
  typography: {
    display: {
      fontSize: 28,
      fontWeight: '700' as const,
      color: '#F5F7FA',
    },
    heading: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: '#F5F7FA',
    },
    body: {
      fontSize: 15,
      fontWeight: '400' as const,
      color: '#F5F7FA',
    },
    caption: {
      fontSize: 13,
      fontWeight: '400' as const,
      color: '#9BA3B8',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  borderRadius: {
    md: 12,
    lg: 16,
    full: 9999,
  }
};
