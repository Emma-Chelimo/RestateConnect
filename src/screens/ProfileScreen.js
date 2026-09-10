import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ProfileScreen = ({ navigation }) => {
  const { colors, isDark, toggleDarkMode } = useTheme();
  const { user, profile, signOut } = useAuth();

  const menuItems = [
    { icon: 'person-outline', label: 'Personal Information', color: '#2C3E8F', onPress: () => navigation.navigate('PersonalInfo') },
    { icon: 'card-outline', label: 'Payment Methods', color: '#27AE60', onPress: () => navigation.navigate('PaymentMethods') },
    { icon: 'notifications-outline', label: 'Notifications', color: '#F39C12', onPress: () => navigation.navigate('Notifications') },
    { icon: 'help-circle-outline', label: 'Help & Support', color: '#3498DB', onPress: () => navigation.navigate('HelpSupport') },
    { icon: 'settings-outline', label: 'Settings', color: '#8E44AD', onPress: () => navigation.navigate('Settings') },
    {
      icon: 'log-out-outline',
      label: 'Sign Out',
      color: '#E74C3C',
      onPress: () =>
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign Out', style: 'destructive', onPress: signOut },
        ]),
    },
  ];

  const displayName = profile?.name || user?.displayName || 'User';
  const email = profile?.email || user?.email || '';
  const photoURL =
    profile?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2C3E8F&color=fff&size=200`;

  const styles = getStyles(colors);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <Image source={{ uri: photoURL }} style={styles.profileImage} />
        <Text style={styles.profileName}>{displayName}</Text>
        <Text style={styles.profileEmail}>{email}</Text>
        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('PersonalInfo')}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Properties Viewed</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>2</Text>
          <Text style={styles.statLabel}>Inquiries</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
            <View style={styles.menuLeft}>
              <Icon name={item.icon} size={24} color={item.color} />
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            <Icon name="chevron-forward-outline" size={20} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.switchContainer}>
        <View style={styles.switchItem}>
          <View style={styles.menuLeft}>
            <Icon name="moon-outline" size={24} color="#8E44AD" />
            <Text style={styles.menuLabel}>Dark Mode</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#ddd', true: '#2C3E8F' }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { paddingTop: 20, paddingBottom: 30 },
    header: { paddingHorizontal: 20, paddingBottom: 15 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: colors.title },
    profileCard: {
      backgroundColor: colors.card,
      marginHorizontal: 20,
      padding: 20,
      borderRadius: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    profileImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
    profileName: { fontSize: 20, fontWeight: 'bold', color: colors.text },
    profileEmail: { fontSize: 14, color: colors.subtext, marginTop: 4 },
    editBtn: {
      marginTop: 12,
      paddingHorizontal: 20,
      paddingVertical: 8,
      backgroundColor: colors.primary,
      borderRadius: 20,
    },
    editBtnText: { color: '#fff', fontSize: 14, fontWeight: '500' },
    statsContainer: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      marginHorizontal: 20,
      marginTop: 15,
      padding: 20,
      borderRadius: 16,
      justifyContent: 'space-around',
      borderWidth: 1,
      borderColor: colors.border,
    },
    statItem: { alignItems: 'center' },
    statNumber: { fontSize: 22, fontWeight: 'bold', color: colors.primary },
    statLabel: { fontSize: 12, color: colors.subtext, marginTop: 4 },
    statDivider: { width: 1, backgroundColor: colors.divider },
    menuContainer: {
      backgroundColor: colors.card,
      marginHorizontal: 20,
      marginTop: 15,
      borderRadius: 16,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    menuItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    menuLabel: { fontSize: 16, color: colors.text, marginLeft: 12 },
    switchContainer: {
      backgroundColor: colors.card,
      marginHorizontal: 20,
      marginTop: 15,
      borderRadius: 16,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    switchItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingVertical: 14,
    },
  });

export default ProfileScreen;
