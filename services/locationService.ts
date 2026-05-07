import * as Location from 'expo-location';

export type UserLocation = {
  lat: number;
  lng: number;
};

export type UserLocationResult = {
  location: UserLocation | null;
  reason?: 'services-disabled' | 'permission-denied' | 'position-unavailable';
  canAskAgain?: boolean;
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

    const lastKnownPosition = await Location.getLastKnownPositionAsync({ maxAge: 60000 });
    const position = lastKnownPosition ?? (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
    return { location: { lat: position.coords.latitude, lng: position.coords.longitude } };
  } catch {
    const location = await getBrowserLocation();
    return location ? { location } : { location: null, reason: 'position-unavailable' };
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
