import React from 'react';
import { TextInput, View, Text } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../config/designSystem';

export const TextField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  error = null,
  editable = true,
}) => {
  return (
    <View style={{ marginBottom: SPACING.medium }}>
      {label && (
        <Text style={[TYPOGRAPHY.label, { marginBottom: SPACING.small, color: COLORS.text_primary }]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          {
            borderWidth: 1,
            borderColor: error ? COLORS.error : COLORS.border,
            borderRadius: 8,
            paddingHorizontal: SPACING.medium,
            paddingVertical: SPACING.small,
            fontSize: TYPOGRAPHY.body.fontSize,
            color: COLORS.text_primary,
            backgroundColor: editable ? COLORS.white : COLORS.background,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.text_tertiary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        editable={editable}
      />
      {error && (
        <Text style={[TYPOGRAPHY.caption, { color: COLORS.error, marginTop: SPACING.small }]}>
          {error}
        </Text>
      )}
    </View>
  );
};
