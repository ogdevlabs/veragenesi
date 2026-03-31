import React from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../config/designSystem';

export const TextField = ({ label, placeholder, value, onChangeText, error, multiline = false, secureTextEntry = false, editable = true }) => (
  <View style={styles.fieldContainer}>
    {label && <Text style={styles.label}>{label}</Text>}
    <TextInput
      style={[styles.input, error && styles.inputError, multiline && styles.multiline]}
      placeholder={placeholder}
      placeholderTextColor={COLORS.text_secondary}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      multiline={multiline}
      editable={editable}
      numberOfLines={multiline ? 4 : 1}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

export const RadioButton = ({ options, selectedValue, onSelect, error }) => (
  <View style={styles.radioContainer}>
    {options.map((option, idx) => (
      <TouchableOpacity
        key={idx}
        style={[styles.radioOption, selectedValue === option.value && styles.radioSelected]}
        onPress={() => onSelect(option.value)}
      >
        <View style={[styles.radioCircle, selectedValue === option.value && styles.radioCircleSelected]}>
          {selectedValue === option.value && <View style={styles.radioInner} />}
        </View>
        <Text style={[styles.radioLabel, selectedValue === option.value && styles.radioLabelSelected]}>
          {option.label}
        </Text>
      </TouchableOpacity>
    ))}
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

export const LikertScale = ({ labels = ['Muy Difícil', 'Difícil', 'Moderado', 'Fácil', 'Muy Fácil'], value, onSelect, error }) => (
  <View style={styles.likertContainer}>
    <View style={styles.likertScale}>
      {[1, 2, 3, 4, 5].map((scale) => (
        <TouchableOpacity
          key={scale}
          style={[styles.likertButton, value === scale && styles.likertButtonActive]}
          onPress={() => onSelect(scale)}
        >
          <Text style={[styles.likertText, value === scale && styles.likertTextActive]}>{scale}</Text>
        </TouchableOpacity>
      ))}
    </View>
    <View style={styles.likertLabels}>
      <Text style={styles.likertLabelLeft}>{labels[0]}</Text>
      <Text style={styles.likertLabelRight}>{labels[4]}</Text>
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

export const ProgressBar = ({ current, total }) => {
  const progress = (current / total) * 100;
  return (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { width: `${progress}%` }]} />
    </View>
  );
};

export const Card = ({ children, style, onPress }) => (
  <TouchableOpacity
    style={[styles.card, style]}
    onPress={onPress}
    disabled={!onPress}
  >
    {children}
  </TouchableOpacity>
);

export const QuickToolCard = ({ emoji, title, duration, description, onPress }) => (
  <Card style={styles.toolCard} onPress={onPress}>
    <Text style={styles.toolEmoji}>{emoji}</Text>
    <Text style={styles.toolTitle}>{title}</Text>
    <Text style={styles.toolDuration}>{duration} min</Text>
    <Text style={styles.toolDesc}>{description}</Text>
  </Card>
);

export const ArchetypeCard = ({ name, description, strengths, growthAreas, emoji }) => (
  <Card style={styles.archetypeCard}>
    <Text style={styles.archetypeEmoji}>{emoji}</Text>
    <Text style={styles.archetypeName}>{name}</Text>
    <Text style={styles.archetypeDesc}>{description}</Text>
    
    <View style={styles.archetypeSection}>
      <Text style={styles.sectionTitle}>Fortalezas</Text>
      {strengths.map((s, i) => (
        <Text key={i} style={styles.bulletPoint}>• {s}</Text>
      ))}
    </View>

    <View style={styles.archetypeSection}>
      <Text style={styles.sectionTitle}>Áreas de Crecimiento</Text>
      {growthAreas.map((a, i) => (
        <Text key={i} style={styles.bulletPoint}>• {a}</Text>
      ))}
    </View>
  </Card>
);

const styles = StyleSheet.create({
  // TextField
  fieldContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.label,
    marginBottom: SPACING.sm,
    color: COLORS.text_primary,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    color: COLORS.text_primary,
    ...TYPOGRAPHY.body,
  },
  multiline: {
    minHeight: 100,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    ...TYPOGRAPHY.label,
    marginTop: SPACING.xs,
  },

  // RadioButton
  radioContainer: {
    marginVertical: SPACING.md,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  radioSelected: {
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.text_secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  radioCircleSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  radioLabel: {
    color: COLORS.text_secondary,
    ...TYPOGRAPHY.body,
  },
  radioLabelSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  // LikertScale
  likertContainer: {
    marginVertical: SPACING.lg,
  },
  likertScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  likertButton: {
    width: '18%',
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  likertButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  likertText: {
    color: COLORS.text_primary,
    fontWeight: '600',
  },
  likertTextActive: {
    color: COLORS.background,
  },
  likertLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  likertLabelLeft: {
    fontSize: 12,
    color: COLORS.text_secondary,
  },
  likertLabelRight: {
    fontSize: 12,
    color: COLORS.text_secondary,
  },

  // ProgressBar
  progressContainer: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: SPACING.md,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },

  // Card
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    marginVertical: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // ToolCard
  toolCard: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  toolEmoji: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  toolTitle: {
    ...TYPOGRAPHY.heading3,
    color: COLORS.text_primary,
    marginBottom: SPACING.xs,
  },
  toolDuration: {
    color: COLORS.text_secondary,
    fontSize: 12,
    marginBottom: SPACING.sm,
  },
  toolDesc: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text_secondary,
    textAlign: 'center',
  },

  // ArchetypeCard
  archetypeCard: {
    alignItems: 'center',
  },
  archetypeEmoji: {
    fontSize: 60,
    marginBottom: SPACING.md,
  },
  archetypeName: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.text_primary,
    marginBottom: SPACING.sm,
  },
  archetypeDesc: {
    ...TYPOGRAPHY.body,
    color: COLORS.text_secondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  archetypeSection: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.heading4,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  bulletPoint: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text_secondary,
    marginBottom: SPACING.xs,
  },
});
