import { createContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { DESTINATIONS } from '../data/destinations';

const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('expo-notifications')) {
    return;
  }
  originalWarn(...args);
};

const Notifications = require('expo-notifications');

// Foreground Notification Handling (SDK Compatible)
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (error) {
  console.log('Notification handler error:', error);
}

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
    try {
      await Notifications.requestPermissionsAsync();
    } catch (error) {
      console.log('Permission error:', error);
    }
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