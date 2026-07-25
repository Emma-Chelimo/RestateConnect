import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { properties } from '../data/properties';
import PropertyCard from '../components/PropertyCard';

const ExploreScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [sortBy, setSortBy] = useState('price-low');

  const handleSearch = (text) => {
    setSearchQuery(text);
    let filtered = properties;

    if (text) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(text.toLowerCase()) ||
        p.location.toLowerCase().includes(text.toLowerCase()) ||
        p.type.toLowerCase().includes(text.toLowerCase())
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return b.yearBuilt - a.yearBuilt;
        default:
          return 0;
      }
    });

    setFilteredProperties(filtered);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Properties</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={24} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by location, type, or name..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.filterBtn}>
          <Icon name="options-outline" size={24} color="#2C3E8F" />
        </TouchableOpacity>
      </View>

      <View style={styles.sortContainer}>
        <Text style={styles.resultsCount}>{filteredProperties.length} properties found</Text>
        <View style={styles.sortOptions}>
          <TouchableOpacity
            style={[styles.sortBtn, sortBy === 'price-low' && styles.sortBtnActive]}
            onPress={() => {
              setSortBy('price-low');
              handleSearch(searchQuery);
            }}
          >
            <Text style={[styles.sortText, sortBy === 'price-low' && styles.sortTextActive]}>
              Price: Low-High
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortBtn, sortBy === 'price-high' && styles.sortBtnActive]}
            onPress={() => {
              setSortBy('price-high');
              handleSearch(searchQuery);
            }}
          >
            <Text style={[styles.sortText, sortBy === 'price-high' && styles.sortTextActive]}>
              Price: High-Low
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredProperties}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A2E',
  },
  filterBtn: {
    padding: 5,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  sortBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#fff',
    marginLeft: 8,
  },
  sortBtnActive: {
    backgroundColor: '#2C3E8F',
  },
  sortText: {
    fontSize: 12,
    color: '#666',
  },
  sortTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default ExploreScreen;
