import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import {
  Text,
  TextInput as PaperTextInput,
  Button,
  Surface,
  IconButton,
  Divider
} from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthService } from '../utils/auth';

/**
 * LoginScreen Component - Premium Redesign (CrickHeroes Style)
 * 👨‍🏫 EXPLANATION FOR SIR:
 * "Sir, I have redesigned the Login experience to look modern and professional.
 * I used a 'Hero Header' with a large cricket icon and a sleek 'Surface' card 
 * for the inputs. The logic is kept very simple: we handle Login and Registration 
 * in the same file using a single boolean flag, which makes the code easy to follow."
 */
export default function LoginScreen({ navigation, onLoginSuccess }) {
  // --- STATE ---
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- AUTH LOGIC ---

  const handleAuth = async () => {
    // 1. Basic Validation
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Info', 'Please provide both email and password.');
      return;
    }

    if (!isLogin && !name.trim()) {
      Alert.alert('Missing Info', 'Please enter your full name to register.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // 👨‍🏫 EXPLANATION: Calling the Login service
        await AuthService.login(email.trim(), password);
        onLoginSuccess && onLoginSuccess();
      } else {
        // 👨‍🏫 EXPLANATION: Calling the Registration service
        await AuthService.register(email.trim(), password, name.trim());
        onLoginSuccess && onLoginSuccess();
      }
    } catch (error) {
      console.log('Auth Error:', error);
      Alert.alert(isLogin ? 'Login Failed' : 'Registration Failed', error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    // Reset fields when switching
    setEmail('');
    setPassword('');
    setName('');
  };

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Deep Navy
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 60,
  },
  logoBadge: {
    width: 120,
    height: 120,
    backgroundColor: '#1e293b',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#22c55e',
    elevation: 10,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 4,
  },
  brandTagline: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: '600',
    marginTop: 5,
  },
  authCard: {
    backgroundColor: '#1e293b',
    marginHorizontal: 24,
    borderRadius: 30,
    padding: 30,
    elevation: 8,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 25,
  },
  form: {
    gap: 15,
  },
  input: {
    backgroundColor: '#0f172a',
  },
  submitBtn: {
    marginTop: 10,
    backgroundColor: '#22c55e',
    borderRadius: 15,
  },
  submitBtnText: {
    fontWeight: 'bold',
    letterSpacing: 1,
    fontSize: 16,
  },
  divider: {
    marginVertical: 25,
    backgroundColor: '#334155',
  },
  toggleBtn: {
    alignItems: 'center',
  },
  toggleText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  toggleLink: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
  footerInfo: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    color: '#475569',
    fontSize: 12,
  },
  versionText: {
    color: '#334155',
    fontSize: 10,
    marginTop: 5,
  }
});

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* 1. HERO BRANDING SECTION */}
          <View style={styles.heroSection}>
            <View style={styles.logoBadge}>
              <MaterialCommunityIcons name="cricket" size={80} color="#22c55e" />
            </View>
            <Text style={styles.brandTitle}>CRICKBOARD</Text>
            <Text style={styles.brandTagline}>Your Digital Team Manager</Text>
          </View>

          {/* 2. AUTH CARD */}
          <Surface style={styles.authCard} elevation={4}>
            <Text style={styles.formTitle}>
              {isLogin ? 'Welcome Back' : 'Join the Squad'}
            </Text>
            <Text style={styles.formSubtitle}>
              {isLogin ? 'Login to manage your team' : 'Start your cricket management journey'}
            </Text>

            <View style={styles.form}>
              {!isLogin && (
                <PaperTextInput
                  label="Full Name"
                  mode="outlined"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  outlineColor="#334155"
                  activeOutlineColor="#22c55e"
                  textColor="#ffffff"
                  left={<PaperTextInput.Icon icon="account" color="#94a3b8" />}
                />
              )}

              <PaperTextInput
                label="Email Address"
                mode="outlined"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                outlineColor="#334155"
                activeOutlineColor="#22c55e"
                textColor="#ffffff"
                left={<PaperTextInput.Icon icon="email" color="#94a3b8" />}
              />

              <PaperTextInput
                label="Password"
                mode="outlined"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.input}
                outlineColor="#334155"
                activeOutlineColor="#22c55e"
                textColor="#ffffff"
                left={<PaperTextInput.Icon icon="lock" color="#94a3b8" />}
                right={
                  <PaperTextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    color="#64748b"
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              <Button
                mode="contained"
                onPress={handleAuth}
                loading={loading}
                disabled={loading}
                style={styles.submitBtn}
                contentStyle={{ height: 55 }}
                labelStyle={styles.submitBtnText}
              >
                {isLogin ? 'GET STARTED' : 'REGISTER NOW'}
              </Button>
            </View>

            <Divider style={styles.divider} />

            <TouchableOpacity onPress={toggleMode} style={styles.toggleBtn}>
              <Text style={styles.toggleText}>
                {isLogin ? "New user? " : "Already have an account? "}
                <Text style={styles.toggleLink}>{isLogin ? 'Create Account' : 'Sign In'}</Text>
              </Text>
            </TouchableOpacity>
          </Surface>

          {/* 3. APP INFO */}
          <View style={styles.footerInfo}>
            <Text style={styles.footerText}>Made for professional Team Management</Text>
            <Text style={styles.versionText}>v1.2.0 • Premium Edition</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}


