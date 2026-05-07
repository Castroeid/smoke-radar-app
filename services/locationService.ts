import * as Location from 'expo-location';

export type UserLocation = {
  lat: number;
  lng: number;
};

export async function getUserLocation(): Promise<UserLocation | null> {
  try {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== 'granted') {
      return null;
    }

    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return { lat: position.coords.latitude, lng: position.coords.longitude };
  } catch {
    return getBrowserLocation();
  }
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
