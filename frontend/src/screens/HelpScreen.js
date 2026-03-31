import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { HeadingText, BodyText } from '../components/BasicComponents';
import { COLORS, SPACING } from '../config/designSystem';

const HelpScreen = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: '¿Qué es VeraGenesi?',
      answer: 'VeraGenesi es una app de bienestar emocional que combina evaluaciones de personalidad con herramientas basadas en evidencia científica para mejorar tu inteligencia emocional.',
    },
    {
      id: 2,
      question: '¿Cuál es la diferencia entre los dos cuestionarios iniciales?',
      answer: 'El cuestionario de Arquetipo (7 preguntas) identifica tu perfil de personalidad primario. La evaluación de IE (16 preguntas) mide dos dimensiones clave: Autoconciencia y Autogestión.',
    },
    {
      id: 3,
      question: '¿Cuáles son las 5 herramientas disponibles?',
      answer: '1. Respiración Calmada - Técnica de respiración controlada. 2. Enraizamiento - Técnica de los 5 sentidos. 3. Escritura Rápida - Reflexión sin filtro. 4. Protocolo Crisis - Contención de emergencias emocionales. 5. Pausa+Reflejo - Mindfulness breve.',
    },
    {
      id: 4,
      question: '¿Con qué frecuencia debo usar las herramientas?',
      answer: 'Recomendamos usar al menos una herramienta diariamente. Las herramientas están diseñadas para ser rápidas (3-5 minutos) y pueden usarse múltiples veces al día según necesites.',
    },
    {
      id: 5,
      question: '¿Mis datos están seguros?',
      answer: 'Sí. Utilizamos encriptación de extremo a extremo y cumplimos con GDPR. Tus datos nunca se venden a terceros y permanecen bajo tu control.',
    },
    {
      id: 6,
      question: '¿Puedo usar VeraGenesi sin conexión a internet?',
      answer: 'Sí, las herramientas funcionan sin conexión. Tus datos se sincronizarán automáticamente cuando recuperes conexión.',
    },
    {
      id: 7,
      question: '¿Qué es el Plan Premium?',
      answer: 'El plan premium ofrece acceso a análisis avanzados de tendencias, herramientas adicionales, sesiones guiadas y coaching personalizado basado en tu arquetipo.',
    },
    {
      id: 8,
      question: '¿Cómo contacto soporte?',
      answer: 'Puedes contactar a nuestro equipo de soporte a través de: Email: support@veragenesi.com | Chat: disponible 24/7 en la app. Tiempo de respuesta típico: 2 horas.',
    },
  ];

  const FaqItem = ({ item }) => {
    const isExpanded = expandedFaq === item.id;

    return (
      <TouchableOpacity
        style={[styles.faqItem, isExpanded && styles.faqItemExpanded]}
        onPress={() => setExpandedFaq(isExpanded ? null : item.id)}
      >
        <View style={styles.faqQuestion}>
          <HeadingText text={item.question} level={4} style={styles.questionText} />
          <BodyText text={isExpanded ? '−' : '+'} style={styles.expandIcon} />
        </View>
        {isExpanded && (
          <View style={styles.faqAnswer}>
            <BodyText text={item.answer} color={COLORS.text_secondary} style={styles.answerText} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <HeadingText text="Centro de Ayuda" level={1} style={styles.title} />

      <View style={styles.section}>
        <HeadingText text="Primeros Pasos" level={3} style={styles.sectionTitle} />
        <View style={styles.stepsCard}>
          <View style={styles.stepItem}>
            <BodyText text="1" style={styles.stepNumber} />
            <View style={styles.stepContent}>
              <BodyText text="Completa los Cuestionarios" style={styles.stepTitle} />
              <BodyText
                text="Responde el cuestionario de Arquetipo (7Q) y la evaluación de IE (16Q) para obtener tu línea base."
                size="small"
                color={COLORS.text_secondary}
              />
            </View>
          </View>

          <View style={styles.stepItem}>
            <BodyText text="2" style={styles.stepNumber} />
            <View style={styles.stepContent}>
              <BodyText text="Visualiza Resultados" style={styles.stepTitle} />
              <BodyText
                text="Revisa tu perfil de arquetipo y tus puntuaciones iniciales de IE."
                size="small"
                color={COLORS.text_secondary}
              />
            </View>
          </View>

          <View style={styles.stepItem}>
            <BodyText text="3" style={styles.stepNumber} />
            <View style={styles.stepContent}>
              <BodyText text="Explora Herramientas" style={styles.stepTitle} />
              <BodyText
                text="Prueba cada una de las 5 herramientas según tus necesidades emocionales."
                size="small"
                color={COLORS.text_secondary}
              />
            </View>
          </View>

          <View style={styles.stepItem}>
            <BodyText text="4" style={styles.stepNumber} />
            <View style={styles.stepContent}>
              <BodyText text="Hazte Premium" style={styles.stepTitle} />
              <BodyText
                text="Desbloquea análisis avanzados y coaching personalizado."
                size="small"
                color={COLORS.text_secondary}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <HeadingText text="Preguntas Frecuentes" level={3} style={styles.sectionTitle} />
        {faqs.map((faq) => (
          <FaqItem key={faq.id} item={faq} />
        ))}
      </View>

      <View style={styles.contactSection}>
        <HeadingText text="¿Necesitas más ayuda?" level={3} />
        <BodyText
          text="Contacta a nuestro equipo de soporte"
          color={COLORS.text_secondary}
          style={styles.contactText}
        />
        <BodyText
          text="support@veragenesi.com"
          style={styles.contactEmail}
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
  title: {
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  stepsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
  },
  stepItem: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    color: COLORS.surface,
    textAlign: 'center',
    lineHeight: 30,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  faqItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  faqItemExpanded: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: SPACING.lg,
  },
  questionText: {
    flex: 1,
    marginRight: SPACING.md,
  },
  expandIcon: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  faqAnswer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  answerText: {
    lineHeight: 22,
  },
  contactSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  contactText: {
    textAlign: 'center',
    marginVertical: SPACING.md,
  },
  contactEmail: {
    color: COLORS.primary,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default HelpScreen;
