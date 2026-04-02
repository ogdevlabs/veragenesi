import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../config/designSystem';
import { useAuth } from '../state/AuthContext';
import { useApp } from '../state/AppContext';
import { ARCHETYPES, TOOLS } from '../utils/scoring';
import UsageGuideFooter from '../components/UsageGuideFooter';
import { storage } from '../services/storageService';

const ARCHETYPE_KEY = '@vera_archetype_progress';
const EI_KEY = '@vera_ei_progress';

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { archetypeResults, eiResults, toolStats, loadUserProfile } = useApp();
  const [savedArchetype, setSavedArchetype] = useState(null);
  const [savedEI, setSavedEI] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const archetype = archetypeResults?.primary != null ? ARCHETYPES[archetypeResults.primary] : null;
  const assessmentDone = !!archetypeResults && !!eiResults;

  useEffect(() => {
    const init = async () => {
      try {
        const [ap, ep] = await Promise.all([
          storage.getItem(ARCHETYPE_KEY),
          storage.getItem(EI_KEY),
        ]);
        if (ap) setSavedArchetype(JSON.parse(ap));
        if (ep) setSavedEI(JSON.parse(ep));
      } catch {}
      try {
        await loadUserProfile();
      } catch {}
      setProfileLoading(false);
    };
    init();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días';
    if (hour < 18) return '¡Buenas tardes';
    return '¡Buenas noches';
  };

  const scoreColor = (score) => {
    if (!score && score !== 0) return COLORS.text_tertiary;
    if (score >= 70) return COLORS.high;
    if (score >= 40) return COLORS.moderate;
    return COLORS.low;
  };

  const scoreLabel = (score) => {
    if (!score && score !== 0) return '—';
    if (score >= 70) return 'ALTO';
    if (score >= 40) return 'MODERADO';
    return 'BAJO';
  };

  const lastToolId = toolStats?.lastToolUsed;
  const lastTool = lastToolId ? TOOLS.find((t) => t.id === lastToolId) : null;

  const formatRelativeDate = (isoDate) => {
    if (!isoDate) return null;
    const diff = Date.now() - new Date(isoDate).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'hoy';
    if (days === 1) return 'ayer';
    if (days < 7) return `hace ${days} días`;
    return `hace ${Math.floor(days / 7)} semana${Math.floor(days / 7) > 1 ? 's' : ''}`;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero Header ── */}
      <View style={styles.hero}>
        <View style={styles.heroOverlay} />
        <Text style={styles.greeting}>
          {getGreeting()},{'\n'}
          <Text style={styles.greetingName}>{user?.firstName || 'Amigo'}!</Text>
        </Text>
        {archetype && (
          <View style={styles.archetypeBadge}>
            <Text style={styles.archetypeEmoji}>{archetype.emoji}</Text>
            <Text style={styles.archetypeLabel}>{archetype.name}</Text>
          </View>
        )}
        {!assessmentDone && (
          <Text style={styles.heroSub}>Completa tu evaluación para desbloquear tu perfil completo</Text>
        )}
      </View>

      {/* ── Assessment Progress ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mis Evaluaciones</Text>

        {/* Archetype */}
        <View style={[styles.assessCard, archetypeResults ? styles.assessDone : styles.assessPending]}>
          <View style={styles.assessLeft}>
            <View style={[styles.assessIcon, { backgroundColor: archetypeResults ? COLORS.primary_pale : COLORS.surface_alt }]}>
              <Text style={styles.assessIconText}>🎭</Text>
            </View>
            <View style={styles.assessInfo}>
              <Text style={styles.assessName}>Arquetipo Personal</Text>
              <Text style={[styles.assessStatus, { color: archetypeResults ? COLORS.primary : COLORS.text_tertiary }]}>
                {archetypeResults ? `${archetype?.name || 'Completado'} ${archetype?.emoji || '✓'}` : savedArchetype ? `En progreso · pregunta ${savedArchetype.question + 1}/7` : 'Sin comenzar · 7 preguntas'}
              </Text>
            </View>
          </View>
          {!archetypeResults && (
            <TouchableOpacity
              style={[styles.assessBtn, { backgroundColor: COLORS.primary }]}
              onPress={() => navigation.navigate('ArchetypeQuiz')}
              activeOpacity={0.8}
            >
              <Text style={styles.assessBtnText}>{savedArchetype ? 'Continuar' : 'Iniciar'}</Text>
            </TouchableOpacity>
          )}
          {archetypeResults && (
            <View style={[styles.assessCheck, { backgroundColor: COLORS.primary_pale }]}>
              <Text style={{ color: COLORS.primary, fontWeight: '800' }}>✓</Text>
            </View>
          )}
        </View>

        {/* EI Assessment */}
        <View style={[styles.assessCard, eiResults ? styles.assessDone : styles.assessPending]}>
          <View style={styles.assessLeft}>
            <View style={[styles.assessIcon, { backgroundColor: eiResults ? COLORS.purple_light : COLORS.surface_alt }]}>
              <Text style={styles.assessIconText}>🧠</Text>
            </View>
            <View style={styles.assessInfo}>
              <Text style={styles.assessName}>Inteligencia Emocional</Text>
              <Text style={[styles.assessStatus, { color: eiResults ? COLORS.purple : COLORS.text_tertiary }]}>
                {eiResults ? `Completado ✓` : savedEI ? `En progreso · pregunta ${savedEI.question + 1}/16` : archetypeResults ? 'Listo para comenzar · 16 preguntas' : 'Completa el arquetipo primero'}
              </Text>
            </View>
          </View>
          {!eiResults && archetypeResults && (
            <TouchableOpacity
              style={[styles.assessBtn, { backgroundColor: COLORS.purple }]}
              onPress={() => navigation.navigate('EIAssessment')}
              activeOpacity={0.8}
            >
              <Text style={styles.assessBtnText}>{savedEI ? 'Continuar' : 'Iniciar'}</Text>
            </TouchableOpacity>
          )}
          {eiResults && (
            <View style={[styles.assessCheck, { backgroundColor: COLORS.purple_light }]}>
              <Text style={{ color: COLORS.purple, fontWeight: '800' }}>✓</Text>
            </View>
          )}
        </View>
      </View>

      {/* ── IE Score Summary (only when done) ── */}
      {eiResults && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mi Perfil Emocional</Text>
          <View style={styles.scoreRow}>
            <View style={[styles.scoreCard, { borderTopColor: scoreColor(eiResults.autoconciencia) }]}>
              <Text style={styles.scoreCardLabel}>Autoconciencia</Text>
              <Text style={[styles.scoreCardValue, { color: scoreColor(eiResults.autoconciencia) }]}>
                {eiResults.autoconciencia ?? '—'}
              </Text>
              <View style={[styles.scorePill, { backgroundColor: scoreColor(eiResults.autoconciencia) + '22' }]}>
                <Text style={[styles.scorePillText, { color: scoreColor(eiResults.autoconciencia) }]}>
                  {scoreLabel(eiResults.autoconciencia)}
                </Text>
              </View>
            </View>
            <View style={[styles.scoreCard, { borderTopColor: scoreColor(eiResults.autogestion) }]}>
              <Text style={styles.scoreCardLabel}>Autogestión</Text>
              <Text style={[styles.scoreCardValue, { color: scoreColor(eiResults.autogestion) }]}>
                {eiResults.autogestion ?? '—'}
              </Text>
              <View style={[styles.scorePill, { backgroundColor: scoreColor(eiResults.autogestion) + '22' }]}>
                <Text style={[styles.scorePillText, { color: scoreColor(eiResults.autogestion) }]}>
                  {scoreLabel(eiResults.autogestion)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* ── Last Activity ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Última Actividad</Text>
        {profileLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={COLORS.primary} />
          </View>
        ) : lastTool ? (
          <TouchableOpacity
            style={styles.activityCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate?.('HomeTab')}
          >
            <View style={[styles.activityEmoji, { backgroundColor: COLORS.primary_pale }]}>
              <Text style={{ fontSize: 26 }}>{lastTool.emoji}</Text>
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>{lastTool.name}</Text>
              <Text style={styles.activityMeta}>
                {formatRelativeDate(toolStats?.lastUsedAt) || 'Reciente'} · {toolStats?.totalSessions ?? 0} sesiones en total
              </Text>
            </View>
            <Text style={styles.activityArrow}>›</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyActivity}>
            <Text style={styles.emptyActivityEmoji}>🌱</Text>
            <Text style={styles.emptyActivityText}>
              Aún no has usado ninguna herramienta.{'\n'}¡Empieza hoy tu primer ejercicio!
            </Text>
          </View>
        )}
      </View>

      {/* ── Quick Stats ── */}
      {toolStats && (
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: COLORS.primary_pale }]}>
            <Text style={[styles.statValue, { color: COLORS.primary }]}>{toolStats.totalSessions ?? 0}</Text>
            <Text style={styles.statLabel}>Sesiones</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: COLORS.secondary_light }]}>
            <Text style={[styles.statValue, { color: COLORS.secondary }]}>{toolStats.totalMinutes ?? 0}</Text>
            <Text style={styles.statLabel}>Minutos</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: COLORS.accent_light }]}>
            <Text style={[styles.statValue, { color: COLORS.accent }]}>{toolStats.streak ?? 0}</Text>
            <Text style={styles.statLabel}>Racha (días)</Text>
          </View>
        </View>
      )}

      {/* ── CTA ── */}
      {assessmentDone && (
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate?.('HomeTab')}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>🛠️  Explorar Herramientas</Text>
        </TouchableOpacity>
      )}

      {/* ── Usage Guide Footer ── */}
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

  // Hero
  hero: {
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxl + SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: SPACING.xl,
    overflow: 'hidden',
    ...SHADOWS.colored,
  },
  heroOverlay: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  greeting: {
    fontSize: 22,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '400',
    lineHeight: 32,
  },
  greetingName: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text_inverse,
  },
  archetypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.md,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
  },
  archetypeEmoji: {
    fontSize: 18,
  },
  archetypeLabel: {
    ...TYPOGRAPHY.body_medium,
    fontWeight: '700',
    color: COLORS.text_inverse,
  },
  heroSub: {
    ...TYPOGRAPHY.body_small,
    color: 'rgba(255,255,255,0.7)',
    marginTop: SPACING.sm,
  },

  // Sections
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.heading4,
    color: COLORS.text_primary,
    marginBottom: SPACING.md,
  },

  // Assessment Cards
  assessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    ...SHADOWS.sm,
  },
  assessDone: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  assessPending: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
  },
  assessLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  assessIcon: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assessIconText: {
    fontSize: 22,
  },
  assessInfo: {
    flex: 1,
  },
  assessName: {
    ...TYPOGRAPHY.body_medium,
    fontWeight: '700',
    color: COLORS.text_primary,
  },
  assessStatus: {
    ...TYPOGRAPHY.body_small,
    marginTop: 2,
  },
  assessBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
  },
  assessBtnText: {
    ...TYPOGRAPHY.label,
    fontWeight: '700',
    color: COLORS.text_inverse,
  },
  assessCheck: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Score Cards
  scoreRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    borderTopWidth: 4,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  scoreCardLabel: {
    ...TYPOGRAPHY.body_small,
    color: COLORS.text_secondary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  scoreCardValue: {
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 42,
  },
  scorePill: {
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.round,
  },
  scorePillText: {
    ...TYPOGRAPHY.label,
    fontWeight: '800',
    fontSize: 10,
  },

  // Last Activity
  loadingBox: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
    ...SHADOWS.sm,
  },
  activityEmoji: {
    width: 54,
    height: 54,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    ...TYPOGRAPHY.body_large,
    fontWeight: '700',
    color: COLORS.text_primary,
  },
  activityMeta: {
    ...TYPOGRAPHY.body_small,
    color: COLORS.text_secondary,
    marginTop: 2,
  },
  activityArrow: {
    fontSize: 24,
    color: COLORS.text_tertiary,
    fontWeight: '300',
  },
  emptyActivity: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  emptyActivityEmoji: {
    fontSize: 36,
    marginBottom: SPACING.sm,
  },
  emptyActivityText: {
    ...TYPOGRAPHY.body_medium,
    color: COLORS.text_secondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  statBox: {
    flex: 1,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
  },
  statLabel: {
    ...TYPOGRAPHY.body_small,
    color: COLORS.text_secondary,
    marginTop: 2,
    textAlign: 'center',
  },

  // CTA Button
  ctaButton: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.md + 4,
    alignItems: 'center',
    ...SHADOWS.colored,
  },
  ctaText: {
    ...TYPOGRAPHY.body_large,
    fontWeight: '700',
    color: COLORS.text_inverse,
  },

  // Footer
  footerSection: {
    paddingHorizontal: SPACING.lg,
  },
});

export default DashboardScreen;
