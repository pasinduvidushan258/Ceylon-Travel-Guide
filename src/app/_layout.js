import React from 'react';
import { Stack } from 'expo-router';
import { TravelProvider } from '../context/TravelContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <TravelProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0f766e' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="destination/[id]"
          options={{
            title: 'Destination Details',
            headerBackTitle: 'Back',
          }}
        />
      </Stack>
    </TravelProvider>
  );
}