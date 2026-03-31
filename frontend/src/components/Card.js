import React from 'react';
import { View } from 'react-native';
import { COLORS, SPACING } from '../../config/designSystem';

export const Card = ({ children, style, onPress }) => {
  const TouchableComponent = onPress ? require('react-native').TouchableOpacity : View;
  
  return (
    <TouchableComponent
      onPress={onPress}
      style={[
        {
          backgroundColor: COLORS.white,
          borderRadius: 12,
          padding: SPACING.medium,
          marginBottom: SPACING.medium,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        style,
      ]}
    >
      {children}
    </TouchableComponent>
  );
};
