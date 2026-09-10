import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import functions from '@react-native-firebase/functions';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { useTheme } from '../context/ThemeContext';

const cardBrandIcon = {
  visa: 'card-outline',
  mastercard: 'card-outline',
  amex: 'card-outline',
};

const PaymentMethodsScreen = () => {
  const { colors } = useTheme();
  const { confirmSetupIntent } = useStripe();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);
  const [processing, setProcessing] = useState(false);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const result = await functions().httpsCallable('listPaymentMethods')();
      setCards(result.data.paymentMethods || []);
    } catch (e) {
      Alert.alert('Could not load payment methods', e?.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCards();
    }, [])
  );

  const handleAddCard = async () => {
    if (!cardDetails?.complete) {
      Alert.alert('Incomplete card', 'Please fill in all card details.');
      return;
    }
    setProcessing(true);
    try {
      const { data } = await functions().httpsCallable('createSetupIntent')();
      const { error, setupIntent } = await confirmSetupIntent(data.clientSecret, {
        paymentMethodType: 'Card',
      });
      if (error) {
        Alert.alert('Card declined', error.message);
      } else if (setupIntent) {
        setShowAddCard(false);
        setCardDetails(null);
        await fetchCards();
        Alert.alert('Card added', 'Your card was saved successfully.');
      }
    } catch (e) {
      Alert.alert('Something went wrong', e?.message || 'Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleRemove = (paymentMethodId) => {
    Alert.alert('Remove card', 'Are you sure you want to remove this card?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await functions().httpsCallable('detachPaymentMethod')({ paymentMethodId });
            fetchCards();
          } catch (e) {
            Alert.alert('Could not remove card', e?.message || 'Please try again.');
          }
        },
      },
    ]);
  };

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No saved payment methods yet.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.cardRow}>
              <Icon name={cardBrandIcon[item.brand] || 'card-outline'} size={26} color={colors.primary} />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.cardBrand}>
                  {item.brand?.toUpperCase()} •••• {item.last4}
                </Text>
                <Text style={styles.cardExpiry}>
                  Expires {item.expMonth}/{item.expYear}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleRemove(item.id)}>
                <Icon name="trash-outline" size={20} color="#E74C3C" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddCard(true)}>
        <Icon name="add" size={20} color="#fff" />
        <Text style={styles.addBtnText}>Add Card</Text>
      </TouchableOpacity>

      <Modal visible={showAddCard} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add a card</Text>
            <CardField
              postalCodeEnabled={true}
              placeholders={{ number: '4242 4242 4242 4242' }}
              cardStyle={{
                backgroundColor: colors.surface,
                textColor: colors.text,
                borderRadius: 12,
              }}
              style={{ width: '100%', height: 50, marginVertical: 16 }}
              onCardChange={setCardDetails}
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handleAddCard} disabled={processing}>
              {processing ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Card</Text>}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setShowAddCard(false);
                setCardDetails(null);
              }}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    emptyText: { color: colors.subtext, textAlign: 'center', marginTop: 30 },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardBrand: { color: colors.text, fontSize: 15, fontWeight: '600' },
    cardExpiry: { color: colors.subtext, fontSize: 13, marginTop: 2 },
    addBtn: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      margin: 20,
      borderRadius: 12,
      paddingVertical: 15,
    },
    addBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalCard: { backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
    modalTitle: { color: colors.title, fontSize: 20, fontWeight: 'bold' },
    saveBtn: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 15, alignItems: 'center' },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    cancelBtn: { alignItems: 'center', paddingVertical: 14 },
    cancelBtnText: { color: colors.subtext, fontSize: 15 },
  });

export default PaymentMethodsScreen;
