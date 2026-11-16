import React, { createContext, useState, useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { DESTINATIONS } from '../data/destinations';

// Foreground Notification Handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const TravelContext = createContext();

export const TravelProvider = ({ children }) => {
  const [destinations] = useState(DESTINATIONS);
  const [bucketListIds, setBucketListIds] = useState(['1']); // Default Bucket List with Sigiriya Rock Fortress
  const [selectedProvince, setSelectedProvince] = useState('All');

  // AppState and Welcome Back Banner Handling
  const appState = useRef(AppState.currentState);
  const [appStateStatus, setAppStateStatus] = useState(appState.current);
  const [welcomeBackBanner, setWelcomeBackBanner] = useState('');

  useEffect(() => {
    requestNotificationPermissions();

    // AppState Event Listener
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        const timeString = new Date().toLocaleTimeString();
        setWelcomeBackBanner(`Welcome back! Resumed at ${timeString}`);
      }
      appState.current = nextAppState;
      setAppStateStatus(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const requestNotificationPermissions = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
      });
    }
    await Notifications.requestPermissionsAsync();
  };

  // Local Notification Triggering
  const triggerLocalNotification = async (title, body) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          sound: true,
        },
        trigger: null, // Immediate notification
      });
    } catch (error) {
      console.log('Notification error:', error);
    }
  };

  // Toggle Bucket List Functionality
  const toggleBucketList = async (destination) => {
    const exists = bucketListIds.includes(destination.id);
    if (exists) {
      setBucketListIds((prev) => prev.filter((id) => id !== destination.id));
      await triggerLocalNotification(
        'Removed from Bucket List',
        `${destination.name} was removed from your planned trips.`
      );
    } else {
      setBucketListIds((prev) => [...prev, destination.id]);
      await triggerLocalNotification(
        'Destination Bookmarked! 🌴',
        `${destination.name} added to your Ceylon Bucket List!`
      );
    }
  };

  const clearBanner = () => setWelcomeBackBanner('');

  return (
    <TravelContext.Provider
      value={{
        destinations,
        bucketListIds,
        toggleBucketList,
        selectedProvince,
        setSelectedProvince,
        appStateStatus,
        welcomeBackBanner,
        clearBanner,
        triggerLocalNotification,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};