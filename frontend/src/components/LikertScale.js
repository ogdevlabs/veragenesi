import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../config/designSystem';

export const LikertScale = ({
  label,
  question,
  value,
  onValueChange,
  labels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
}) => {
  const scale = [1, 2, 3, 4, 5];

  return (
    <View style={{ marginBottom: SPACING.large }}>
      {label && (
        <Text style={[TYPOGRAPHY.label, { color: COLORS.text_primary, marginBottom: SPACING.small }]}>
          {label}
        </Text>
      )}
      <Text style={[TYPOGRAPHY.body, { color: COLORS.text_primary, marginBottom: SPACING.medium }]}>
        {question}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.small }}>
        {scale.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => onValueChange(option)}
            style={[
              {
                width: '18%',
                paddingVertical: SPACING.medium,
                paddingHorizontal: SPACING.small,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: value === option ? COLORS.primary : COLORS.border,
                backgroundColor: value === option ? COLORS.primary : COLORS.white,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          >
            <Text
              style={[
                TYPOGRAPHY.body,
                {
                  color: value === option ? COLORS.white : COLORS.text_primary,
                  fontWeight: 'bold',
                },
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: SPACING.small }}>
        {labels.map((label, index) => (
          <Text
            key={label}
            style={[
              TYPOGRAPHY.caption,
              {
                color: COLORS.text_tertiary,
                textAlign: 'center',
                width: '18%',
              },
            ]}
          >
            {index === 0 || index === 4 ? label : ''}
          </Text>
        ))}
      </View>
    </View>
  );
};
