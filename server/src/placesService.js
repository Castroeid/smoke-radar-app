import { butchers } from './mockData.js';

const nearbySearchUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const textSearchUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
const defaultLocation = { lat: 32.0853, lng: 34.7818 };

export async function findButchersWithPlaces({ lat, lng } = {}) {
  if (!process.env.GOOGLE_PLACES_API_KEY) {
    return markFallbackButchers('אין מפתח Google Places פעיל בשרת.');
  }

  const location = {
    lat: Number.isFinite(Number(lat)) ? Number(lat) : defaultLocation.lat,
    lng: Number.isFinite(Number(lng)) ? Number(lng) : defaultLocation.lng,
  };

  try {
    const nearbyResults = await searchNearbyButchers(location);
    if (nearbyResults.length > 0) {
      return nearbyResults;
    }

    const textResults = await searchTextButchers(location);
    if (textResults.length > 0) {
      return textResults;
    }

    return markFallbackButchers('Google Places לא החזיר תוצאות באזור הזה.');
  } catch (error) {
    console.warn('Falling back to mock butchers:', error.message);
    return markFallbackButchers('החיבור ל-Google Places נכשל זמנית.');
  }
}

async function searchNearbyButchers(location) {
  const url = new URL(nearbySearchUrl);
  url.searchParams.set('location', `${location.lat},${location.lng}`);
  url.searchParams.set('radius', '20000');
  url.searchParams.set('keyword', 'קצביה בשר butcher meat');
  url.searchParams.set('language', 'he');
  url.searchParams.set('key', process.env.GOOGLE_PLACES_API_KEY);

  return fetchPlaces(url, location, 'nearby');
}

async function searchTextButchers(location) {
  const url = new URL(textSearchUrl);
  url.searchParams.set('query', 'קצביה בשר');
  url.searchParams.set('location', `${location.lat},${location.lng}`);
  url.searchParams.set('radius', '20000');
  url.searchParams.set('language', 'he');
  url.searchParams.set('key', process.env.GOOGLE_PLACES_API_KEY);

  return fetchPlaces(url, location, 'text');
}

async function fetchPlaces(url, location, searchType) {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok || !['OK', 'ZERO_RESULTS'].includes(data.status)) {
    console.warn('Google Places search failed:', searchType, data.status ?? response.status, data.error_message ?? '');
    return [];
  }

  if (data.status === 'ZERO_RESULTS') {
    return [];
  }

  return data.results
    .map((place) => mapPlaceToButcher(place, location, searchType))
    .sort((first, second) => (first.distanceMeters ?? Infinity) - (second.distanceMeters ?? Infinity))
    .slice(0, 8);
}

function mapPlaceToButcher(place, location, searchType) {
  const placeLocation = place.geometry?.location;
  const distanceMeters = placeLocation ? calculateDistanceMeters(location, placeLocation) : undefined;

  return {
    id: place.place_id,
    name: place.name,
    rating: place.rating ? String(place.rating) : 'חדש',
    address: place.vicinity ?? place.formatted_address ?? 'כתובת לא זמינה',
    reviewHighlight: buildReviewHighlight(place, distanceMeters, searchType),
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}`,
    source: 'google',
    distanceMeters,
  };
}

function buildReviewHighlight(place, distanceMeters, searchType) {
  const distanceText = distanceMeters ? `כ-${formatDistance(distanceMeters)} מהמיקום שלכם. ` : '';
  const ratingText = place.user_ratings_total ? `${place.user_ratings_total} דירוגים ב-Google Places. ` : '';
  const searchText = searchType === 'text' ? 'נמצאה בחיפוש טקסט לפי האזור. ' : '';

  return `${distanceText}${ratingText}${searchText}מומלץ לבדוק זמינות ונתחים לפני הגעה.`;
}

function markFallbackButchers(reason) {
  return butchers.map((butcher) => ({
    ...butcher,
    source: 'fallback',
    reviewHighlight: `${butcher.reviewHighlight} ${reason}`,
  }));
}

function calculateDistanceMeters(from, to) {
  const earthRadiusMeters = 6371000;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return Math.round(earthRadiusMeters * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function formatDistance(distanceMeters) {
  if (distanceMeters < 1000) {
    return `${distanceMeters} מטר`;
  }

  return `${(distanceMeters / 1000).toFixed(1)} ק״מ`;
}
