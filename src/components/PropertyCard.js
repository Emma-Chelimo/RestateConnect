import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { resolveImage } from '../utils/imageHelper';

const PropertyCard = ({ property, navigation }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PropertyDetail', { property })}
    >
      <Image source={resolveImage(property.images[0])} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.price}>${property.price.toLocaleString()}</Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{property.type}</Text>
          </View>
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {property.title}
        </Text>
        <View style={styles.locationContainer}>
          <Icon name="location-outline" size={14} color="#666" />
          <Text style={styles.location} numberOfLines={1}>
            {property.location}
          </Text>
        </View>
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Icon name="bed-outline" size={16} color="#2C3E8F" />
            <Text style={styles.detailText}>{property.bedrooms}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="bath-outline" size={16} color="#2C3E8F" />
            <Text style={styles.detailText}>{property.bathrooms}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="square-outline" size={16} color="#2C3E8F" />
            <Text style={styles.detailText}>{property.area} sq ft</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E8F',
  },
  typeBadge: {
    backgroundColor: '#E8EDF9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    color: '#2C3E8F',
    fontWeight: '500',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  location: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  details: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
});

export default PropertyCard;
