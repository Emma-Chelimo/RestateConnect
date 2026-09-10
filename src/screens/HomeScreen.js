import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { properties, propertyTypes } from '../data/properties';
import PropertyCard from '../components/PropertyCard';

const HomeScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  // Featured = the 3 highest-priced listings, just as a simple "showcase" rule for now
  const featured = useMemo(
    () => [...properties].sort((a, b) => b.price - a.price).slice(0, 3),
    []
  );

  const recent = useMemo(() => {
    if (activeCategory === 'all') return properties;
    return properties.filter(
      p => p.type.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [activeCategory]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back 👋</Text>
          <Text style={styles.headerTitle}>Find your next home</Text>
        </View>
        <TouchableOpacity
          style={styles.searchShortcut}
          onPress={() => navigation.navigate('Explore')}
        >
          <Icon name="search-outline" size={22} color="#2C3E8F" />
        </TouchableOpacity>
      </View>

      {/* Category chips */}
      <FlatList
        data={propertyTypes}
        horizontal
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryChip,
              activeCategory === item.id && styles.categoryChipActive,
            ]}
            onPress={() => setActiveCategory(item.id)}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === item.id && styles.categoryTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Featured carousel */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Featured</Text>
      </View>
      <FlatList
        data={featured}
        horizontal
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.featuredList}
        renderItem={({ item }) => (
          <View style={styles.featuredCardWrapper}>
            <PropertyCard property={item} navigation={navigation} />
          </View>
        )}
      />

      {/* Recent / category-filtered listings */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>
          {activeCategory === 'all' ? 'All Listings' : propertyTypes.find(t => t.id === activeCategory)?.label}
        </Text>
        <Text style={styles.sectionCount}>{recent.length} results</Text>
      </View>
      <View style={styles.listingsList}>
        {recent.map(item => (
          <PropertyCard key={item.id} property={item} navigation={navigation} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1a2c',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7c7ce4',
    marginTop: 2,
  },
  searchShortcut: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryList: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: '#2C3E8F',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  sectionCount: {
    fontSize: 13,
    color: '#666',
  },
  featuredList: {
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
  featuredCardWrapper: {
    width: 260,
    marginRight: 16,
  },
  listingsList: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
});

export default HomeScreen;
