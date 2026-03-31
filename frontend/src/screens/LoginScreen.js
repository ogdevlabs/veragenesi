import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { TextField } from '../components/FormComponents';
import { Button, HeadingText, BodyText } from '../components/BasicComponents';
import { COLORS, SPACING } from '../config/designSystem';
import { useAuth } from '../state/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(email, password);
      // Navigation will happen automatically in App.js when auth state updates
    } catch (error) {
      Alert.alert('Login Error', error.message || 'Failed to login');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <HeadingText text="Iniciar Sesión" level={1} style={styles.title} />
      <BodyText text="Accede a tu cuenta" size="large" color={COLORS.text_secondary} style={styles.subtitle} />

      <TextField
        label="Email"
        placeholder="tu@email.com"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrors({ ...errors, email: '' });
        }}
        error={errors.email}
      />

      <TextField
        label="Contraseña"
        placeholder="••••••••"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setErrors({ ...errors, password: '' });
        }}
        secureTextEntry
        error={errors.password}
      />

      <Button
        text={isLoading ? '...' : 'Iniciar Sesión'}
        onPress={handleLogin}
        disabled={isLoading}
        style={styles.button}
      />

      <View style={styles.footer}>
        <BodyText text="¿No tienes cuenta?" color={COLORS.text_secondary} />
        <Button
          text="Crear cuenta"
          variant="secondary"
          onPress={() => navigation.navigate('Signup')}
          style={styles.linkButton}
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
    justifyContent: 'center',
  },
  title: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  button: {
    marginTop: SPACING.lg,
  },
  footer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  linkButton: {
    marginTop: SPACING.sm,
  },
});

export default LoginScreen;
