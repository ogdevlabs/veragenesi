import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../config/designSystem';

export const RadioButton = ({ label, selected, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: SPACING.md || 8,
      }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: selected ? COLORS.primary : '#ccc',
          backgroundColor: selected ? COLORS.primary : COLORS.white,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: SPACING.md || 12,
        }}
      >
        {selected && (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: COLORS.white,
            }}
          />
        )}
      </View>
      <Text style={[TYPOGRAPHY.body, { color: COLORS.text_primary }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
