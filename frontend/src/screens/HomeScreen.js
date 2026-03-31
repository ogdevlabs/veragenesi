import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import { HeadingText, BodyText, Button } from '../components/BasicComponents';
import { QuickToolCard } from '../components/FormComponents';
import { COLORS, SPACING } from '../config/designSystem';
import { useAuth } from '../state/AuthContext';
import { useApp } from '../state/AppContext';
import { TOOLS, ARCHETYPES } from '../utils/scoring';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { archetypeResults } = useApp();
  const [currentMood, setCurrentMood] = useState(5);

  const archetype = archetypeResults && ARCHETYPES[archetypeResults.primary];
  const moodEmojis = ['😢', '😟', '😕', '😐', '😌', '🙂', '😊', '😄', '😄', '😍', '🥳'];
  const moodLabels = ['Muy Triste', 'Triste', 'Preocupado', 'Neutral', 'Calmo', 'Bien', 'Feliz', 'Muy Feliz', 'Alegre', 'Enamorado', 'Eufórico'];

  const getMoodColor = (mood) => {
    if (mood <= 2) return COLORS.danger;
    if (mood <= 4) return COLORS.warning;
    if (mood <= 7) return COLORS.success;
    return COLORS.primary;
  };

  const handleToolPress = (tool) => {
    navigation.navigate('ToolDetail', { tool });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <HeadingText
          text={`¡Hola, ${user?.firstName || 'Amigo'}!`}
          level={1}
          style={styles.greeting}
        />
        {archetype && (
          <BodyText
            text={`Tu arquetipo: ${archetype.emoji} ${archetype.name}`}
            color={COLORS.text_secondary}
            size="small"
          />
        )}
      </View>

      <View style={styles.section}>
        <HeadingText text="¿Cómo te sientes?" level={3} style={styles.sectionTitle} />
        <BodyText
          text={`${moodEmojis[currentMood]} ${moodLabels[currentMood]}`}
          style={styles.moodDisplay}
        />
        <View style={styles.moodScale}>
          {[...Array(11)].map((_, i) => (
            <Button
              key={i}
              text={i.toString()}
              variant={currentMood === i ? 'primary' : 'secondary'}
              onPress={() => setCurrentMood(i)}
              style={styles.moodButton}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <HeadingText text="Herramientas Disponibles" level={3} style={styles.sectionTitle} />
        <FlatList
          data={TOOLS}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.toolGrid}
          renderItem={({ item }) => (
            <View style={styles.toolItem}>
              <QuickToolCard
                emoji={item.emoji}
                title={item.name}
                duration={item.duration}
                description={item.description}
                onPress={() => handleToolPress(item)}
              />
            </View>
          )}
        />
      </View>

      <View style={styles.premiumSection}>
        <HeadingText text="✨ Plan Premium" level={3} />
        <BodyText
          text="Acceso a herramientas avanzadas, seguimiento de progreso y análisis de tendencias."
          color={COLORS.text_secondary}
          style={styles.premiumText}
        />
        <Button
          text="Explorar Premium"
          onPress={() => {}}
          style={styles.premiumButton}
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
    marginBottom: SPACING.xl,
  },
  greeting: {
    marginBottom: SPACING.xs,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  moodDisplay: {
    textAlign: 'center',
    fontSize: 32,
    marginBottom: SPACING.lg,
  },
  moodScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.xs,
  },
  moodButton: {
    flex: 1,
  },
  toolGrid: {
    gap: SPACING.md,
    justifyContent: 'space-between',
  },
  toolItem: {
    width: '48%',
    marginBottom: SPACING.md,
  },
  premiumSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  premiumText: {
    marginVertical: SPACING.md,
  },
  premiumButton: {
    marginTop: SPACING.md,
  },
});

export default HomeScreen;
