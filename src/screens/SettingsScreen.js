import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const SettingsScreen = () => {
  const { colors, isDark, toggleDarkMode } = useTheme();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Icon name="moon-outline" size={22} color={colors.primary} />
          <Text style={styles.label}>Dark Mode</Text>
        </View>
        <Switch value={isDark} onValueChange={toggleDarkMode} trackColor={{ false: colors.border, true: colors.primary }} />
      </View>

      <TouchableOpacity style={styles.row} onPress={handleSignOut}>
        <View style={styles.rowLeft}>
          <Icon name="log-out-outline" size={22} color="#E74C3C" />
          <Text style={[styles.label, { color: '#E74C3C' }]}>Sign Out</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, padding: 20 },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    label: { color: colors.text, fontSize: 15, fontWeight: '500', marginLeft: 12 },
  });

export default SettingsScreen;
