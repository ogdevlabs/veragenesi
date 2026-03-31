import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Switch } from 'react-native';
import { Button, HeadingText, BodyText } from '../components/BasicComponents';
import { COLORS, SPACING } from '../config/designSystem';

const WelcomeScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Brand */}
        <View style={styles.header}>
          <HeadingText text="VeraGenesi" level={1} />
          <BodyText text="Entiende tu mundo emocional" style={styles.subtitle} />
        </View>

        {/* Hero text */}
        <View style={styles.heroSection}>
          <BodyText
            text="Herramientas prácticas de autocuidado en tu bolsillo"
            size="large"
            style={styles.heroText}
          />
        </View>

        {/* Benefits */}
        <View style={styles.benefitsSection}>
          <BenefitItem
            emoji="🧠"
            title="Evaluación de tu IE"
            description="Comprende tu inteligencia emocional"
          />
          <BenefitItem
            emoji="🌿"
            title="Herramientas prácticas"
            description="Acceso inmediato a herramientas de autocuidado"
          />
          <BenefitItem
            emoji="✨"
            title="Planes personalizados"
            description="Guía diseñada para tu arquetipo"
          />
        </View>

        {/* Notifications opt-in */}
        <View style={styles.notificationsSection}>
          <View style={styles.notificationToggle}>
            <BodyText text="Recibir notificaciones" />
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={notificationsEnabled ? COLORS.primary : COLORS.text_tertiary}
            />
          </View>
        </View>

        {/* Privacy disclaimer */}
        <BodyText
          text="Al continuar, aceptas nuestras Términos de Servicio y Política de Privacidad"
          size="small"
          color={COLORS.text_tertiary}
          style={styles.disclaimer}
        />

        {/* CTA Button */}
        <Button
          text="Comenzar"
          onPress={() => navigation.navigate('Login')}
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};

const BenefitItem = ({ emoji, title, description }) => (
  <View style={styles.benefitItem}>
    <BodyText text={emoji} size="large" />
    <View>
      <BodyText text={title} style={styles.benefitTitle} />
      <BodyText
        text={description}
        size="small"
        color={COLORS.text_secondary}
        style={styles.benefitDescription}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: SPACING.sm,
    color: COLORS.text_secondary,
  },
  heroSection: {
    marginBottom: SPACING.xl,
  },
  heroText: {
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  benefitsSection: {
    marginBottom: SPACING.xl,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  benefitTitle: {
    fontWeight: '600',
    marginLeft: SPACING.md,
    marginBottom: SPACING.xs,
  },
  benefitDescription: {
    marginLeft: SPACING.md,
  },
  notificationsSection: {
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  notificationToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disclaimer: {
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  button: {
    marginTop: SPACING.lg,
  },
});

export default WelcomeScreen;
