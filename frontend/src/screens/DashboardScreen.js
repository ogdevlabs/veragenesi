import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../config/designSystem';
import { useAuth } from '../state/AuthContext';
import { useApp } from '../state/AppContext';
import { ARCHETYPES, TOOLS } from '../utils/scoring';
import UsageGuideFooter from '../components/UsageGuideFooter';
import { storage } from '../services/storageService';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ARCHETYPE_KEY = '@vera_archetype_progress';
const EI_KEY = '@vera_ei_progress';

// ── Collapsible Section ──────────────────────────────────────────────────────
const CollapsibleSection = ({ title, children, defaultExpanded = true }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  };

  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.sectionHeader} onPress={toggle} activeOpacity={0.7}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionChevron}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {expanded && <View style={styles.sectionBody}>{children}</View>}
    </View>
  );
};

// ── Screen ───────────────────────────────────────────────────────────────────
const DashboardScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { archetypeResults, eiResults, toolStats, loadUserProfile, lang, setLang } = useApp();
  const [savedArchetype, setSavedArchetype] = useState(null);
  const [savedEI, setSavedEI] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const insets = useSafeAreaInsets();

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

  const navigateTo = (screen) => {
    setMenuOpen(false);
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 88 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Header ── */}
        <View style={[styles.hero, { paddingTop: insets.top + SPACING.lg }]}>
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
            <Text style={styles.heroSub}>
              Completa tu evaluación para desbloquear tu perfil completo
            </Text>
          )}

          {/* ── Sign Out — red, below greeting ── */}
          <TouchableOpacity onPress={logout} style={styles.signOutBtn} activeOpacity={0.8}>
            <Text style={styles.signOutText}>
              ⏻  {lang === 'en' ? 'Sign Out' : 'Cerrar Sesión'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Mis Evaluaciones ── */}
        <CollapsibleSection title={lang === 'en' ? 'My Assessments' : 'Mis Evaluaciones'}>
          <View style={[styles.assessCard, archetypeResults ? styles.assessDone : styles.assessPending]}>
            <View style={styles.assessLeft}>
              <View style={[styles.assessIcon, { backgroundColor: archetypeResults ? COLORS.primary_pale : COLORS.surface_alt }]}>
                <Text style={styles.assessIconText}>🎭</Text>
              </View>
              <View style={styles.assessInfo}>
                <Text style={styles.assessName}>Arquetipo Personal</Text>
                <Text style={[styles.assessStatus, { color: archetypeResults ? COLORS.primary : COLORS.text_tertiary }]}>
                  {archetypeResults
                    ? `${archetype?.name || 'Completado'} ${archetype?.emoji || '✓'}`
                    : savedArchetype
                    ? `En progreso · pregunta ${savedArchetype.question + 1}/7`
                    : 'Sin comenzar · 7 preguntas'}
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

          <View style={[styles.assessCard, eiResults ? styles.assessDone : styles.assessPending]}>
            <View style={styles.assessLeft}>
              <View style={[styles.assessIcon, { backgroundColor: eiResults ? COLORS.purple_light : COLORS.surface_alt }]}>
                <Text style={styles.assessIconText}>🧠</Text>
              </View>
              <View style={styles.assessInfo}>
                <Text style={styles.assessName}>Inteligencia Emocional</Text>
                <Text style={[styles.assessStatus, { color: eiResults ? COLORS.purple : COLORS.text_tertiary }]}>
                  {eiResults
                    ? 'Completado ✓'
                    : savedEI
                    ? `En progreso · pregunta ${savedEI.question + 1}/16`
                    : archetypeResults
                    ? 'Listo para comenzar · 16 preguntas'
                    : 'Completa el arquetipo primero'}
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
        </CollapsibleSection>

        {/* ── Perfil Emocional ── */}
        {eiResults && (
          <CollapsibleSection title={lang === 'en' ? 'Emotional Profile' : 'Mi Perfil Emocional'}>
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
          </CollapsibleSection>
        )}

        {/* ── Última Actividad ── */}
        <CollapsibleSection title={lang === 'en' ? 'Last Activity' : 'Última Actividad'}>
          {profileLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={COLORS.primary} />
            </View>
          ) : lastTool ? (
            <TouchableOpacity
              style={styles.activityCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('HomeTab')}
            >
              <View style={[styles.activityEmoji, { backgroundColor: COLORS.primary_pale }]}>
                <Text style={{ fontSize: 26 }}>{lastTool.emoji}</Text>
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{lastTool.name}</Text>
                <Text style={styles.activityMeta}>
                  {formatRelativeDate(toolStats?.lastUsedAt) || 'Reciente'} ·{' '}
                  {toolStats?.totalSessions ?? 0} sesiones en total
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
        </CollapsibleSection>

        {/* ── Estadísticas ── */}
        {toolStats && (
          <CollapsibleSection
            title={lang === 'en' ? 'Stats' : 'Estadísticas'}
            defaultExpanded={false}
          >
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
          </CollapsibleSection>
        )}

        {/* ── CTA ── */}
        {assessmentDone && (
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('HomeTab')}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaText}>
              🛠️  {lang === 'en' ? 'Explore Tools' : 'Explorar Herramientas'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.footerSection}>
          <UsageGuideFooter />
        </View>
      </ScrollView>

      {/* ── Fixed Bottom Bar ── */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + SPACING.xs }]}>
        {/* Hamburger — left */}
        <TouchableOpacity
          style={styles.hamburgerBtn}
          onPress={() => setMenuOpen(true)}
          activeOpacity={0.7}
        >
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </TouchableOpacity>

        {/* Lang toggle — right */}
        <View style={styles.bottomLangRow}>
          <Text style={styles.bottomLangLabel}>{lang === 'en' ? 'EN' : 'ES'}</Text>
          <Switch
            value={lang === 'en'}
            onValueChange={(val) => setLang(val ? 'en' : 'es')}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={lang === 'en' ? COLORS.primary_dark : COLORS.text_tertiary}
          />
        </View>
      </View>

      {/* ── Hamburger Menu Sheet ── */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.menuBackdrop}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        />
        <View style={[styles.menuSheet, { paddingBottom: insets.bottom + SPACING.md }]}>
          <View style={styles.menuHandle} />
          <Text style={styles.menuBrand}>VeraGenesi</Text>

          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemActive]}
            onPress={() => setMenuOpen(false)}
            activeOpacity={0.7}
          >
            <Text style={styles.menuItemEmoji}>🏠</Text>
            <Text style={[styles.menuItemLabel, { color: COLORS.primary }]}>
              {lang === 'en' ? 'Dashboard' : 'Inicio'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo('HomeTab')}
            activeOpacity={0.7}
          >
            <Text style={styles.menuItemEmoji}>🛠️</Text>
            <Text style={styles.menuItemLabel}>{lang === 'en' ? 'Tools' : 'Herramientas'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo('ProfileTab')}
            activeOpacity={0.7}
          >
            <Text style={styles.menuItemEmoji}>👤</Text>
            <Text style={styles.menuItemLabel}>{lang === 'en' ? 'Profile' : 'Perfil'}</Text>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => { setMenuOpen(false); logout(); }}
            activeOpacity={0.7}
          >
            <Text style={styles.menuItemEmoji}>⏻</Text>
            <Text style={[styles.menuItemLabel, styles.menuSignOutLabel]}>
              {lang === 'en' ? 'Sign Out' : 'Cerrar Sesión'}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.xxl,
  },

  // Hero
  hero: {
    backgroundColor: COLORS.primary,
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

  // Sign Out button — red, below greeting
  signOutBtn: {
    marginTop: SPACING.lg,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.danger,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
  },
  signOutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  // Collapsible sections
  section: {
    marginBottom: SPACING.sm,
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.heading4,
    color: COLORS.text_primary,
  },
  sectionChevron: {
    fontSize: 10,
    color: COLORS.text_tertiary,
  },
  sectionBody: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },

  // Assessment Cards
  assessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    ...SHADOWS.sm,
  },
  assessDone: {
    backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderTopWidth: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
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
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
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
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
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
    gap: SPACING.sm,
  },
  statBox: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
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

  // CTA
  ctaButton: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
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
    marginTop: SPACING.sm,
  },

  // Fixed bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.sm,
  },
  hamburgerBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 4,
  },
  hamburgerLine: {
    height: 2,
    backgroundColor: COLORS.text_primary,
    borderRadius: 2,
  },
  bottomLangRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  bottomLangLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text_secondary,
    letterSpacing: 0.5,
  },

  // Menu sheet (bottom slide)
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  menuSheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  menuHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  menuBrand: {
    ...TYPOGRAPHY.heading3,
    color: COLORS.primary,
    marginBottom: SPACING.md,
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: 2,
  },
  menuItemActive: {
    backgroundColor: COLORS.primary_pale,
  },
  menuItemEmoji: {
    fontSize: 22,
    width: 30,
    textAlign: 'center',
  },
  menuItemLabel: {
    ...TYPOGRAPHY.body_large,
    fontWeight: '600',
    color: COLORS.text_primary,
    flex: 1,
  },
  menuSignOutLabel: {
    color: COLORS.danger,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
});

export default DashboardScreen;
