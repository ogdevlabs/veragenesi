import React from 'react';
import { Pressable, Text } from 'react-native';
import { SPACING, COLORS, BORDER_RADIUS, TYPOGRAPHY } from '../config/designSystem';

export const Button = ({
  onPress,
  text,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
}) => {
  const variants = {
    primary: {
      backgroundColor: COLORS.primary,
      color: COLORS.text_inverse,
    },
    secondary: {
      backgroundColor: COLORS.surface,
      color: COLORS.primary,
      borderWidth: 2,
      borderColor: COLORS.primary,
    },
    danger: {
      backgroundColor: COLORS.danger,
      color: COLORS.text_inverse,
    },
  };

  const sizes = {
    sm: {
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
    },
    md: {
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.lg,
    },
    lg: {
      paddingVertical: SPACING.lg,
      paddingHorizontal: SPACING.xl,
    },
  };

  const selectedVariant = variants[variant];
  const selectedSize = sizes[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          ...selectedVariant,
          ...selectedSize,
          borderRadius: BORDER_RADIUS.md,
          opacity: pressed || disabled ? 0.7 : 1,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: selectedVariant.color,
          ...TYPOGRAPHY.body_large,
          fontWeight: '600',
          textAlign: 'center',
        }}
      >
        {text}
      </Text>
    </Pressable>
  );
};

export const HeadingText = ({ text, level = 1, style, color = COLORS.text_primary }) => {
  const typographies = {
    1: TYPOGRAPHY.heading1,
    2: TYPOGRAPHY.heading2,
    3: TYPOGRAPHY.heading3,
    4: TYPOGRAPHY.heading4,
  };

  return (
    <Text
      style={[
        typographies[Math.min(level, 4)],
        { color },
        style,
      ]}
    >
      {text}
    </Text>
  );
};

export const BodyText = ({ text, style, color = COLORS.text_primary, size = 'medium' }) => {
  const sizes = {
    small: TYPOGRAPHY.body_small,
    medium: TYPOGRAPHY.body_medium,
    large: TYPOGRAPHY.body_large,
  };

  return (
    <Text
      style={[
        sizes[size],
        { color },
        style,
      ]}
    >
      {text}
    </Text>
  );
};

export const LabelText = ({ text, style, color = COLORS.text_secondary }) => {
  return (
    <Text
      style={[
        TYPOGRAPHY.label,
        { color },
        style,
      ]}
    >
      {text}
    </Text>
  );
};
