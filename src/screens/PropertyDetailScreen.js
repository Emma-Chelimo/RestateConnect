import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const PropertyDetailScreen = ({ route, navigation }) => {
  const { property } = route.params;
  const [isFavorite, setIsFavorite] = useState(property.isFavorite);

  useEffect(() => {
    checkFavoriteStatus();
  }, []);

  const checkFavoriteStatus = async () => {
    try {
      const favs = await AsyncStorage.getItem('favorites');
      if (favs) {
        const favIds = JSON.parse(favs);
        setIsFavorite(favIds.includes(property.id));
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const favs = await AsyncStorage.getItem('favorites');
      let favIds = favs ? JSON.parse(favs) : [];

      if (isFavorite) {
        favIds = favIds.filter(id => id !== property.id);
      } else {
        favIds.push(property.id);
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(favIds));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Image Gallery */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: property.images[0] }} style={styles.mainImage} />
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={toggleFavorite}
        >
          <Icon
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={28}
            color={isFavorite ? '#FF4444' : '#fff'}
          />
        </TouchableOpacity>
      </View>

      {/* Property Info */}
      <View style={styles.content}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${property.price.toLocaleString()}</Text>
          <Text style={styles.priceLabel}>Price</Text>
        </View>

        <Text style={styles.title}>{property.title}</Text>
        <View style={styles.locationContainer}>
          <Icon name="location-outline" size={18} color="#666" />
          <Text style={styles.location}>{property.location}</Text>
        </View>

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Icon name="bed-outline" size={20} color="#2C3E8F" />
            <Text style={styles.detailValue}>{property.bedrooms}</Text>
            <Text style={styles.detailLabel}>Bedrooms</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="bath-outline" size={20} color="#2C3E8F" />
            <Text style={styles.detailValue}>{property.bathrooms}</Text>
            <Text style={styles.detailLabel}>Bathrooms</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="square-outline" size={20} color="#2C3E8F" />
            <Text style={styles.detailValue}>{property.area} sq ft</Text>
            <Text style={styles.detailLabel}>Area</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="calendar-outline" size={20} color="#2C3E8F" />
            <Text style={styles.detailValue}>{property.yearBuilt || 'N/A'}</Text>
            <Text style={styles.detailLabel}>Year Built</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{property.description}</Text>
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesContainer}>
            {property.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityTag}>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact Agent Button */}
        <TouchableOpacity style={styles.contactBtn}>
          <Icon name="chatbubble-outline" size={24} color="#fff" />
          <Text style={styles.contactBtnText}>Contact Agent</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.scheduleBtn}>
          <Icon name="calendar-outline" size={24} color="#2C3E8F" />
          <Text style={styles.scheduleBtnText}>Schedule a Visit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1a2c',
  },
  imageContainer: {
    position: 'relative',
    width: width,
    height: 300,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  backBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 25,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 25,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E8F',
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  detailItem: {
    alignItems: 'center',
    gap: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityTag: {
    backgroundColor: '#E8EDF9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  amenityText: {
    color: '#2C3E8F',
    fontSize: 14,
  },
  contactBtn: {
    backgroundColor: '#2C3E8F',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 10,
  },
  contactBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scheduleBtn: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C3E8F',
    gap: 10,
  },
  scheduleBtnText: {
    color: '#2C3E8F',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PropertyDetailScreen;
