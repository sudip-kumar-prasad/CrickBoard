import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import { AuthService } from '../utils/auth';

export default function LoginScreen({ navigation, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      await AuthService.login(email.trim(), password);
      Alert.alert('Success', 'Logged in successfully', [
        { text: 'OK', onPress: () => onLoginSuccess && onLoginSuccess() }
      ]);
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await AuthService.register(email.trim(), password, name.trim());
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => onLoginSuccess && onLoginSuccess() }
      ]);
    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>🏏</Text>
            <Text style={styles.title}>CrickBoard</Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </Text>
          </View>

          {/* Form Card */}
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              {!isLogin && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    mode="outlined"
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    autoCapitalize="words"
                    style={styles.input}
                    left={<TextInput.Icon icon="account" />}
                  />
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  mode="outlined"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  left={<TextInput.Icon icon="email" />}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  mode="outlined"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry
                  style={styles.input}
                  left={<TextInput.Icon icon="lock" />}
                />
                {!isLogin && (
                  <Text style={styles.hint}>
                    Password must be at least 6 characters
                  </Text>
                )}
              </View>

              <Button
                mode="contained"
                onPress={isLogin ? handleLogin : handleRegister}
                loading={loading}
                disabled={loading}
                style={styles.submitButton}
                contentStyle={styles.submitButtonContent}
              >
                {isLogin ? 'Login' : 'Create Account'}
              </Button>

              <TouchableOpacity onPress={toggleMode} style={styles.toggleButton}>
                <Text style={styles.toggleText}>
                  {isLogin
                    ? "Don't have an account? "
                    : 'Already have an account? '}
                  <Text style={styles.toggleLink}>
                    {isLogin ? 'Sign Up' : 'Login'}
                  </Text>
                </Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>

          {/* Info Card */}
          <Card style={styles.infoCard} mode="outlined">
            <Card.Content>
              <Text style={styles.infoTitle}>📱 About CrickBoard</Text>
              <Text style={styles.infoText}>
                Track your cricket team's performance, manage players, record matches,
                and analyze statistics - all in one place!
              </Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0f172a',
  },
  hint: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: '#3b82f6',
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  toggleText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  toggleLink: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#60a5fa',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 20,
  },
});

