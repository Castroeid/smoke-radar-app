import * as Location from 'expo-location';
import { Platform } from 'react-native';

export type UserLocation = {
  lat: number;
  lng: number;
};

export type UserLocationResult = {
  location: UserLocation | null;
  reason?: 'services-disabled' | 'permission-denied' | 'position-unavailable' | 'location-timeout';
  canAskAgain?: boolean;
  debug?: string;
};

export async function requestUserLocation(): Promise<UserLocationResult> {
  try {
    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (!servicesEnabled) {
      return { location: null, reason: 'services-disabled' };
    }

    const currentPermission = await Location.getForegroundPermissionsAsync();
    const permission =
      currentPermission.status === 'granted' ? currentPermission : await Location.requestForegroundPermissionsAsync();

    if (permission.status !== 'granted') {
      return { location: null, reason: 'permission-denied', canAskAgain: permission.canAskAgain };
    }

    if (Platform.OS === 'android') {
      await enableAndroidNetworkLocation();
    }

    const lastKnownPosition = await Location.getLastKnownPositionAsync({ maxAge: 300000 });
    if (lastKnownPosition) {
      return { location: toUserLocation(lastKnownPosition), debug: 'last-known' };
    }

    const currentPosition = await withTimeout(
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
        mayShowUserSettingsDialog: true,
      }),
      12000
    );

    if (currentPosition) {
      return { location: toUserLocation(currentPosition), debug: 'current' };
    }

    const watchedPosition = await watchPositionOnce();
    if (watchedPosition) {
      return { location: toUserLocation(watchedPosition), debug: 'watch' };
    }

    return { location: null, reason: 'location-timeout' };
  } catch (error) {
    const location = await getBrowserLocation();
    return location
      ? { location, debug: 'browser' }
      : { location: null, reason: 'position-unavailable', debug: error instanceof Error ? error.message : 'unknown' };
  }
}

export async function getUserLocation(): Promise<UserLocation | null> {
  const result = await requestUserLocation();
  return result.location;
}

function getBrowserLocation() {
  const geolocation = globalThis.navigator?.geolocation;

  if (!geolocation) {
    return Promise.resolve(null);
  }

  return new Promise<UserLocation | null>((resolve) => {
    geolocation.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  });
}

async function enableAndroidNetworkLocation() {
  try {
    await Location.enableNetworkProviderAsync();
  } catch {
    // Some devices or Expo Go builds do not show this dialog. Continue with the normal providers.
  }
}

function toUserLocation(position: Location.LocationObject): UserLocation {
  return { lat: position.coords.latitude, lng: position.coords.longitude };
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T | null> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch(() => {
        clearTimeout(timer);
        resolve(null);
      });
  });
}

function watchPositionOnce() {
  return new Promise<Location.LocationObject | null>((resolve) => {
    let subscription: Location.LocationSubscription | null = null;
    const timer = setTimeout(() => {
      subscription?.remove();
      resolve(null);
    }, 10000);

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Low,
        timeInterval: 1000,
        distanceInterval: 1,
        mayShowUserSettingsDialog: true,
      },
      (position) => {
        clearTimeout(timer);
        subscription?.remove();
        resolve(position);
      },
      () => {
        clearTimeout(timer);
        subscription?.remove();
        resolve(null);
      }
    )
      .then((result) => {
        subscription = result;
      })
      .catch(() => {
        clearTimeout(timer);
        resolve(null);
      });
  });
}
