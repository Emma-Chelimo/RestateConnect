import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const PREF_LABELS = [
  { key: 'newListings', label: 'New Listings', desc: 'Get notified when new properties match your interests' },
  { key: 'priceDrops', label: 'Price Drops', desc: 'Alerts when a saved favorite drops in price' },
  { key: 'inquiries', label: 'Inquiry Updates', desc: 'Replies to your inquiries from agents' },
  { key: 'marketing', label: 'News & Offers', desc: 'Occasional updates and promotions' },
];

const NotificationsScreen = () => {
  const { colors } = useTheme();
  const { profile, updateProfileFields } = useAuth();
  const [prefs, setPrefs] = useState(null);
  const [savingKey, setSavingKey] = useState(null);

  useEffect(() => {
    if (profile?.notificationPrefs) setPrefs(profile.notificationPrefs);
  }, [profile]);

  const handleToggle = async (key, value) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    setSavingKey(key);
    try {
      await updateProfileFields({ notificationPrefs: updated });
    } finally {
      setSavingKey(null);
    }
  };

  const styles = getStyles(colors);

  if (!prefs) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {PREF_LABELS.map((item) => (
        <View key={item.key} style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
          {savingKey === item.key ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Switch
              value={!!prefs[item.key]}
              onValueChange={(v) => handleToggle(item.key, v)}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          )}
        </View>
      ))}
    </View>
  );
};

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, padding: 20 },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    label: { color: colors.text, fontSize: 15, fontWeight: '600' },
    desc: { color: colors.subtext, fontSize: 13, marginTop: 3 },
  });

export default NotificationsScreen;
