import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Switch, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LikertScale, ProgressBar } from '../components/FormComponents';
import { Button, HeadingText, BodyText } from '../components/BasicComponents';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS } from '../config/designSystem';
import { useApp } from '../state/AppContext';
import { storage } from '../services/storageService';

const PROGRESS_KEY = '@vera_ei_progress';

const EI_QUESTIONS = [
  // Autoconciencia (Awareness) - 8 questions
  {
    id: 1,
    competency: "Autoconciencia",
    scenario: "Tu pareja te critica en una cena con amigos. ¿Qué tan bien puedes identificar exactamente qué emoción sientes en ese momento?",
  },
  {
    id: 2,
    competency: "Autoconciencia",
    scenario: "Después de un mal día en el trabajo, ¿qué tan fácil te es identificar qué situaciones específicas te molestaron?",
  },
  {
    id: 3,
    competency: "Autoconciencia",
    scenario: "¿Qué tan consciente eres de cómo tu estado emocional afecta tu comportamiento con otros?",
  },
  {
    id: 4,
    competency: "Autoconciencia",
    scenario: "¿Qué tan bien entiendes por qué reaccionas de ciertas maneras ante situaciones?",
  },
  {
    id: 5,
    competency: "Autoconciencia",
    scenario: "¿Qué tan consciente eres de cuándo tu cuerpo está bajo estrés?",
  },
  {
    id: 6,
    competency: "Autoconciencia",
    scenario: "¿Qué tan bien puedes reconocer tus patrones emocionales en diferentes contextos?",
  },
  {
    id: 7,
    competency: "Autoconciencia",
    scenario: "¿Qué tan honestos eres contigo mismo sobre tus limitaciones?",
  },
  {
    id: 8,
    competency: "Autoconciencia",
    scenario: "¿Qué tan fácil te es reconocer dónde necesitas crecer?",
  },
  // Autogestión (Self-Management) - 8 questions
  {
    id: 9,
    competency: "Autogestión",
    scenario: "Cuando tienes una discusión fuerte, ¿Qué tan bien puedes manejar tus impulsos para no decir cosas de las que te arrepentirás?",
  },
  {
    id: 10,
    competency: "Autogestión",
    scenario: "¿Qué tan fácil te es calmar tus emociones después de una situación estresante?",
  },
  {
    id: 11,
    competency: "Autogestión",
    scenario: "Cuando enfrentas un obstáculo, ¿qué tan bien mantienes la compostura?",
  },
  {
    id: 12,
    competency: "Autogestión",
    scenario: "¿Qué tan adaptable eres ante cambios inesperados?",
  },
  {
    id: 13,
    competency: "Autogestión",
    scenario: "¿Qué tan bien puedes motivarte a ti mismo para alcanzar tus metas?",
  },
  {
    id: 14,
    competency: "Autogestión",
    scenario: "¿Qué tan bien estableces límites saludables en tus relaciones?",
  },
  {
    id: 15,
    competency: "Autogestión",
    scenario: "¿Qué tan bien comunicas tus límites sin herir los sentimientos de otros?",
  },
  {
    id: 16,
    competency: "Autogestión",
    scenario: "Después de una decepción, ¿qué tan rápido recuperas tu bienestar emocional?",
  }
];

const EIAssessmentScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const { submitEIAssessment, lang, setLang } = useApp();

  // Load saved progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const saved = await storage.getItem(PROGRESS_KEY);
        if (saved) {
          const { question, answers: savedAnswers } = JSON.parse(saved);
          setCurrentQuestion(question);
          setAnswers(savedAnswers);
          setSelectedValue(savedAnswers[question] ?? null);
        }
      } catch {}
    };
    loadProgress();
  }, []);

  const handleSaveAndExit = useCallback(() => {
    setShowExitConfirm(true);
  }, []);

  const confirmSaveAndExit = useCallback(async () => {
    try {
      await storage.setItem(
        PROGRESS_KEY,
        JSON.stringify({ question: currentQuestion, answers, savedAt: Date.now() })
      );
    } catch {}
    navigation.navigate('Onboarding');
  }, [navigation, currentQuestion, answers]);

  const handleSelect = (value) => {
    setSelectedValue(value);
    setShowExitConfirm(false);
  };

  const handleNext = async () => {
    if (!selectedValue) {
      return;
      return;
    }

    const newAnswers = [...answers, selectedValue];
    setAnswers(newAnswers);

    if (currentQuestion < EI_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedValue(null);
    } else {
      // Assessment complete, submit to backend
      setIsLoading(true);
      try {
        const result = await submitEIAssessment(newAnswers);
        if (result.success) {
          await storage.removeItem(PROGRESS_KEY);
          navigation.navigate('Results');
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const prevAnswers = answers.slice(0, -1);
      setAnswers(prevAnswers);
      setSelectedValue(prevAnswers[currentQuestion - 1] || null);
    }
  };

  const question = EI_QUESTIONS[currentQuestion];
  const progress = currentQuestion + 1;
  const pct = Math.round((answers.length / EI_QUESTIONS.length) * 100);
  const isAutoconciencia = question.competency === 'Autoconciencia';
  const accentColor = isAutoconciencia ? COLORS.primary : COLORS.purple;
  const accentBg = isAutoconciencia ? COLORS.primary_pale : COLORS.purple_light;

  return (
    <View style={styles.container}>
      {/* Progress header */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
        <View style={styles.progressRow}>
          <View style={[styles.competencyPill, { backgroundColor: accentBg }]}>
            <Text style={[styles.competencyText, { color: accentColor }]}>
              {isAutoconciencia ? '🪞' : '⚡'} {question.competency}
            </Text>
          </View>
          <View style={styles.progressRight}>
            <Text style={styles.langLabel}>{lang === 'en' ? 'EN' : 'ES'}</Text>
            <Switch
              value={lang === 'en'}
              onValueChange={(val) => setLang(val ? 'en' : 'es')}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={lang === 'en' ? COLORS.primary_dark : COLORS.text_tertiary}
            />
            <Text style={[styles.progressPct, { color: accentColor }]}>{pct}%</Text>
            <TouchableOpacity
              onPress={handleSaveAndExit}
              style={styles.exitBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.exitBtnText}>✕ Salir</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ProgressBar current={progress} total={EI_QUESTIONS.length} />
        <Text style={styles.progressLabel}>
          Pregunta {progress} de {EI_QUESTIONS.length}
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
        <View style={[styles.scenarioCard, { borderLeftColor: accentColor }]}>
          <View style={[styles.scenarioNum, { backgroundColor: accentBg }]}>
            <Text style={[styles.scenarioNumText, { color: accentColor }]}>Situación {progress}</Text>
          </View>
          <BodyText text={question.scenario} size="large" style={styles.scenario} />
        </View>

        <Text style={styles.scaleHint}>¿Qué tan fácil o difícil te resulta?</Text>
        <LikertScale
          labels={["Muy Difícil", "Difícil", "Moderado", "Fácil", "Muy Fácil"]}
          value={selectedValue}
          onSelect={handleSelect}
        />
      </ScrollView>

      {showExitConfirm ? (
        <View style={styles.confirmBar}>
          <Text style={styles.confirmText}>¿Guardar avance y salir?</Text>
          <View style={styles.confirmBtns}>
            <TouchableOpacity
              style={styles.confirmNo}
              onPress={() => setShowExitConfirm(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmNoText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmYes}
              onPress={confirmSaveAndExit}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmYesText}>Sí, guardar y salir</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.footer}>
          <Button
            text="◀  Atrás"
            variant="secondary"
            onPress={handleBack}
            disabled={currentQuestion === 0}
            style={styles.footerButton}
          />
          <Button
            text={currentQuestion === EI_QUESTIONS.length - 1 ? 'Finalizar  ✓' : 'Siguiente  ▶'}
            onPress={handleNext}
            disabled={isLoading || !selectedValue}
            style={[styles.footerButton, styles.nextBtn]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md, // overridden inline with insets
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  competencyPill: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.round,
  },
  competencyText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  progressPct: {
    fontSize: 13,
    fontWeight: '800',
  },
  progressLabel: {
    fontSize: 12,
    color: COLORS.text_tertiary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  progressRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  langLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text_secondary,
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: SPACING.lg,
  },
  scenarioCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    ...SHADOWS.sm,
  },
  scenarioNum: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.round,
    marginBottom: SPACING.sm,
  },
  scenarioNumText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scenario: {
    lineHeight: 26,
    color: COLORS.text_primary,
  },
  scaleHint: {
    fontSize: 13,
    color: COLORS.text_secondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    backgroundColor: COLORS.background,
  },
  confirmBar: {
    borderTopWidth: 1,
    borderTopColor: '#FCA5A5',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  confirmText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text_primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  confirmBtns: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  confirmNo: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  confirmNoText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text_secondary,
  },
  confirmYes: {
    flex: 2,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
  },
  confirmYesText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text_inverse,
  },
  footerButton: {
    flex: 1,
  },
  nextBtn: {
    flex: 1.6,
  },
  progressRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  exitBtn: {
    backgroundColor: '#FEE2E2',
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  exitBtnText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: '700',
  },
});

export default EIAssessmentScreen;
