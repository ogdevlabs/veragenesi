import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { TextField } from '../components/FormComponents';
import { Button, HeadingText, BodyText } from '../components/BasicComponents';
import { COLORS, SPACING } from '../config/designSystem';
import { useAuth } from '../state/AuthContext';

const SignupScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { register, isLoading } = useAuth();

  const handleSignup = async () => {
    const newErrors = {};
    if (!firstName) newErrors.firstName = 'First name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm password';
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await register(email, password, firstName);
      // After successful registration, navigation will proceed to assessments
      // in App.js when auth state updates
    } catch (error) {
      Alert.alert('Signup Error', error.message || 'Failed to create account');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <HeadingText text="Crear Cuenta" level={1} style={styles.title} />
      <BodyText text="Únete a VeraGenesi" size="large" color={COLORS.text_secondary} style={styles.subtitle} />

      <TextField
        label="Nombre"
        placeholder="Tu nombre"
        value={firstName}
        onChangeText={(text) => {
          setFirstName(text);
          setErrors({ ...errors, firstName: '' });
        }}
        error={errors.firstName}
      />

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

      <TextField
        label="Confirmar Contraseña"
        placeholder="••••••••"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setErrors({ ...errors, confirmPassword: '' });
        }}
        secureTextEntry
        error={errors.confirmPassword}
      />

      <BodyText
        text="Al crear una cuenta, aceptas nuestros Términos de Servicio y Política de Privacidad"
        size="small"
        color={COLORS.text_tertiary}
        style={styles.disclaimer}
      />

      <Button
        text={isLoading ? '...' : 'Crear Cuenta'}
        onPress={handleSignup}
        disabled={isLoading}
        style={styles.button}
      />

      <View style={styles.footer}>
        <BodyText text="¿Ya tienes cuenta?" color={COLORS.text_secondary} />
        <Button
          text="Iniciar sesión"
          variant="secondary"
          onPress={() => navigation.navigate('Login')}
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
  disclaimer: {
    marginVertical: SPACING.md,
    textAlign: 'center',
  },
  button: {
    marginTop: SPACING.lg,
  },
  footer: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  linkButton: {
    marginTop: SPACING.sm,
  },
});

export default SignupScreen;
