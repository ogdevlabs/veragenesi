import React from 'react';
import { View, Text } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../config/designSystem';

export const ProgressBar = ({ current, total, label }) => {
  const percentage = (current / total) * 100;

  return (
    <View style={{ marginBottom: SPACING.medium }}>
      {label && (
        <Text style={[TYPOGRAPHY.caption, { color: COLORS.text_tertiary, marginBottom: SPACING.small }]}>
          {label}
        </Text>
      )}
      <View
        style={{
          height: 8,
          backgroundColor: COLORS.background,
          borderRadius: 4,
          overflow: 'hidden',
          marginBottom: SPACING.small,
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: COLORS.primary,
            borderRadius: 4,
          }}
        />
      </View>
      <Text style={[TYPOGRAPHY.caption, { color: COLORS.text_tertiary, textAlign: 'right' }]}>
        {current} of {total}
      </Text>
    </View>
  );
};
