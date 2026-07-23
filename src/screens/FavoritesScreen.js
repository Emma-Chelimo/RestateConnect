src/screens/FavoritesScreen.js

javascript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { properties } from '../data/properties';
import PropertyCard from '../components/PropertyCard';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favs = await AsyncStorage.getItem('favorites');
      if (favs) {
        const favIds = JSON.parse(favs);
        const favProperties = properties.filter(p => favIds.includes(p.id));
        setFavorites(favProperties);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="heart-outline" size={80} color="#ddd" />
        <Text style={styles.emptyTitle}>No Favorites Yet</Text>
        <Text style={styles.emptyText}>
          Start saving properties you love by tapping the heart icon.
        </Text>
        <TouchableOpacity
          style={styles.exploreBtn}
          onPress={() => navigation.navigate('Explore')}
        >
          <Text style={styles.exploreBtnText}>Explore Properties</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Favorites</Text>
        <Text style={styles.headerSubtitle}>{favorites.length} properties saved</Text>
      </View>

      <FlatList
        data={favorites}
        renderItem={({ item }) => (
          <PropertyCard property={item} navigation={navigation} />
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingTop: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#F5F7FA',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  exploreBtn: {
    backgroundColor: '#2C3E8F',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 12,
  },
  exploreBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default FavoritesScreen;
