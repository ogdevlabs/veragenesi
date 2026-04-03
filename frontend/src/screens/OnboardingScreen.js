import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../config/designSystem';
import { useApp } from '../state/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Educational content ────────────────────────────────────────────────────

const INFO_TILES = {
  es: [
    {
      id: '1',
      icon: '🌱',
      title: '¿Para qué sirve?',
      body:
        'Estas evaluaciones revelan cómo procesas tus emociones y qué te define como persona. Son la base de tu plan personalizado de bienestar.',
    },
    {
      id: '2',
      icon: '🧩',
      title: 'Arquetipo Personal',
      body:
        '¿Qué te mueve? 7 preguntas revelan tu estilo emocional, tus fortalezas naturales y las áreas donde puedes crecer más.',
    },
    {
      id: '3',
      icon: '🧠',
      title: 'Inteligencia Emocional',
      body:
        '¿Cómo reaccionas? 16 escenarios reales miden tu capacidad de reconocer y gestionar emociones en situaciones cotidianas.',
    },
    {
      id: '4',
      icon: '✨',
      title: 'Tu plan único',
      body:
        'Con tus resultados, VeraGenesi crea un camino hecho para ti: herramientas, estrategias y recursos que realmente funcionan para tu perfil.',
    },
  ],
  en: [
    {
      id: '1',
      icon: '🌱',
      title: 'What is this for?',
      body:
        'These evaluations reveal how you process emotions and what defines you as a person. They form the foundation of your personalized wellness plan.',
    },
    {
      id: '2',
      icon: '🧩',
      title: 'Personal Archetype',
      body:
        'What drives you? 7 questions reveal your emotional style, natural strengths, and the areas where you can grow the most.',
    },
    {
      id: '3',
      icon: '🧠',
      title: 'Emotional Intelligence',
      body:
        'How do you react? 16 real-life scenarios measure your ability to recognize and manage emotions in everyday situations.',
    },
    {
      id: '4',
      icon: '✨',
      title: 'Your unique plan',
      body:
        'With your results, VeraGenesi creates a path made for you: tools, strategies, and resources that truly work for your profile.',
    },
  ],
};

const STRINGS = {
  es: {
    heading: 'Evaluación inicial',
    subheading: 'Completa las dos evaluaciones para desbloquear tu plan personalizado.',
    archetypeTitle: 'Arquetipo Personal',
    archetypeQuestions: '7 preguntas',
    eiTitle: 'Inteligencia Emocional',
    eiQuestions: '16 preguntas',
    start: 'Iniciar',
    locked: 'Completa primero el Arquetipo',
    completed: 'Completado ✓',
  },
  en: {
    heading: 'Initial Evaluation',
    subheading: 'Complete both evaluations to unlock your personalized plan.',
    archetypeTitle: 'Personal Archetype',
    archetypeQuestions: '7 questions',
    eiTitle: 'Emotional Intelligence',
    eiQuestions: '16 questions',
    start: 'Start',
    locked: 'Complete Archetype first',
    completed: 'Completed ✓',
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

const OnboardingScreen = ({ navigation }) => {
  const { lang, archetypeResults, eiResults } = useApp();
  const insets = useSafeAreaInsets();
  const t = STRINGS[lang] || STRINGS.es;
  const tiles = INFO_TILES[lang] || INFO_TILES.es;

  const { width: screenWidth } = useWindowDimensions();
  const TILE_WIDTH = screenWidth - SPACING.lg * 2;

  const flatListRef = useRef(null);
  const [activeTile, setActiveTile] = useState(0);
  const [tilesExpanded, setTilesExpanded] = useState(true);

  const toggleTiles = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTilesExpanded((v) => !v);
  };

  const archetypeDone = !!archetypeResults;
  const eiDone = !!eiResults;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveTile(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
        <Text style={styles.brandName}>VeraGenesi</Text>
        <Text style={styles.heading}>{t.heading}</Text>
        <Text style={styles.subheading}>{t.subheading}</Text>
      </View>

      {/* Horizontal educational tiles */}
      <TouchableOpacity style={styles.tilesHeader} onPress={toggleTiles} activeOpacity={0.7}>
        <Text style={styles.tilesHeaderText}>
          {lang === 'en' ? 'About the evaluations' : 'Acerca de las evaluaciones'}
        </Text>
        <Text style={styles.tilesChevron}>{tilesExpanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {tilesExpanded && (
      <View style={styles.tilesSection}>
        <FlatList
          ref={flatListRef}
          data={tiles}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={TILE_WIDTH + SPACING.md}
          snapToAlignment="start"
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: SPACING.lg }}
          ItemSeparatorComponent={() => <View style={{ width: SPACING.md }} />}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          renderItem={({ item }) => (
            <View style={[styles.infoTile, { width: TILE_WIDTH }]}>
              <Text style={styles.tileIcon}>{item.icon}</Text>
              <Text style={styles.tileTitle}>{item.title}</Text>
              <Text style={styles.tileBody}>{item.body}</Text>
            </View>
          )}
        />
        {/* Dot indicators */}
        <View style={styles.dotsRow}>
          {tiles.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeTile && styles.dotActive]}
            />
          ))}
        </View>
      </View>
      )}

      {/* Evaluation cards */}
      <View style={styles.cardsSection}>
        {/* Archetype card */}
        <TouchableOpacity
          style={[styles.evalCard, archetypeDone && styles.evalCardDone]}
          onPress={() => !archetypeDone && navigation.navigate('ArchetypeQuiz')}
          activeOpacity={archetypeDone ? 1 : 0.75}
        >
          <View style={styles.evalCardLeft}>
            <Text style={styles.evalIcon}>🧩</Text>
            <View>
              <Text style={styles.evalTitle}>{t.archetypeTitle}</Text>
              <Text style={styles.evalMeta}>{t.archetypeQuestions}</Text>
            </View>
          </View>
          <View style={[styles.evalBadge, archetypeDone && styles.evalBadgeDone]}>
            <Text style={[styles.evalBadgeText, archetypeDone && styles.evalBadgeTextDone]}>
              {archetypeDone ? t.completed : t.start}
            </Text>
          </View>
        </TouchableOpacity>

        {/* EI card — greyed out until archetype done */}
        <TouchableOpacity
          style={[styles.evalCard, styles.evalCardLocked, eiDone && styles.evalCardDone]}
          onPress={() => archetypeDone && !eiDone && navigation.navigate('EIAssessment')}
          activeOpacity={archetypeDone ? 0.75 : 1}
        >
          <View style={styles.evalCardLeft}>
            <Text style={[styles.evalIcon, !archetypeDone && styles.lockedIcon]}>🧠</Text>
            <View>
              <Text style={[styles.evalTitle, !archetypeDone && styles.lockedText]}>
                {t.eiTitle}
              </Text>
              <Text style={[styles.evalMeta, !archetypeDone && styles.lockedMeta]}>
                {!archetypeDone ? t.locked : t.eiQuestions}
              </Text>
            </View>
          </View>
          {archetypeDone && (
            <View style={[styles.evalBadge, eiDone && styles.evalBadgeDone]}>
              <Text style={[styles.evalBadgeText, eiDone && styles.evalBadgeTextDone]}>
                {eiDone ? t.completed : t.start}
              </Text>
            </View>
          )}
          {!archetypeDone && (
            <View style={styles.lockIcon}>
              <Text style={styles.lockEmoji}>🔒</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  brandName: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.primary,
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  heading: {
    ...TYPOGRAPHY.heading3,
    color: COLORS.text_primary,
    marginBottom: SPACING.xs,
  },
  subheading: {
    ...TYPOGRAPHY.body_medium,
    color: COLORS.text_secondary,
  },

  // Tiles collapse/expand header
  tilesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  tilesHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text_secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tilesChevron: {
    fontSize: 11,
    color: COLORS.text_tertiary,
  },

  // Tiles
  tilesSection: {
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
  },
  infoTile: {
    backgroundColor: COLORS.primary_pale,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    justifyContent: 'center',
    minHeight: 128,
    ...SHADOWS.md,
  },
  tileIcon: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  tileTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary_dark,
    marginBottom: SPACING.xs,
  },
  tileBody: {
    fontSize: 13,
    color: COLORS.text_primary,
    lineHeight: 18,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 20,
  },

  // Evaluation cards
  cardsSection: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    gap: SPACING.md,
  },
  evalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.primary_light,
    ...SHADOWS.sm,
  },
  evalCardLocked: {
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface_alt,
  },
  evalCardDone: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.secondary_light,
  },
  evalCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  evalIcon: {
    fontSize: 28,
  },
  lockedIcon: {
    opacity: 0.4,
  },
  evalTitle: {
    ...TYPOGRAPHY.body_large,
    fontWeight: '600',
    color: COLORS.text_primary,
  },
  evalMeta: {
    ...TYPOGRAPHY.body_small,
    color: COLORS.text_secondary,
    marginTop: 2,
  },
  lockedText: {
    color: COLORS.text_tertiary,
  },
  lockedMeta: {
    color: COLORS.text_tertiary,
  },
  evalBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.round,
  },
  evalBadgeDone: {
    backgroundColor: COLORS.secondary,
  },
  evalBadgeText: {
    ...TYPOGRAPHY.label,
    color: COLORS.text_inverse,
    fontWeight: '700',
  },
  evalBadgeTextDone: {
    color: COLORS.text_inverse,
  },
  lockIcon: {
    padding: SPACING.sm,
  },
  lockEmoji: {
    fontSize: 18,
    opacity: 0.5,
  },
});

export default OnboardingScreen;
