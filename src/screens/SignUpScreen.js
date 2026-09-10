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

const SignUpScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { signUpWithEmail } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing info', 'Please fill in your name, email, and password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Password too short', 'Use at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Passwords don\u2019t match', 'Double check your password and confirmation.');
      return;
    }
    setLoading(true);
    try {
      await signUpWithEmail(email.trim(), password, name.trim());
    } catch (e) {
      const code = e?.code || '';
      let msg = e?.message || 'Something went wrong.';
      if (code.includes('email-already-in-use')) msg = 'That email is already registered.';
      if (code.includes('invalid-email')) msg = 'That email address looks invalid.';
      Alert.alert('Sign up failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const styles = getStyles(colors);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Join RestateConnect</Text>
      </View>

      {[
        { icon: 'person-outline', placeholder: 'Full name', value: name, onChangeText: setName, secure: false },
        { icon: 'mail-outline', placeholder: 'Email', value: email, onChangeText: setEmail, secure: false, keyboardType: 'email-address' },
        { icon: 'lock-closed-outline', placeholder: 'Password', value: password, onChangeText: setPassword, secure: true },
        { icon: 'lock-closed-outline', placeholder: 'Confirm password', value: confirm, onChangeText: setConfirm, secure: true },
      ].map((field, i) => (
        <View key={i} style={styles.inputGroup}>
          <Icon name={field.icon} size={20} color={colors.subtext} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={field.placeholder}
            placeholderTextColor={colors.subtext}
            autoCapitalize={field.icon === 'mail-outline' ? 'none' : 'words'}
            keyboardType={field.keyboardType || 'default'}
            secureTextEntry={field.secure}
            value={field.value}
            onChangeText={field.onChangeText}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.primaryBtn} onPress={handleSignUp} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Create Account</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignIn')} style={styles.signInRow}>
        <Text style={styles.subtext}>Already have an account? </Text>
        <Text style={styles.link}>Sign in</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

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
      marginTop: 10,
    },
    primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    signInRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  });

export default SignUpScreen;
