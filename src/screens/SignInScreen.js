import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const SignInScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { signInWithEmail, signInWithGoogle, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Missing info', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmail(email.trim(), password);
    } catch (e) {
      Alert.alert('Sign in failed', friendlyError(e));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      Alert.alert('Google sign-in failed', friendlyError(e));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Enter your email', 'Type your email above first, then tap "Forgot password?" again.');
      return;
    }
    try {
      await resetPassword(email.trim());
      Alert.alert('Check your inbox', 'We sent a password reset link to ' + email);
    } catch (e) {
      Alert.alert('Could not send reset email', friendlyError(e));
    }
  };

  const styles = getStyles(colors);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to RestateConnect</Text>
      </View>

      <View style={styles.inputGroup}>
        <Icon name="mail-outline" size={20} color={colors.subtext} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.subtext}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputGroup}>
        <Icon name="lock-closed-outline" size={20} color={colors.subtext} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.subtext}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.link}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryBtn} onPress={handleSignIn} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Sign In</Text>}
      </TouchableOpacity>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleSignIn} disabled={googleLoading}>
        {googleLoading ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <>
            <Icon name="logo-google" size={20} color={colors.text} />
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.signUpRow}>
        <Text style={styles.subtext}>Don't have an account? </Text>
        <Text style={styles.link}>Sign up</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

function friendlyError(e) {
  const code = e?.code || '';
  if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential')) {
    return 'Incorrect email or password.';
  }
  if (code.includes('invalid-email')) return 'That email address looks invalid.';
  if (code.includes('network-request-failed')) return 'Network error. Check your connection and try again.';
  return e?.message || 'Something went wrong. Please try again.';
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, padding: 24, justifyContent: 'center' },
    header: { marginBottom: 32 },
    title: { fontSize: 28, fontWeight: 'bold', color: colors.title },
    subtitle: { fontSize: 15, color: colors.subtext, marginTop: 6 },
    inputGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 14,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, paddingVertical: 14, color: colors.text, fontSize: 15 },
    link: { color: colors.primary, fontSize: 14, fontWeight: '600' },
    subtext: { color: colors.subtext, fontSize: 14 },
    primaryBtn: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 15,
      alignItems: 'center',
      marginTop: 20,
    },
    primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
    dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
    dividerText: { marginHorizontal: 10, color: colors.subtext },
    googleBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingVertical: 14,
    },
    googleBtnText: { color: colors.text, fontSize: 15, fontWeight: '500' },
    signUpRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  });

export default SignInScreen;
