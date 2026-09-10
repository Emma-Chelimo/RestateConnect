import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

// The real, working implementation (Stripe SetupIntents via Cloud Functions)
// lives in PaymentMethodsScreen.stripe.inactive.js. To turn it back on:
//   1. Upgrade the Firebase project to the Blaze plan
//   2. Deploy functions/index.js (firebase deploy --only functions)
//   3. Rename this file out of the way and rename the .stripe.inactive.js
//      file to PaymentMethodsScreen.js
const PaymentMethodsScreen = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <Icon name="card-outline" size={48} color={colors.subtext} />
      <Text style={styles.title}>Payment Methods</Text>
      <Text style={styles.subtitle}>
        This feature is coming soon. You'll be able to securely save a card here once it's turned on.
      </Text>
    </View>
  );
};

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 32 },
    title: { color: colors.text, fontSize: 18, fontWeight: '600', marginTop: 16 },
    subtitle: { color: colors.subtext, fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  });

export default PaymentMethodsScreen;
