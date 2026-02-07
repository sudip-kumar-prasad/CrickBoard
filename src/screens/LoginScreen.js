import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  Image,
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
 * DEVELOPER NOTE:
 * Modernized the UI architecture using a Hero Header and Surface-based 
 * layout. The authentication logic is unified within this component, 
 * using a persistent state flag to toggle between Login and Registration 
 * modules for code maintainability.
 */
export default function LoginScreen({ navigation, onLoginSuccess }) {
  const { theme } = useTheme();
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
      backgroundColor: theme.background, // Deep Navy
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
      backgroundColor: theme.backgroundCard,
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      borderWidth: 2,
      borderColor: theme.success,
      elevation: 10,
      overflow: 'hidden',
    },
    logoImage: {
      width: '100%',
      height: '100%',
    },
    brandTitle: {
      fontSize: 32,
      fontWeight: '900',
      color: '#ffffff',
      letterSpacing: 2,
    },
    brandTagline: {
      fontSize: 14,
      color: theme.success,
      fontWeight: '600',
      marginTop: 5,
    },
    authCard: {
      backgroundColor: theme.border,
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
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 8,
      marginBottom: 25,
    },
    form: {
      gap: 15,
    },
    input: {
      backgroundColor: theme.background,
    },
    submitBtn: {
      marginTop: 10,
      backgroundColor: theme.success,
      borderRadius: 15,
    },
    submitBtnText: {
      fontWeight: 'bold',
      letterSpacing: 1,
      fontSize: 16,
    },
    divider: {
      marginVertical: 25,
      backgroundColor: theme.borderLight,
    },
    toggleBtn: {
      alignItems: 'center',
    },
    toggleText: {
      color: theme.textSecondary,
      fontSize: 14,
    },
    toggleLink: {
      color: theme.success,
      fontWeight: 'bold',
    },
    footerInfo: {
      marginTop: 40,
      alignItems: 'center',
    },
    footerText: {
      color: theme.textSecondary,
      fontSize: 12,
    },
    versionText: {
      color: theme.borderLight,
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
              <Image
                source={require('../../assets/logo/logo.png')}
                style={styles.logoImage}
              />
            </View>
            <Text style={styles.brandTitle}>CRICKBOARD</Text>
            <Text style={styles.brandTagline}>Professional Team Manager</Text>
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
                  outlineColor={theme.borderLight}
                  activeOutlineColor={theme.success}
                  textColor={theme.text}
                  left={<PaperTextInput.Icon icon="account" color={theme.textSecondary} />}
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
                outlineColor={theme.borderLight}
                activeOutlineColor={theme.success}
                textColor={theme.text}
                left={<PaperTextInput.Icon icon="email" color={theme.textSecondary} />}
              />

              <PaperTextInput
                label="Password"
                mode="outlined"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.input}
                outlineColor={theme.borderLight}
                activeOutlineColor={theme.success}
                textColor={theme.text}
                left={<PaperTextInput.Icon icon="lock" color={theme.textSecondary} />}
                right={
                  <PaperTextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    color={theme.textTertiary}
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


