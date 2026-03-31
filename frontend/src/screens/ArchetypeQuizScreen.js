import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity, Text, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LikertScale, ProgressBar } from '../components/FormComponents';
import { Button, HeadingText, BodyText } from '../components/BasicComponents';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS } from '../config/designSystem';
import { useApp } from '../state/AppContext';

const PROGRESS_KEY = '@vera_archetype_progress';

const storage =
  Platform.OS === 'web'
    ? {
        getItem: (k) =>
          typeof window !== 'undefined' ? Promise.resolve(window.localStorage.getItem(k)) : Promise.resolve(null),
        setItem: (k, v) => {
          if (typeof window !== 'undefined') window.localStorage.setItem(k, v);
          return Promise.resolve();
        },
        removeItem: (k) => {
          if (typeof window !== 'undefined') window.localStorage.removeItem(k);
          return Promise.resolve();
        },
      }
    : AsyncStorage;

const ARCHETYPE_QUESTIONS = [
  {
    id: 1,
    question: "¿Qué te motiva más en la vida?",
    labels: ['Ayudar otros', 'Neutral', 'Medio', 'Logros', 'Aventura']
  },
  {
    id: 2,
    question: "¿Cuál es tu mayor fortaleza?",
    labels: ['Compasión', 'Neutral', 'Medio', 'Inteligencia', 'Coraje']
  },
  {
    id: 3,
    question: "¿Cómo prefieres enfrentar los desafíos?",
    labels: ['Buscando apoyo', 'Neutral', 'Medio', 'Analizando', 'Con acción']
  },
  {
    id: 4,
    question: "¿Qué tipo de trabajo te satisface más?",
    labels: ['Ayudar', 'Neutral', 'Medio', 'Crear', 'Liderar']
  },
  {
    id: 5,
    question: "¿Cuál es tu mayor miedo?",
    labels: ['No ser útil', 'Neutral', 'Medio', 'No entender', 'Fracasar']
  },
  {
    id: 6,
    question: "¿Cómo prefieres pasar tu tiempo libre?",
    labels: ['Con amigos', 'Neutral', 'Medio', 'Aprendiendo', 'Aventuras']
  },
  {
    id: 7,
    question: "¿Cómo quieres ser recordado?",
    labels: ['Generoso', 'Neutral', 'Medio', 'Sabio', 'Exitoso']
  }
];

const ArchetypeQuizScreen = ({ navigation }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { submitArchetypeQuiz } = useApp();

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
    Alert.alert(
      'Guardar progreso',
      `Has respondido ${answers.length} de ${ARCHETYPE_QUESTIONS.length} preguntas. ¿Deseas guardar tu avance y salir?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Guardar y salir',
          style: 'default',
          onPress: async () => {
            try {
              await storage.setItem(
                PROGRESS_KEY,
                JSON.stringify({ question: currentQuestion, answers, savedAt: Date.now() })
              );
            } catch {}
            navigation.goBack();
          },
        },
      ]
    );
  }, [navigation, currentQuestion, answers]);

  const handleSelect = (value) => {
    setSelectedValue(value);
  };

  const handleNext = async () => {
    if (!selectedValue) {
      Alert.alert('Error', 'Por favor selecciona una opción');
      return;
    }

    const newAnswers = [...answers, selectedValue];
    setAnswers(newAnswers);

    if (currentQuestion < ARCHETYPE_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedValue(null);
    } else {
      // Quiz complete, submit to backend
      setIsLoading(true);
      try {
        const result = await submitArchetypeQuiz(newAnswers);
        if (result.success) {
          // Clear saved progress on successful submission
          await storage.removeItem(PROGRESS_KEY);
          navigation.navigate('EIAssessment');
        } else {
          Alert.alert('Error', result.error || 'Failed to submit quiz');
          setIsLoading(false);
        }
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to submit quiz');
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

  const question = ARCHETYPE_QUESTIONS[currentQuestion];
  const progress = currentQuestion + 1;
  const pct = Math.round((answers.length / ARCHETYPE_QUESTIONS.length) * 100);

  const questionColors = [
    COLORS.primary,
    COLORS.purple,
    COLORS.teal,
    COLORS.secondary,
    COLORS.accent,
    COLORS.primary_dark,
    COLORS.purple,
  ];
  const accentColor = questionColors[currentQuestion % questionColors.length];

  return (
    <View style={styles.container}>
      {/* Progress header */}
      <View style={styles.header}>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>
            Pregunta {progress} de {ARCHETYPE_QUESTIONS.length}
          </Text>
          <View style={styles.progressRight}>
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
        <ProgressBar current={progress} total={ARCHETYPE_QUESTIONS.length} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
        {/* Question card */}
        <View style={[styles.questionCard, { borderLeftColor: accentColor }]}>
          <View style={[styles.questionNum, { backgroundColor: accentColor + '18' }]}>
            <Text style={[styles.questionNumText, { color: accentColor }]}>P{progress}</Text>
          </View>
          <HeadingText text={question.question} level={3} style={styles.question} />
        </View>

        <LikertScale
          labels={question.labels}
          value={selectedValue}
          onSelect={handleSelect}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          text="◀  Atrás"
          variant="secondary"
          onPress={handleBack}
          disabled={currentQuestion === 0}
          style={styles.footerButton}
        />
        <Button
          text={currentQuestion === ARCHETYPE_QUESTIONS.length - 1 ? 'Finalizar  ✓' : 'Siguiente  ▶'}
          onPress={handleNext}
          disabled={isLoading}
          style={[styles.footerButton, styles.nextBtn]}
        />
      </View>
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
    paddingTop: SPACING.md,
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
  progressLabel: {
    fontSize: 13,
    color: COLORS.text_secondary,
    fontWeight: '500',
  },
  progressPct: {
    fontSize: 13,
    fontWeight: '800',
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: SPACING.lg,
  },
  questionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderLeftWidth: 4,
    ...SHADOWS.sm,
  },
  questionNum: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.round,
    marginBottom: SPACING.sm,
  },
  questionNumText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  question: {
    lineHeight: 34,
    color: COLORS.text_primary,
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

export default ArchetypeQuizScreen;
