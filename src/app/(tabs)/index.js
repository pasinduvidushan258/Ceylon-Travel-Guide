import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  Modal,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TravelContext } from '../../context/TravelContext';
import { PROVINCES } from '../../data/destinations';

export default function ExploreScreen() {
  const router = useRouter();
  const {
    destinations,
    bucketListIds,
    toggleBucketList,
    selectedProvince,
    setSelectedProvince,
    appStateStatus,
    welcomeBackBanner,
    clearBanner,
  } = useContext(TravelContext);

  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const filteredDestinations =
    selectedProvince === 'All'
      ? destinations
      : destinations.filter((item) => item.province === selectedProvince);

  const renderDestinationCard = ({ item }) => {
    const isBookmarked = bucketListIds.includes(item.id);

    return (
      <Pressable
        style={styles.card}
        onPress={() => router.push(`/destination/${item.id}`)}
      >
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>
                {item.province} Province • {item.category}
              </Text>
            </View>
            <Pressable
              onPress={() => toggleBucketList(item)}
              style={styles.bookmarkBtn}
            >
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color={isBookmarked ? '#0f766e' : '#64748b'}
              />
            </Pressable>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.ratingText}>⭐ {item.rating}</Text>
            <Text style={styles.viewMoreText}>Tap for details →</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* AppState Foreground Detection Banner */}
      {welcomeBackBanner !== '' && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{welcomeBackBanner}</Text>
          <Pressable onPress={clearBanner}>
            <Ionicons name="close-circle" size={20} color="#ffffff" />
          </Pressable>
        </View>
      )}

      {/* Top Filter Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.filterStatusText}>
            Province: <Text style={styles.boldText}>{selectedProvince}</Text>
          </Text>
          <Text style={styles.appStateText}>AppState: {appStateStatus}</Text>
        </View>
        <Pressable
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="options-outline" size={18} color="#ffffff" />
          <Text style={styles.filterButtonText}>Filter</Text>
        </Pressable>
      </View>

      {/* Destinations FlatList */}
      <FlatList
        data={filteredDestinations}
        keyExtractor={(item) => item.id}
        renderItem={renderDestinationCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Province Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Province</Text>
            {PROVINCES.map((province) => (
              <Pressable
                key={province}
                style={[
                  styles.provinceOption,
                  selectedProvince === province && styles.selectedProvinceOption,
                ]}
                onPress={() => {
                  setSelectedProvince(province);
                  setFilterModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.provinceOptionText,
                    selectedProvince === province &&
                      styles.selectedProvinceOptionText,
                  ]}
                >
                  {province}
                </Text>
                {selectedProvince === province && (
                  <Ionicons name="checkmark" size={20} color="#ffffff" />
                )}
              </Pressable>
            ))}

            <Pressable
              style={styles.closeModalBtn}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.closeModalText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  banner: {
    backgroundColor: '#0284c7',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerText: { color: '#ffffff', fontWeight: '600', fontSize: 13 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  filterStatusText: { fontSize: 15, color: '#334155' },
  boldText: { fontWeight: 'bold', color: '#0f766e' },
  appStateText: { fontSize: 12, color: '#64748b', marginTop: 2 },
  filterButton: {
    flexDirection: 'row',
    backgroundColor: '#0f766e',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    gap: 6,
  },
  filterButtonText: { color: '#ffffff', fontWeight: '600' },
  listContainer: { padding: 16 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  cardImage: { width: '100%', height: 180 },
  cardContent: { padding: 14 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  cardSubtitle: { fontSize: 13, color: '#64748b', marginTop: 4 },
  bookmarkBtn: { padding: 4 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  ratingText: { fontSize: 14, fontWeight: '600', color: '#f59e0b' },
  viewMoreText: { fontSize: 13, fontWeight: '600', color: '#0f766e' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 14,
    color: '#0f172a',
  },
  provinceOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8fafc',
  },
  selectedProvinceOption: { backgroundColor: '#0f766e' },
  provinceOptionText: { fontSize: 15, color: '#334155', fontWeight: '500' },
  selectedProvinceOptionText: { color: '#ffffff', fontWeight: 'bold' },
  closeModalBtn: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeModalText: { color: '#ef4444', fontWeight: 'bold', fontSize: 15 },
});