import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { ArchetypeCard } from '../components/FormComponents';
import { Button, HeadingText, BodyText } from '../components/BasicComponents';
import { COLORS, SPACING } from '../config/designSystem';
import { useApp } from '../state/AppContext';
import { ARCHETYPES } from '../utils/scoring';

const ResultsScreen = ({ navigation }) => {
  const { archetypeResults, eiResults } = useApp();

  if (!archetypeResults || !eiResults) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <BodyText text="Cargando resultados..." />
      </View>
    );
  }

  // Find the primary archetype by id
  const primaryArchetype = ARCHETYPES.find(a => a.id === archetypeResults.primary.id) || 
                           ARCHETYPES.find(a => a.short_name === archetypeResults.primary.short_name);
  
  // Extract scores - handle both object and number formats
  const autoconciencia = typeof eiResults.autoconciencia === 'object' 
    ? Math.round(eiResults.autoconciencia.score)
    : Math.round(eiResults.autoconciencia);
  const autogestión = typeof eiResults.autogestional === 'object'
    ? Math.round(eiResults.autogestional.score)
    : Math.round(eiResults.autogestional);

  const getScoreColor = (score) => {
    if (score >= 70) return COLORS.success;
    if (score >= 40) return COLORS.warning;
    return COLORS.danger;
  };

  const getScoreLevel = (score) => {
    if (score >= 70) return "ALTO";
    if (score >= 40) return "MODERADO";
    return "BAJO";
  };

  const getInterpretation = (name, score) => {
    const level = getScoreLevel(score);
    if (name === "Autoconciencia") {
      if (level === "ALTO") return "Tienes excelente capacidad de reconocer tus emociones y cómo afectan tu comportamiento.";
      if (level === "MODERADO") return "Estás desarrollando capacidad de reconocer tus emociones.";
      return "Las herramientas de esta app te ayudarán a mejorar tu consciencia emocional.";
    } else {
      if (level === "ALTO") return "Tienes excelente capacidad de gestionar tus emociones y reacciones.";
      if (level === "MODERADO") return "Estás desarrollando capacidad de manejar tus emociones efectivamente.";
      return "Las herramientas de esta app te ayudarán a mejorar tu autogestión.";
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <HeadingText text="Tus Resultados" level={1} style={styles.title} />

      <View style={styles.section}>
        <HeadingText text="Tu Arquetipo Primario" level={2} style={styles.sectionTitle} />
        {primaryArchetype && (
          <ArchetypeCard
            emoji={primaryArchetype.emoji}
            name={primaryArchetype.name}
            description={primaryArchetype.description}
            strengths={primaryArchetype.strengths}
            growthAreas={primaryArchetype.growthAreas}
          />
        )}
      </View>

      <View style={styles.section}>
        <HeadingText text="Tu Línea Base de IE" level={2} style={styles.sectionTitle} />
        <BodyText text="Inteligencia Emocional" size="large" style={styles.eiSubtitle} />

        <View style={styles.scoreCardContainer}>
          <View style={styles.scoreCard}>
            <BodyText
              text="Autoconciencia"
              size="small"
              color={COLORS.text_secondary}
              style={styles.scoreName}
            />
            <View style={[styles.scoreValue, { borderColor: getScoreColor(autoconciencia) }]}>
              <BodyText
                text={`${autoconciencia}/100`}
                style={{ color: getScoreColor(autoconciencia), fontWeight: 'bold' }}
              />
            </View>
            <BodyText text={getScoreLevel(autoconciencia)} size="small" color={getScoreColor(autoconciencia)} />
            <BodyText
              text={getInterpretation("Autoconciencia", autoconciencia)}
              size="small"
              color={COLORS.text_secondary}
              style={styles.scoreInterpretation}
            />
          </View>

          <View style={styles.scoreCard}>
            <BodyText
              text="Autogestión"
              size="small"
              color={COLORS.text_secondary}
              style={styles.scoreName}
            />
            <View style={[styles.scoreValue, { borderColor: getScoreColor(autogestión) }]}>
              <BodyText
                text={`${autogestión}/100`}
                style={{ color: getScoreColor(autogestión), fontWeight: 'bold' }}
              />
            </View>
            <BodyText text={getScoreLevel(autogestión)} size="small" color={getScoreColor(autogestión)} />
            <BodyText
              text={getInterpretation("Autogestión", autogestión)}
              size="small"
              color={COLORS.text_secondary}
              style={styles.scoreInterpretation}
            />
          </View>
        </View>
      </View>

      <View style={styles.ctaSection}>
        <Button
          text="Explorar Herramientas"
          onPress={() => navigation.navigate('Home')}
          style={styles.button}
        />
        <Button
          text="Ver Plan Premium"
          variant="secondary"
          onPress={() => {}}
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
  eiSubtitle: {
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  scoreCardContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
  },
  scoreName: {
    marginBottom: SPACING.sm,
  },
  scoreValue: {
    borderWidth: 3,
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  scoreInterpretation: {
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  ctaSection: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  button: {
    marginBottom: SPACING.md,
  },
});

export default ResultsScreen;
