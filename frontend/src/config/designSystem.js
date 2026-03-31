// Color scheme
export const COLORS = {
  primary: '#6366F1', // Indigo
  primary_dark: '#4F46E5',
  primary_light: '#E0E7FF',
  primary_pale: '#EEF2FF',
  secondary: '#10B981', // Emerald
  secondary_light: '#D1FAE5',
  accent: '#F59E0B', // Amber
  accent_light: '#FEF3C7',
  purple: '#8B5CF6',
  purple_light: '#EDE9FE',
  teal: '#0D9488',
  teal_light: '#CCFBF1',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  error: '#EF4444',
  
  // Neutral
  background: '#FFFFFF',
  surface: '#F9FAFB',
  surface_alt: '#F3F4F6',
  border: '#E5E7EB',
  divider: '#F3F4F6',
  
  // Text
  text_primary: '#1F2937',
  text_secondary: '#6B7280',
  text_tertiary: '#9CA3AF',
  text_inverse: '#FFFFFF',
  
  // Status
  high: '#10B981',
  moderate: '#F59E0B',
  low: '#EF4444',
};

// Shadow presets
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 8,
  },
  colored: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
};

// Typography
export const TYPOGRAPHY = {
  heading1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  heading2: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  heading3: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  heading4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body_large: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  body_medium: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  body_small: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};
