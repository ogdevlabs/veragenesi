import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { HeadingText, BodyText, Button } from '../components/BasicComponents';
import { QuickToolCard } from '../components/FormComponents';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS, TYPOGRAPHY } from '../config/designSystem';
import { useAuth } from '../state/AuthContext';
import { useApp } from '../state/AppContext';
import { TOOLS, ARCHETYPES } from '../utils/scoring';
import UsageGuideFooter from '../components/UsageGuideFooter';

const MOOD_ITEMS = [
  { value: 0, emoji: '😢', label: 'Muy Triste', color: '#DC2626' },
  { value: 1, emoji: '😟', label: 'Triste', color: '#EF4444' },
  { value: 2, emoji: '😕', label: 'Preocupado', color: '#F97316' },
  { value: 3, emoji: '😐', label: 'Neutral', color: '#F59E0B' },
  { value: 4, emoji: '😌', label: 'Calmo', color: '#EAB308' },
  { value: 5, emoji: '🙂', label: 'Bien', color: '#84CC16' },
  { value: 6, emoji: '😊', label: 'Feliz', color: '#22C55E' },
  { value: 7, emoji: '😄', label: 'Muy Feliz', color: '#10B981' },
  { value: 8, emoji: '🤩', label: 'Alegre', color: '#0D9488' },
  { value: 9, emoji: '😍', label: 'Enamorado', color: '#6366F1' },
  { value: 10, emoji: '🥳', label: 'Eufórico', color: '#8B5CF6' },
];

const TOOL_COLORS = [
  { bg: COLORS.primary_pale, accent: COLORS.primary },
  { bg: COLORS.purple_light, accent: COLORS.purple },
  { bg: COLORS.teal_light, accent: COLORS.teal },
  { bg: COLORS.secondary_light, accent: COLORS.secondary },
  { bg: COLORS.accent_light, accent: COLORS.accent },
];

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { archetypeResults } = useApp();
  const [currentMood, setCurrentMood] = useState(5);

  const archetype = archetypeResults && ARCHETYPES[archetypeResults.primary];
  const mood = MOOD_ITEMS[currentMood];

  const handleToolPress = (tool) => {
    navigation.navigate('ToolDetail', { tool });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <BodyText text="Herramientas de bienestar" color={COLORS.text_secondary} size="small" />
          <HeadingText text="¿Qué necesitas hoy?" level={2} style={styles.headerTitle} />
        </View>
        {archetype && (
          <View style={styles.archetypePill}>
            <Text style={styles.archetypePillText}>{archetype.emoji} {archetype.name}</Text>
          </View>
        )}
      </View>

      {/* ── Mood Card ── */}
      <View style={[styles.moodCard, { borderLeftColor: mood.color }]}>
        <View style={styles.moodTop}>
          <Text style={styles.moodBigEmoji}>{mood.emoji}</Text>
          <View style={styles.moodLabels}>
            <Text style={styles.moodTitle}>Estado de ánimo</Text>
            <Text style={[styles.moodValue, { color: mood.color }]}>{mood.label}</Text>
          </View>
          <Text style={[styles.moodScore, { color: mood.color }]}>{currentMood}</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.moodScroll}
        >
          {MOOD_ITEMS.map((m) => (
            <TouchableOpacity
              key={m.value}
              onPress={() => setCurrentMood(m.value)}
              style={[
                styles.moodDot,
                {
                  backgroundColor: currentMood === m.value ? m.color : COLORS.surface_alt,
                  borderColor: currentMood === m.value ? m.color : 'transparent',
                },
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.moodDotEmoji}>{m.emoji}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Tools Grid ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <HeadingText text="Herramientas" level={4} />
          <BodyText text={`${TOOLS.length} disponibles`} size="small" color={COLORS.text_secondary} />
        </View>
        <FlatList
          data={TOOLS}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.toolGrid}
          renderItem={({ item, index }) => {
            const colors = TOOL_COLORS[index % TOOL_COLORS.length];
            return (
              <TouchableOpacity
                style={[styles.toolCard, { backgroundColor: colors.bg, borderColor: colors.accent + '33' }]}
                onPress={() => handleToolPress(item)}
                activeOpacity={0.8}
              >
                <View style={[styles.toolEmojiWrap, { backgroundColor: colors.accent + '20' }]}>
                  <Text style={styles.toolEmoji}>{item.emoji}</Text>
                </View>
                <Text style={[styles.toolTitle, { color: colors.accent }]} numberOfLines={2}>{item.name}</Text>
                <View style={styles.toolMeta}>
                  <View style={[styles.toolDuration, { backgroundColor: colors.accent + '15' }]}>
                    <Text style={[styles.toolDurationText, { color: colors.accent }]}>⏱ {item.duration} min</Text>
                  </View>
                </View>
                <Text style={styles.toolDesc} numberOfLines={2}>{item.description}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* ── Premium Banner ── */}
      <View style={styles.premiumCard}>
        <View style={styles.premiumDecor} />
        <Text style={styles.premiumEmoji}>✨</Text>
        <HeadingText text="Plan Premium" level={4} style={styles.premiumTitle} color={COLORS.text_inverse} />
        <BodyText
          text="Herramientas avanzadas, seguimiento de progreso y análisis de tendencias emocionales."
          style={styles.premiumText}
          color="rgba(255,255,255,0.85)"
          size="small"
        />
        <TouchableOpacity style={styles.premiumBtn} activeOpacity={0.8} onPress={() => {}}>
          <Text style={styles.premiumBtnText}>Explorar Premium →</Text>
        </TouchableOpacity>
      </View>

      {/* ── Footer Guide ── */}
      <View style={styles.footerSection}>
        <UsageGuideFooter />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  headerTitle: {
    marginTop: SPACING.xs,
  },
  archetypePill: {
    backgroundColor: COLORS.primary_pale,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    maxWidth: 130,
  },
  archetypePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
  },

  // Mood card
  moodCard: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    borderLeftWidth: 4,
    ...SHADOWS.sm,
  },
  moodTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  moodBigEmoji: {
    fontSize: 36,
  },
  moodLabels: {
    flex: 1,
  },
  moodTitle: {
    ...TYPOGRAPHY.label,
    color: COLORS.text_secondary,
  },
  moodValue: {
    ...TYPOGRAPHY.body_large,
    fontWeight: '700',
    marginTop: 2,
  },
  moodScore: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 32,
  },
  moodScroll: {
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
  },
  moodDot: {
    width: 42,
    height: 42,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  moodDotEmoji: {
    fontSize: 22,
  },

  // Section
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },

  // Tool cards
  toolGrid: {
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  toolCard: {
    width: '48%',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    ...SHADOWS.sm,
  },
  toolEmojiWrap: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  toolEmoji: {
    fontSize: 24,
  },
  toolTitle: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: SPACING.xs,
  },
  toolMeta: {
    marginBottom: SPACING.xs,
  },
  toolDuration: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.round,
  },
  toolDurationText: {
    fontSize: 10,
    fontWeight: '700',
  },
  toolDesc: {
    fontSize: 11,
    color: COLORS.text_secondary,
    lineHeight: 16,
  },

  // Premium banner
  premiumCard: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    overflow: 'hidden',
    ...SHADOWS.colored,
  },
  premiumDecor: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  premiumEmoji: {
    fontSize: 28,
    marginBottom: SPACING.sm,
  },
  premiumTitle: {
    marginBottom: SPACING.xs,
  },
  premiumText: {
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  premiumBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BORDER_RADIUS.round,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  premiumBtnText: {
    color: COLORS.text_inverse,
    fontSize: 13,
    fontWeight: '700',
  },

  // Footer
  footerSection: {
    paddingHorizontal: SPACING.lg,
  },
});

export default HomeScreen;
