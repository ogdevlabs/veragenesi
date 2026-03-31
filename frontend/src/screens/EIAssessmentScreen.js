import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { LikertScale, ProgressBar } from '../components/FormComponents';
import { Button, HeadingText, BodyText } from '../components/BasicComponents';
import { COLORS, SPACING } from '../config/designSystem';
import { useApp } from '../state/AppContext';

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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { submitEIAssessment } = useApp();

  const handleSelect = (value) => {
    setSelectedValue(value);
  };

  const handleNext = async () => {
    if (!selectedValue) {
      Alert.alert('Error', 'Please select a value');
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
          navigation.navigate('Results');
        } else {
          Alert.alert('Error', result.error || 'Failed to submit assessment');
          setIsLoading(false);
        }
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to submit assessment');
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ProgressBar current={progress} total={EI_QUESTIONS.length} />
        <BodyText
          text={`Pregunta ${progress} de ${EI_QUESTIONS.length}`}
          size="small"
          color={COLORS.text_secondary}
          style={styles.progressText}
        />
        <BodyText
          text={question.competency}
          size="small"
          color={COLORS.primary}
          style={styles.competencyTag}
        />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
        <BodyText text={question.scenario} size="large" style={styles.scenario} />

        <LikertScale
          labels={["Muy Difícil", "Difícil", "Moderado", "Fácil", "Muy Fácil"]}
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
          text={currentQuestion === EI_QUESTIONS.length - 1 ? "Finalizar" : "Siguiente"}
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
  competencyTag: {
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: SPACING.lg,
  },
  scenario: {
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

export default EIAssessmentScreen;
