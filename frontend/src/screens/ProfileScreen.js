import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { HeadingText, BodyText, Button } from '../components/BasicComponents';
import { COLORS, SPACING } from '../config/designSystem';
import { useAuth } from '../state/AuthContext';
import { useApp } from '../state/AppContext';
import { ARCHETYPES } from '../utils/scoring';

const ProfileScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { archetypeResults, eiResults } = useApp();

  const archetype = archetypeResults ? ARCHETYPES[archetypeResults.primary] : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <HeadingText text="Tu Perfil" level={1} style={styles.title} />

      <View style={styles.section}>
        <HeadingText text="Información Personal" level={3} style={styles.sectionTitle} />
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <BodyText text="Nombre:" color={COLORS.text_secondary} />
            <BodyText text={user?.firstName || 'N/A'} />
          </View>
          <View style={styles.infoRow}>
            <BodyText text="Email:" color={COLORS.text_secondary} />
            <BodyText text={user?.email || 'N/A'} />
          </View>
        </View>
      </View>

      {archetype && (
        <View style={styles.section}>
          <HeadingText text="Tu Arquetipo" level={3} style={styles.sectionTitle} />
          <View style={styles.archetypeCard}>
            <BodyText text={archetype.emoji} style={styles.archetypeEmoji} />
            <HeadingText text={archetype.name} level={2} style={styles.archetypeName} />
            <BodyText
              text={archetype.description}
              color={COLORS.text_secondary}
              style={styles.archetypeDescription}
            />
          </View>
        </View>
      )}

      {eiResults && (
        <View style={styles.section}>
          <HeadingText text="Tu Línea Base de IE" level={3} style={styles.sectionTitle} />
          <View style={styles.scoreRow}>
            <BodyText text="Autoconciencia" />
            <BodyText text={`${Math.round(eiResults.autoconciencia)}/100`} style={styles.score} />
          </View>
          <View style={styles.scoreRow}>
            <BodyText text="Autogestión" />
            <BodyText text={`${Math.round(eiResults.autogestión)}/100`} style={styles.score} />
          </View>
        </View>
      )}

      <View style={styles.section}>
        <HeadingText text="Opciones" level={3} style={styles.sectionTitle} />
        <Button
          text="Ver Ayuda"
          variant="secondary"
          onPress={() => navigation.navigate('Help')}
          style={styles.button}
        />
        <Button
          text="Ir a Configuración"
          variant="secondary"
          onPress={() => navigation.navigate('Settings')}
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
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  archetypeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  archetypeEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  archetypeName: {
    marginBottom: SPACING.md,
  },
  archetypeDescription: {
    textAlign: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  score: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  button: {
    marginBottom: SPACING.md,
  },
});

export default ProfileScreen;
