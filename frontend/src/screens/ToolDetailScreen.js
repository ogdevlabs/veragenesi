import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { HeadingText, BodyText, Button } from '../components/BasicComponents';
import { COLORS, SPACING } from '../config/designSystem';

const ToolDetailScreen = ({ route, navigation }) => {
  const { tool } = route.params;

  const toolDetails = {
    calm_breath: {
      fullDescription: 'La respiración calmada es una técnica probada científicamente para reducir el estrés y la ansiedad. Mediante ciclos controlados de inhalación, retención y exhalación, activas tu sistema nervioso parasimpático.',
      benefits: [
        'Reduce cortisol (hormona del estrés)',
        'Mejora enfoque y claridad mental',
        'Disminuye presión arterial',
        'Aumenta oxígeno cerebral',
      ],
      steps: [
        '1. Inhala por 4 segundos',
        '2. Retén por 4 segundos',
        '3. Exhala por 6 segundos',
        '4. Repite 5-10 veces',
      ],
      bestFor: 'Estrés agudo, ansiedad, insomnio',
    },
    ground_yourself: {
      fullDescription: 'La técnica de enraizamiento (grounding) te ayuda a volver al presente usando tus 5 sentidos. Ideal para crisis, pánico o disociación.',
      benefits: [
        'Te trae de vuelta al presente',
        'Reduce síntomas de pánico',
        'Mejora conexión con el cuerpo',
        'Interrumpe espirales de ansiedad',
      ],
      steps: [
        'Nombra 5 cosas que ves',
        'Nombra 4 cosas que tocas',
        'Nombra 3 cosas que oyes',
        'Nombra 2 cosas que hueles',
        'Nombra 1 cosa que saboreas',
      ],
      bestFor: 'Pánico, disociación, flashbacks',
    },
    quick_write: {
      fullDescription: 'Escritura rápida sin filtro para procesar emociones, pensamientos y preocupaciones. Una herramienta poderosa de reflexión y liberación emocional.',
      benefits: [
        'Procesa emociones complejas',
        'Reduce rumiación mental',
        'Mejora autoconocimiento',
        'Libera estrés emocional',
      ],
      steps: [
        '1. Elige un tema o emoción',
        '2. Escribe sin filtro por 5 minutos',
        '3. No edites ni juzgues',
        '4. Reflexiona sobre lo escrito',
      ],
      bestFor: 'Procesamiento emocional, reflexión',
    },
    crisis_help: {
      fullDescription: 'Un protocolo rápido cuando estás en crisis o sufrimiento severo. Incluye técnicas de contención y recursos de apoyo.',
      benefits: [
        'Proporciona seguridad inmediata',
        'Ofrece recursos de ayuda',
        'Te conecta con apoyo profesional',
        'Reduce sentimientos de soledad',
      ],
      steps: [
        '1. Aplica técnicas de contención',
        '2. Contacta a alguien de confianza',
        '3. Utiliza recursos proporcionados',
        '4. Si es grave, busca ayuda profesional',
      ],
      bestFor: 'Crisis emocional, sufrimiento severo',
    },
    pause_reflect: {
      fullDescription: 'Una pausa mindful para reflexionar, reconectar contigo mismo y antes de tomar decisiones importantes.',
      benefits: [
        'Aumenta inteligencia emocional',
        'Mejora toma de decisiones',
        'Reduce reactividad emocional',
        'Fomenta compasión propia',
      ],
      steps: [
        '1. Haz una pausa de 2 minutos',
        '2. Observa tu estado emocional',
        '3. Reflexiona sobre la situación',
        '4. Elige tu siguiente acción',
      ],
      bestFor: 'Toma de decisiones, reflexión',
    },
  };

  const details = toolDetails[tool.id] || toolDetails.calm_breath;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <BodyText
          text={tool.emoji}
          style={{ fontSize: 48, textAlign: 'center', marginBottom: SPACING.md }}
        />
        <HeadingText
          text={tool.name}
          level={1}
          style={styles.title}
        />
        <BodyText
          text={`⏱️ ${tool.duration}`}
          size="small"
          color={COLORS.text_secondary}
          style={styles.duration}
        />
      </View>

      <View style={styles.section}>
        <BodyText
          text={details.fullDescription}
          style={styles.description}
        />
      </View>

      <View style={styles.section}>
        <HeadingText text="Beneficios" level={3} style={styles.sectionTitle} />
        {details.benefits.map((benefit, index) => (
          <View key={index} style={styles.listItem}>
            <BodyText text="✓" color={COLORS.success} />
            <BodyText text={benefit} style={styles.listText} />
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <HeadingText text="Pasos" level={3} style={styles.sectionTitle} />
        {details.steps.map((step, index) => (
          <View key={index} style={styles.listItem}>
            <BodyText text={`${index + 1}.`} style={styles.stepNumber} />
            <BodyText text={step} style={styles.listText} />
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <HeadingText text="Mejor para:" level={4} />
        <BodyText
          text={details.bestFor}
          color={COLORS.text_secondary}
          style={styles.bestFor}
        />
      </View>

      <View style={styles.cta}>
        <Button
          text="Comenzar Ahora"
          onPress={() => navigation.navigate('ToolExecution', { tool })}
          style={styles.button}
        />
        <Button
          text="Volver"
          variant="secondary"
          onPress={() => navigation.goBack()}
          style={styles.button}
        />
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
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  duration: {
    textAlign: 'center',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  description: {
    lineHeight: 22,
  },
  listItem: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'flex-start',
  },
  listText: {
    flex: 1,
    lineHeight: 22,
  },
  stepNumber: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  bestFor: {
    marginTop: SPACING.sm,
    fontStyle: 'italic',
  },
  cta: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  button: {
    marginBottom: SPACING.md,
  },
});

export default ToolDetailScreen;
