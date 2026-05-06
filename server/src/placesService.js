import { butchers } from './mockData.js';

const placesUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const defaultLocation = { lat: 32.0853, lng: 34.7818 };

export async function findButchersWithPlaces({ lat, lng } = {}) {
  if (!process.env.GOOGLE_PLACES_API_KEY) {
    return butchers;
  }

  const location = {
    lat: Number.isFinite(Number(lat)) ? Number(lat) : defaultLocation.lat,
    lng: Number.isFinite(Number(lng)) ? Number(lng) : defaultLocation.lng,
  };

  try {
    const url = new URL(placesUrl);
    url.searchParams.set('location', `${location.lat},${location.lng}`);
    url.searchParams.set('radius', '12000');
    url.searchParams.set('keyword', 'קצביה butcher meat');
    url.searchParams.set('type', 'store');
    url.searchParams.set('language', 'he');
    url.searchParams.set('key', process.env.GOOGLE_PLACES_API_KEY);

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.status !== 'OK') {
      console.warn('Falling back to mock butchers:', data.status ?? response.status, data.error_message ?? '');
      return butchers;
    }

    return data.results.slice(0, 6).map((place) => ({
      id: place.place_id,
      name: place.name,
      rating: place.rating ? String(place.rating) : 'חדש',
      address: place.vicinity ?? 'כתובת לא זמינה',
      reviewHighlight: place.user_ratings_total
        ? `${place.user_ratings_total} דירוגים ב-Google Places. מומלץ לבדוק זמינות ונתחים לפני הגעה.`
        : 'נמצאה דרך Google Places. מומלץ לבדוק זמינות ונתחים לפני הגעה.',
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}`,
    }));
  } catch (error) {
    console.warn('Falling back to mock butchers:', error.message);
    return butchers;
  }
}
