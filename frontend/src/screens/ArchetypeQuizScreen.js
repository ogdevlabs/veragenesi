import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { LikertScale, ProgressBar } from '../components/FormComponents';
import { Button, HeadingText, BodyText } from '../components/BasicComponents';
import { COLORS, SPACING } from '../config/designSystem';
import { useApp } from '../state/AppContext';

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ProgressBar current={progress} total={ARCHETYPE_QUESTIONS.length} />
        <BodyText
          text={`Pregunta ${progress} de ${ARCHETYPE_QUESTIONS.length}`}
          size="small"
          color={COLORS.text_secondary}
          style={styles.progressText}
        />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
        <HeadingText text={question.question} level={2} style={styles.question} />
        <LikertScale
          labels={question.labels}
          value={selectedValue}
          onSelect={handleSelect}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          text="Atrás"
          variant="secondary"
          onPress={handleBack}
          disabled={currentQuestion === 0}
          style={styles.footerButton}
        />
        <Button
          text={currentQuestion === ARCHETYPE_QUESTIONS.length - 1 ? "Finalizar" : "Siguiente"}
          onPress={handleNext}
          disabled={isLoading}
          style={styles.footerButton}
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
  },
  progressText: {
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: SPACING.lg,
  },
  question: {
    marginBottom: SPACING.lg,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  footerButton: {
    flex: 1,
  },
});

export default ArchetypeQuizScreen;
