import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, ActivityIndicator, Switch, Text } from 'react-native';
import { TextField } from '../components/FormComponents';
import { Button, HeadingText, BodyText } from '../components/BasicComponents';
import { COLORS, SPACING, TYPOGRAPHY } from '../config/designSystem';
import { useAuth } from '../state/AuthContext';

const STRINGS = {
  es: {
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'tu@email.com',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: '••••••••',
    loginButton: 'Iniciar Sesión',
    noAccount: '¿No tienes cuenta?',
    createAccount: 'Crear cuenta',
    emailRequired: 'El correo electrónico es obligatorio',
    passwordRequired: 'La contraseña es obligatoria',
    loginError: 'Error al iniciar sesión',
    langToggleLabel: 'English',
  },
  en: {
    emailLabel: 'Email',
    emailPlaceholder: 'you@email.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    loginButton: 'Log In',
    noAccount: "Don't have an account?",
    createAccount: 'Create account',
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    loginError: 'Login failed',
    langToggleLabel: 'Español',
  },
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [lang, setLang] = useState('es');
  const { login, isLoading } = useAuth();

  const t = STRINGS[lang];

  const handleLogin = async () => {
    const newErrors = {};
    if (!email) newErrors.email = t.emailRequired;
    if (!password) newErrors.password = t.passwordRequired;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      Alert.alert(t.loginError, error.message || t.loginError);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand header */}
        <View style={styles.brand}>
          <Text style={styles.brandName}>VeraGenesi</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextField
            label={t.emailLabel}
            placeholder={t.emailPlaceholder}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors({ ...errors, email: '' });
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <TextField
            label={t.passwordLabel}
            placeholder={t.passwordPlaceholder}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors({ ...errors, password: '' });
            }}
            secureTextEntry
            error={errors.password}
          />

          <Button
            text={isLoading ? '...' : t.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
            style={styles.button}
          />

          <View style={styles.signupRow}>
            <BodyText text={t.noAccount} color={COLORS.text_secondary} />
            <Button
              text={t.createAccount}
              variant="secondary"
              onPress={() => navigation.navigate('Signup')}
              style={styles.linkButton}
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.langToggle}>
          <BodyText text={t.langToggleLabel} color={COLORS.text_secondary} size="small" />
          <Switch
            value={lang === 'en'}
            onValueChange={(val) => setLang(val ? 'en' : 'es')}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={lang === 'en' ? COLORS.primary_dark : COLORS.text_tertiary}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: SPACING.lg,
    paddingTop: SPACING.xl * 2,
    justifyContent: 'center',
  },
  brand: {
    alignItems: 'center',
    marginBottom: SPACING.xl * 1.5,
  },
  brandName: {
    ...TYPOGRAPHY.heading1,
    color: COLORS.primary,
    letterSpacing: 1,
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: SPACING.lg,
  },
  signupRow: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  linkButton: {
    marginTop: SPACING.sm,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  langToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
  },
});

export default LoginScreen;
