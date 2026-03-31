import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Animated } from 'react-native';
import { HeadingText, BodyText, Button } from '../components/BasicComponents';
import { ProgressBar } from '../components/FormComponents';
import { COLORS, SPACING } from '../config/designSystem';
import { useApp } from '../state/AppContext';

// Calm Breath Component
const CalmBreathExperience = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [breathProgress, setBreathProgress] = useState(0);
  const circleScale = new Animated.Value(1);

  const phases = [
    { name: 'Inhala', duration: 4000, instruction: 'Respira profundo por la nariz' },
    { name: 'Retén', duration: 4000, instruction: 'Mantén la respiración' },
    { name: 'Exhala', duration: 6000, instruction: 'Exhala lentamente por la boca' },
  ];

  useEffect(() => {
    if (!isAnimating) return;

    const currentPhase = phases[phase % 3];
    Animated.sequence([
      Animated.timing(circleScale, {
        toValue: phase % 3 === 0 ? 1.5 : 0.8,
        duration: currentPhase.duration,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setBreathProgress((prev) => prev + 1);
      if (phase % 3 === 2) {
        setCycleCount((prev) => {
          const next = prev + 1;
          if (next >= 5) {
            setIsAnimating(false);
            onComplete();
            return next;
          }
          return next;
        });
      }
      setPhase((prev) => prev + 1);
    });
  }, [phase, isAnimating]);

  const currentPhase = phases[phase % 3];

  if (!isAnimating) {
    return (
      <View style={styles.completedContainer}>
        <BodyText text="✓ Respiración Completada" size="large" style={styles.completed} />
        <BodyText text="Haz tomado 5 ciclos completos de respiración calmada." />
      </View>
    );
  }

  return (
    <View style={styles.experienceContainer}>
      <ProgressBar
        current={cycleCount + 1}
        total={5}
        label={`Ciclo ${cycleCount + 1} de 5`}
        style={styles.progress}
      />
      <Animated.View
        style={[
          styles.breathCircle,
          { transform: [{ scale: circleScale }] },
        ]}
      />
      <HeadingText text={currentPhase.name} level={2} style={styles.breathPhase} />
      <BodyText text={currentPhase.instruction} style={styles.breathInstruction} />
    </View>
  );
};

// Ground Yourself Component
const GroundYourselfExperience = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    {
      instruction: 'Mira alrededor...',
      prompt: 'Nombra 5 cosas que VES',
      input: 'cosas visibles',
    },
    {
      instruction: 'Toca tu entorno...',
      prompt: 'Nombra 4 cosas que TOCAS',
      input: 'texturas',
    },
    {
      instruction: 'Escucha con atención...',
      prompt: 'Nombra 3 cosas que OYES',
      input: 'sonidos',
    },
    {
      instruction: 'Usa tu olfato...',
      prompt: 'Nombra 2 cosas que HUELES',
      input: 'aromas',
    },
    {
      instruction: 'Prueba algo...',
      prompt: 'Nombra 1 cosa que SABOREAS',
      input: 'sabor',
    },
  ];

  const step = steps[currentStep];

  return (
    <View style={styles.experienceContainer}>
      <ProgressBar
        current={currentStep + 1}
        total={steps.length}
        label={`Paso ${currentStep + 1} de ${steps.length}`}
        style={styles.progress}
      />
      <HeadingText text={step.instruction} level={2} style={styles.stepTitle} />
      <BodyText text={step.prompt} style={styles.stepPrompt} />
      <View style={styles.stepInput}>
        <BodyText text="Tómate tu tiempo para observar con atención..." color={COLORS.text_secondary} />
      </View>
      <View style={styles.stepActions}>
        {currentStep > 0 && (
          <Button
            text="Anterior"
            variant="secondary"
            onPress={() => setCurrentStep((prev) => prev - 1)}
            style={styles.stepButton}
          />
        )}
        <Button
          text={currentStep === steps.length - 1 ? 'Completar' : 'Siguiente'}
          onPress={() => {
            if (currentStep === steps.length - 1) {
              onComplete();
            } else {
              setCurrentStep((prev) => prev + 1);
            }
          }}
          style={styles.stepButton}
        />
      </View>
    </View>
  );
};

// Quick Write Component
const QuickWriteExperience = ({ onComplete }) => {
  const [isWriting, setIsWriting] = useState(true);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (!isWriting) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsWriting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isWriting]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <View style={styles.experienceContainer}>
      {isWriting ? (
        <>
          <ProgressBar
            current={300 - timeLeft}
            total={300}
            label={`${minutes}:${seconds.toString().padStart(2, '0')}`}
            style={styles.progress}
          />
          <HeadingText text="Escribe sin filtro..." level={2} style={styles.writeTitle} />
          <View style={styles.writeBox}>
            <BodyText
              text="Aquí es donde escribes tus pensamientos, emociones, preocupaciones...
              
Sin filtro. Sin juicio. Solo escribir."
              color={COLORS.text_secondary}
              style={styles.writeHelper}
            />
          </View>
          <BodyText
            text="En una aplicación completa, este sería un campo de texto interactivo."
            size="small"
            color={COLORS.text_secondary}
            style={styles.writePlaceholder}
          />
        </>
      ) : (
        <>
          <BodyText text="✓ Escritura Completada" size="large" style={styles.completed} />
          <BodyText text="Tomaste 5 minutos para reflexionar y procesar tus emociones." />
          <Button
            text="Finalizar"
            onPress={onComplete}
            style={styles.doneButton}
          />
        </>
      )}
    </View>
  );
};

// Crisis Help Component
const CrisisHelpExperience = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: 'Estás seguro',
      content: 'Respira. Estás en un lugar seguro en este momento. Lo que sientes es válido.',
    },
    {
      title: 'Técnicas de Contención',
      content: 'Coloca tus pies firmemente en el suelo. Siente el peso de tu cuerpo. Nombra 5 cosas que ves.',
    },
    {
      title: 'Contacta Apoyo',
      content: 'Si necesitas hablar, llama a un amigo de confianza, familia o línea de crisis.',
    },
    {
      title: 'Recursos Disponibles',
      content: 'Línea de Crisis: XXX-XXX-XXXX\nCounseling en línea disponible 24/7',
    },
  ];

  const currentStep = steps[step];

  return (
    <View style={styles.experienceContainer}>
      <ProgressBar
        current={step + 1}
        total={steps.length}
        label={`Paso ${step + 1} de ${steps.length}`}
        style={styles.progress}
      />
      <HeadingText text={currentStep.title} level={2} style={styles.crisisTitle} />
      <View style={styles.crisisContent}>
        <BodyText text={currentStep.content} style={styles.crisisText} />
      </View>
      <View style={styles.crisisActions}>
        {step > 0 && (
          <Button
            text="Anterior"
            variant="secondary"
            onPress={() => setStep((prev) => prev - 1)}
            style={styles.stepButton}
          />
        )}
        <Button
          text={step === steps.length - 1 ? 'Entendido' : 'Siguiente'}
          onPress={() => {
            if (step === steps.length - 1) {
              onComplete();
            } else {
              setStep((prev) => prev + 1);
            }
          }}
          style={styles.stepButton}
        />
      </View>
    </View>
  );
};

// Pause + Reflect Component
const PauseReflectExperience = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  const phases = [
    {
      title: 'Pausa',
      instruction: 'Tómate 30 segundos para simplemente respirar...',
      duration: 30,
    },
    {
      title: 'Observa',
      instruction: '¿Cómo te sientes en este momento? ¿Qué emociones están presentes?',
      duration: 30,
    },
    {
      title: 'Reflexiona',
      instruction: '¿Qué está sucediendo? ¿Qué necesitas en este momento?',
      duration: 30,
    },
    {
      title: 'Actúa',
      instruction: 'Con compasión propia, elige tu siguiente paso.',
      duration: 30,
    },
  ];

  const [timeLeft, setTimeLeft] = useState(phases[0].duration);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (phase < phases.length - 1) {
            setPhase((p) => p + 1);
            return phases[phase + 1].duration;
          } else {
            onComplete();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  const currentPhase = phases[phase];

  return (
    <View style={styles.experienceContainer}>
      <ProgressBar
        current={phase + 1}
        total={phases.length}
        label={`${currentPhase.title} - ${timeLeft}s`}
        style={styles.progress}
      />
      <HeadingText text={currentPhase.title} level={2} style={styles.phaseTitle} />
      <BodyText text={currentPhase.instruction} style={styles.phaseInstruction} />
    </View>
  );
};

// Main ToolExecution Screen
const ToolExecutionScreen = ({ route, navigation }) => {
  const { tool } = route.params;
  const [isComplete, setIsComplete] = useState(false);
  const { recordToolUsage } = useApp();

  const handleComplete = async () => {
    setIsComplete(true);
    await recordToolUsage(tool.id);
  };

  const renderExperience = () => {
    switch (tool.id) {
      case 'calm_breath':
        return <CalmBreathExperience onComplete={handleComplete} />;
      case 'ground_yourself':
        return <GroundYourselfExperience onComplete={handleComplete} />;
      case 'quick_write':
        return <QuickWriteExperience onComplete={handleComplete} />;
      case 'crisis_help':
        return <CrisisHelpExperience onComplete={handleComplete} />;
      case 'pause_reflect':
        return <PauseReflectExperience onComplete={handleComplete} />;
      default:
        return <View />;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerBar}>
        <BodyText text={tool.emoji} style={styles.toolEmoji} />
        <HeadingText text={tool.name} level={2} style={styles.toolName} />
      </View>

      {renderExperience()}

      {isComplete && (
        <View style={styles.completionContainer}>
          <Button
            text="Volver al Inicio"
            onPress={() => navigation.navigate('Home')}
            style={styles.finishButton}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBar: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  toolEmoji: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  toolName: {
    textAlign: 'center',
  },
  experienceContainer: {
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  progress: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  breathCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.primary,
    marginVertical: SPACING.xl,
    opacity: 0.7,
  },
  breathPhase: {
    marginVertical: SPACING.md,
  },
  breathInstruction: {
    textAlign: 'center',
    fontSize: 16,
  },
  stepTitle: {
    marginVertical: SPACING.md,
  },
  stepPrompt: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: SPACING.md,
  },
  stepInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SPACING.lg,
    marginVertical: SPACING.lg,
    minHeight: 100,
    justifyContent: 'center',
  },
  stepActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    width: '100%',
    marginTop: SPACING.lg,
  },
  stepButton: {
    flex: 1,
  },
  writeTitle: {
    marginVertical: SPACING.md,
  },
  writeBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SPACING.lg,
    marginVertical: SPACING.lg,
    minHeight: 200,
  },
  writeHelper: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  writePlaceholder: {
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  crisisTitle: {
    marginVertical: SPACING.md,
    color: COLORS.danger,
  },
  crisisContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    padding: SPACING.lg,
    marginVertical: SPACING.lg,
  },
  crisisText: {
    fontSize: 16,
    lineHeight: 24,
  },
  crisisActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    width: '100%',
    marginTop: SPACING.lg,
  },
  phaseTitle: {
    marginVertical: SPACING.md,
  },
  phaseInstruction: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: SPACING.lg,
  },
  completed: {
    color: COLORS.success,
    marginVertical: SPACING.md,
  },
  completedContainer: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  completionContainer: {
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  finishButton: {
    marginTop: SPACING.lg,
  },
  doneButton: {
    marginTop: SPACING.lg,
  },
});

export default ToolExecutionScreen;
