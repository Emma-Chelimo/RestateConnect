import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Photo upload is disabled for now (needs Firebase Storage, which requires
// the Blaze plan). Profiles use an auto-generated initials avatar instead.
// To re-enable uploads later: add @react-native-firebase/storage and
// react-native-image-picker back, then restore the pickImage logic that
// used to live here (see PersonalInfoScreen in your project history).
const PersonalInfoScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { user, profile, updateProfileFields } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setPhone(profile.phone || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter your name.');
      return;
    }
    setSaving(true);
    try {
      await updateProfileFields({ name: name.trim(), phone: phone.trim(), bio: bio.trim() });
      await auth().currentUser.updateProfile({ displayName: name.trim() });
      Alert.alert('Saved', 'Your profile has been updated.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Save failed', e?.message || 'Could not save your changes.');
    } finally {
      setSaving(false);
    }
  };

  const avatarURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=8080dd&color=fff&size=200`;

  const styles = getStyles(colors);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarWrap}>
        <Image source={{ uri: avatarURL }} style={styles.avatar} />
        <Text style={styles.avatarHint}>Photo uploads are coming soon</Text>
      </View>

      <Text style={styles.label}>Full name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={colors.subtext} />

      <Text style={styles.label}>Email</Text>
      <View style={[styles.input, styles.disabledInput]}>
        <Text style={{ color: colors.subtext }}>{profile?.email || user?.email}</Text>
      </View>

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="+256 700 000000"
        placeholderTextColor={colors.subtext}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={[styles.input, styles.bioInput]}
        value={bio}
        onChangeText={setBio}
        placeholder="A short bio (optional)"
        placeholderTextColor={colors.subtext}
        multiline
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 20, paddingBottom: 40 },
    avatarWrap: { alignItems: 'center', marginBottom: 24 },
    avatar: { width: 100, height: 100, borderRadius: 50 },
    avatarHint: { color: colors.subtext, fontSize: 13, marginTop: 10 },
    label: { color: colors.subtext, fontSize: 13, marginBottom: 6, marginTop: 16 },
    input: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      color: colors.text,
      fontSize: 15,
      borderWidth: 1,
      borderColor: colors.border,
    },
    disabledInput: { justifyContent: 'center' },
    bioInput: { minHeight: 90, textAlignVertical: 'top' },
    saveBtn: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 15,
      alignItems: 'center',
      marginTop: 28,
    },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  });

export default PersonalInfoScreen;
