import React, { useContext } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TravelContext } from '../../context/TravelContext';

export default function TabLayout() {
  const { bucketListIds } = useContext(TravelContext);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0f766e',
        tabBarInactiveTintColor: '#64748b',
        headerStyle: { backgroundColor: '#0f766e' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore Ceylon',
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bucketlist"
        options={{
          title: 'My Bucket List',
          tabBarLabel: 'Bucket List',
          tabBarBadge: bucketListIds.length > 0 ? bucketListIds.length : undefined,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}