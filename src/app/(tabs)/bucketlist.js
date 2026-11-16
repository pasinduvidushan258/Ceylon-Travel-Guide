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

export default function BucketListScreen() {
  const router = useRouter();
  const { destinations, bucketListIds, toggleBucketList } =
    useContext(TravelContext);

  const [itemToRemove, setItemToRemove] = useState(null);

  const savedDestinations = destinations.filter((item) =>
    bucketListIds.includes(item.id)
  );

  const confirmRemove = async () => {
    if (itemToRemove) {
      await toggleBucketList(itemToRemove);
      setItemToRemove(null);
    }
  };

  return (
    <View style={styles.container}>
      {savedDestinations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={64} color="#94a3b8" />
          <Text style={styles.emptyTitle}>Your Bucket List is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Explore destinations and bookmark places you want to visit!
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedDestinations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/destination/${item.id}`)}
            >
              <Image source={{ uri: item.image }} style={styles.thumbnail} />
              <View style={styles.info}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.subtitle}>{item.province} Province</Text>
                <Text style={styles.bestTime}>Best: {item.bestTime}</Text>
              </View>
              <Pressable
                style={styles.deleteBtn}
                onPress={() => setItemToRemove(item)}
              >
                <Ionicons name="trash-outline" size={22} color="#ef4444" />
              </Pressable>
            </Pressable>
          )}
        />
      )}

      {/* Confirmation Modal */}
      <Modal
        visible={itemToRemove !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setItemToRemove(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Remove Destination?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to remove{' '}
              <Text style={{ fontWeight: 'bold' }}>{itemToRemove?.name}</Text>{' '}
              from your bucket list?
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setItemToRemove(null)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, styles.confirmBtn]}
                onPress={confirmRemove}
              >
                <Text style={styles.confirmText}>Remove</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  listContainer: { padding: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
  },
  thumbnail: { width: 80, height: 80, borderRadius: 8 },
  info: { flex: 1, marginLeft: 12 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  bestTime: { fontSize: 12, color: '#0f766e', marginTop: 6, fontWeight: '500' },
  deleteBtn: { padding: 8 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  modalMessage: { fontSize: 14, color: '#475569', marginTop: 8, lineHeight: 20 },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 12,
  },
  modalBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  cancelBtn: { backgroundColor: '#e2e8f0' },
  confirmBtn: { backgroundColor: '#ef4444' },
  cancelText: { color: '#334155', fontWeight: 'bold' },
  confirmText: { color: '#ffffff', fontWeight: 'bold' },
});