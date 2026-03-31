import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../config/designSystem';

const STEPS = [
  {
    emoji: '🔐',
    title: 'Crea tu cuenta',
    desc: 'Regístrate con tu correo para comenzar tu viaje de bienestar emocional.',
    color: COLORS.primary,
    bg: COLORS.primary_pale,
  },
  {
    emoji: '🎯',
    title: 'Descubre tu arquetipo',
    desc: 'Completa las evaluaciones para conocer tu perfil emocional único y tu inteligencia emocional.',
    color: COLORS.purple,
    bg: COLORS.purple_light,
  },
  {
    emoji: '🛠️',
    title: 'Usa las herramientas',
    desc: 'Practica técnicas de regulación emocional — respiración, journaling, enraizamiento y más.',
    color: COLORS.teal,
    bg: COLORS.teal_light,
  },
  {
    emoji: '📈',
    title: 'Mide tu crecimiento',
    desc: 'Observa tu progreso con el tiempo y cómo mejora tu bienestar emocional día a día.',
    color: COLORS.secondary,
    bg: COLORS.secondary_light,
  },
];

const UsageGuideFooter = ({ style }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={styles.header}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>📘</Text>
          <Text style={styles.headerText}>Guía de uso</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          <Text style={styles.subtitle}>¿Cómo funciona VeraGenesi?</Text>

          {STEPS.map((step, i) => (
            <View key={i} style={[styles.step, { borderLeftColor: step.color }]}>
              <View style={[styles.stepEmojiWrap, { backgroundColor: step.bg }]}>
                <Text style={styles.stepEmoji}>{step.emoji}</Text>
              </View>
              <View style={styles.stepBody}>
                <Text style={[styles.stepNum, { color: step.color }]}>Paso {i + 1}</Text>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          ))}

          <View style={styles.tips}>
            <Text style={styles.tipsTitle}>💡 Consejos rápidos</Text>
            <Text style={styles.tipItem}>• Usa las herramientas cuando sientas estrés o ansiedad</Text>
            <Text style={styles.tipItem}>• El registro diario del estado de ánimo toma menos de 10 segundos</Text>
            <Text style={styles.tipItem}>• Las evaluaciones solo se hacen una vez y los resultados son permanentes</Text>
            <Text style={styles.tipItem}>• Puedes guardar tu avance y continuar más tarde durante la evaluación</Text>
          </View>

          <View style={styles.privacy}>
            <Text style={styles.privacyText}>
              🔒 Tu información es privada y segura. Nunca compartimos tus datos personales sin tu consentimiento explícito.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerIcon: {
    fontSize: 18,
  },
  headerText: {
    ...TYPOGRAPHY.body_large,
    fontWeight: '600',
    color: COLORS.text_primary,
  },
  badge: {
    backgroundColor: COLORS.primary_light,
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  subtitle: {
    ...TYPOGRAPHY.body_medium,
    color: COLORS.text_secondary,
    marginBottom: SPACING.md,
    fontStyle: 'italic',
  },
  step: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 3,
    paddingLeft: SPACING.md,
  },
  stepEmojiWrap: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepEmoji: {
    fontSize: 20,
  },
  stepBody: {
    flex: 1,
  },
  stepNum: {
    ...TYPOGRAPHY.label,
    fontWeight: '700',
    marginBottom: 2,
  },
  stepTitle: {
    ...TYPOGRAPHY.body_medium,
    fontWeight: '700',
    color: COLORS.text_primary,
    marginBottom: 2,
  },
  stepDesc: {
    ...TYPOGRAPHY.body_small,
    color: COLORS.text_secondary,
    lineHeight: 18,
  },
  tips: {
    backgroundColor: COLORS.accent_light,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  tipsTitle: {
    ...TYPOGRAPHY.body_medium,
    fontWeight: '700',
    color: COLORS.text_primary,
    marginBottom: SPACING.sm,
  },
  tipItem: {
    ...TYPOGRAPHY.body_small,
    color: COLORS.text_secondary,
    marginBottom: 4,
    lineHeight: 18,
  },
  privacy: {
    backgroundColor: COLORS.primary_pale,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  privacyText: {
    ...TYPOGRAPHY.body_small,
    color: COLORS.primary_dark,
    lineHeight: 18,
  },
});

export default UsageGuideFooter;
