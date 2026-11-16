import React, { useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TravelContext } from '../../context/TravelContext';

export default function DestinationDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const {
    destinations,
    bucketListIds,
    toggleBucketList,
    triggerLocalNotification,
  } = useContext(TravelContext);

  const destination = destinations.find((item) => item.id === id);

  if (!destination) {
    return (
      <View style={styles.center}>
        <Text>Destination not found.</Text>
      </View>
    );
  }

  const isBookmarked = bucketListIds.includes(destination.id);

  const handleSetReminder = () => {
    triggerLocalNotification(
      'Trip Reminder Set! 🎒',
      `Don't forget! Best time to visit ${destination.name} is ${destination.bestTime}.`
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: destination.image }} style={styles.heroImage} />

      <View style={styles.content}>
        <View style={styles.badgeRow}>
          <Text style={styles.badge}>{destination.province} Province</Text>
          <Text style={styles.badgeSecondary}>{destination.category}</Text>
          <Text style={styles.rating}>⭐ {destination.rating}</Text>
        </View>

        <Text style={styles.title}>{destination.name}</Text>
        <Text style={styles.description}>{destination.description}</Text>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Ionicons name="sunny-outline" size={20} color="#0f766e" />
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Best Time: </Text>
              {destination.bestTime}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="ticket-outline" size={20} color="#0f766e" />
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Entry Fee: </Text>
              {destination.entryFee}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <Pressable
          style={[
            styles.primaryBtn,
            isBookmarked && styles.bookmarkedBtn,
          ]}
          onPress={() => toggleBucketList(destination)}
        >
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color="#ffffff"
          />
          <Text style={styles.btnText}>
            {isBookmarked ? 'Saved in Bucket List' : 'Add to Bucket List'}
          </Text>
        </Pressable>

        <Pressable style={styles.secondaryBtn} onPress={handleSetReminder}>
          <Ionicons name="notifications-outline" size={20} color="#0f766e" />
          <Text style={styles.secondaryBtnText}>Send Travel Reminder Notification</Text>
        </Pressable>

        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>← Go Back</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heroImage: { width: '100%', height: 260 },
  content: { padding: 20 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  badge: {
    backgroundColor: '#ccfbf1',
    color: '#0f766e',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: 'bold',
    fontSize: 12,
  },
  badgeSecondary: {
    backgroundColor: '#e2e8f0',
    color: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: '600',
    fontSize: 12,
  },
  rating: { marginLeft: 'auto', fontWeight: 'bold', fontSize: 15, color: '#f59e0b' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },
  description: { fontSize: 15, color: '#475569', lineHeight: 22, marginBottom: 20 },
  infoBox: {
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoText: { fontSize: 14, color: '#334155', flex: 1 },
  bold: { fontWeight: 'bold' },
  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: '#0f766e',
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  bookmarkedBtn: { backgroundColor: '#0284c7' },
  btnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  secondaryBtn: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: '#0f766e',
    paddingVertical: 13,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  secondaryBtnText: { color: '#0f766e', fontWeight: 'bold', fontSize: 15 },
  backBtn: { alignItems: 'center', paddingVertical: 10 },
  backBtnText: { color: '#64748b', fontWeight: '600', fontSize: 15 },
});