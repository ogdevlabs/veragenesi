import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Switch } from 'react-native';
import { HeadingText, BodyText, Button } from '../components/BasicComponents';
import { COLORS, SPACING } from '../config/designSystem';
import { useAuth } from '../state/AuthContext';

const SettingsScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [offlineMode, setOfflineMode] = useState(true);

  const handleLogout = () => {
    logout();
    navigation.navigate('Welcome');
  };

  const SettingRow = ({ label, value, onChange }) => (
    <View style={styles.settingRow}>
      <BodyText text={label} />
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: COLORS.border, true: COLORS.primary }}
        thumbColor={COLORS.surface}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <HeadingText text="Configuración" level={1} style={styles.title} />

      <View style={styles.section}>
        <HeadingText text="Preferencias" level={3} style={styles.sectionTitle} />
        <View style={styles.settingCard}>
          <SettingRow
            label="Notificaciones"
            value={notifications}
            onChange={setNotifications}
          />
          <View style={styles.divider} />
          <SettingRow
            label="Modo Oscuro"
            value={darkMode}
            onChange={setDarkMode}
          />
          <View style={styles.divider} />
          <SettingRow
            label="Sincronizar Offline"
            value={offlineMode}
            onChange={setOfflineMode}
          />
        </View>
      </View>

      <View style={styles.section}>
        <HeadingText text="Sobre la App" level={3} style={styles.sectionTitle} />
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <BodyText text="Versión" color={COLORS.text_secondary} />
            <BodyText text="1.0.0" />
          </View>
          <View style={styles.infoRow}>
            <BodyText text="Compilación" color={COLORS.text_secondary} />
            <BodyText text="MVP-Alpha" />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <HeadingText text="Ayuda y Soporte" level={3} style={styles.sectionTitle} />
        <Button
          text="Centro de Ayuda"
          variant="secondary"
          onPress={() => navigation.navigate('Help')}
          style={styles.button}
        />
        <Button
          text="Contactar Soporte"
          variant="secondary"
          onPress={() => {}}
          style={styles.button}
        />
        <Button
          text="Términos de Servicio"
          variant="secondary"
          onPress={() => {}}
          style={styles.button}
        />
      </View>

      <View style={styles.section}>
        <HeadingText text="Sesión" level={3} style={styles.sectionTitle} />
        <Button
          text="Cerrar Sesión"
          variant="danger"
          onPress={handleLogout}
          style={styles.dangerButton}
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
  settingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
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
  button: {
    marginBottom: SPACING.md,
  },
  dangerButton: {
    marginBottom: SPACING.md,
  },
});

export default SettingsScreen;
