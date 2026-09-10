import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const FAQS = [
  { q: 'How do I save a property to Favorites?', a: 'Tap the heart icon on any listing card or on the property detail screen.' },
  { q: 'How do I update my payment card?', a: 'Go to Profile > Payment Methods, then add or remove a card. Your card details are stored securely by Stripe, never on this device.' },
  { q: 'How do I contact an agent about a listing?', a: 'Open the property detail screen and tap "Contact Agent" to send an inquiry directly.' },
  { q: 'How do I delete my account?', a: 'Email support using the form below and we\u2019ll process your request within 48 hours.' },
];

const HelpSupportScreen = () => {
  const { colors } = useTheme();
  const { user, profile } = useAuth();
  const [openIndex, setOpenIndex] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      Alert.alert('Write a message', 'Please describe your issue before sending.');
      return;
    }
    setSending(true);
    try {
      await firestore().collection('supportTickets').add({
        uid: user?.uid || null,
        email: profile?.email || user?.email || null,
        message: message.trim(),
        status: 'open',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      setMessage('');
      Alert.alert('Sent', 'Thanks — our support team will get back to you by email.');
    } catch (e) {
      Alert.alert('Could not send', e?.message || 'Please try again.');
    } finally {
      setSending(false);
    }
  };

  const styles = getStyles(colors);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
      {FAQS.map((item, i) => (
        <TouchableOpacity key={i} style={styles.faqItem} onPress={() => setOpenIndex(openIndex === i ? null : i)}>
          <View style={styles.faqHeader}>
            <Text style={styles.faqQ}>{item.q}</Text>
            <Icon name={openIndex === i ? 'chevron-up' : 'chevron-down'} size={18} color={colors.subtext} />
          </View>
          {openIndex === i && <Text style={styles.faqA}>{item.a}</Text>}
        </TouchableOpacity>
      ))}

      <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Still need help?</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Describe your issue..."
        placeholderTextColor={colors.subtext}
        multiline
        value={message}
        onChangeText={setMessage}
      />
      <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={sending}>
        {sending ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendBtnText}>Send Message</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    sectionTitle: { color: colors.title, fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    faqItem: {
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 16,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    faqQ: { color: colors.text, fontSize: 14, fontWeight: '600', flex: 1, marginRight: 10 },
    faqA: { color: colors.subtext, fontSize: 13, marginTop: 10, lineHeight: 19 },
    textArea: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 14,
      minHeight: 100,
      textAlignVertical: 'top',
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sendBtn: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 14 },
    sendBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  });

export default HelpSupportScreen;
