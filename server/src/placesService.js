import { butchers } from './mockData.js';

const nearbySearchUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const textSearchUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
const newTextSearchUrl = 'https://places.googleapis.com/v1/places:searchText';
const defaultLocation = { lat: 32.0853, lng: 34.7818 };
const searchRadiusMeters = 45000;
const maxButcherResults = 10;
const butcherSearchQueries = [
  'קצבייה',
  'קצביה',
  'אטליז',
  'חנות בשר',
  'בשר טרי',
  'butcher shop',
  'meat market',
];

export async function findButchersWithPlaces({ lat, lng } = {}) {
  if (!process.env.GOOGLE_PLACES_API_KEY) {
    return markFallbackButchers('אין מפתח גוגל פעיל בשרת.');
  }

  const location = {
    lat: Number.isFinite(Number(lat)) ? Number(lat) : defaultLocation.lat,
    lng: Number.isFinite(Number(lng)) ? Number(lng) : defaultLocation.lng,
  };

  try {
    const newTextResults = await searchNewTextButchers(location);
    if (newTextResults.length > 0) {
      return newTextResults;
    }

    const nearbyResults = await searchNearbyButchers(location);
    if (nearbyResults.length > 0) {
      return nearbyResults;
    }

    const textResults = await searchTextButchers(location);
    if (textResults.length > 0) {
      return textResults;
    }

    console.warn('Google Places returned no butcher results near location:', location);
    return markFallbackButchers('גוגל לא החזיר תוצאות באזור הזה.');
  } catch (error) {
    console.warn('Falling back to mock butchers:', error.message);
    return markFallbackButchers('החיבור לגוגל נכשל זמנית.');
  }
}

async function searchNewTextButchers(location) {
  const resultGroups = await Promise.all(
    butcherSearchQueries.map((textQuery) => searchNewTextQuery(textQuery, location))
  );

  return dedupeAndRankButchers(resultGroups.flat()).slice(0, maxButcherResults);
}

async function searchNewTextQuery(textQuery, location) {
  const response = await fetch(newTextSearchUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.googleMapsUri,places.businessStatus',
    },
    body: JSON.stringify({
      textQuery,
      languageCode: 'he',
      regionCode: 'IL',
      maxResultCount: 10,
      rankPreference: 'RELEVANCE',
      locationBias: {
        circle: {
          center: {
            latitude: location.lat,
            longitude: location.lng,
          },
          radius: searchRadiusMeters,
        },
      },
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.warn('Google Places New text search failed:', textQuery, response.status, data.error?.message ?? '');
    return [];
  }

  return (data.places ?? [])
    .filter((place) => place.businessStatus !== 'CLOSED_PERMANENTLY')
    .map((place) => mapNewPlaceToButcher(place, location));
}

async function searchNearbyButchers(location) {
  const resultGroups = await Promise.all(
    butcherSearchQueries.map((keyword) => {
      const url = new URL(nearbySearchUrl);
      url.searchParams.set('location', `${location.lat},${location.lng}`);
      url.searchParams.set('radius', String(searchRadiusMeters));
      url.searchParams.set('keyword', keyword);
      url.searchParams.set('language', 'he');
      url.searchParams.set('key', process.env.GOOGLE_PLACES_API_KEY);

      return fetchPlaces(url, location, 'nearby');
    })
  );

  return dedupeAndRankButchers(resultGroups.flat()).slice(0, maxButcherResults);
}

async function searchTextButchers(location) {
  const resultGroups = await Promise.all(
    butcherSearchQueries.map((textQuery) => {
      const url = new URL(textSearchUrl);
      url.searchParams.set('query', textQuery);
      url.searchParams.set('location', `${location.lat},${location.lng}`);
      url.searchParams.set('radius', String(searchRadiusMeters));
      url.searchParams.set('language', 'he');
      url.searchParams.set('key', process.env.GOOGLE_PLACES_API_KEY);

      return fetchPlaces(url, location, 'text');
    })
  );

  return dedupeAndRankButchers(resultGroups.flat()).slice(0, maxButcherResults);
}

async function fetchPlaces(url, location, searchType) {
  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !['OK', 'ZERO_RESULTS'].includes(data.status)) {
    console.warn('Google Places search failed:', searchType, data.status ?? response.status, data.error_message ?? '');
    return [];
  }

  if (data.status === 'ZERO_RESULTS') {
    return [];
  }

  return (data.results ?? []).map((place) => mapPlaceToButcher(place, location, searchType));
}

function mapNewPlaceToButcher(place, location) {
  const placeLocation = place.location ? { lat: place.location.latitude, lng: place.location.longitude } : undefined;
  const distanceMeters = placeLocation ? calculateDistanceMeters(location, placeLocation) : undefined;

  return {
    id: place.id,
    name: place.displayName?.text ?? 'קצבייה',
    rating: place.rating ? String(place.rating) : 'חדש',
    ratingCount: place.userRatingCount ?? 0,
    address: place.formattedAddress ?? 'כתובת לא זמינה',
    reviewHighlight: buildReviewHighlight({ user_ratings_total: place.userRatingCount }, distanceMeters, 'new-text'),
    mapsUrl:
      place.googleMapsUri ??
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.displayName?.text ?? 'קצבייה')}`,
    source: 'google',
    distanceMeters,
  };
}

function mapPlaceToButcher(place, location, searchType) {
  const placeLocation = place.geometry?.location;
  const distanceMeters = placeLocation ? calculateDistanceMeters(location, placeLocation) : undefined;

  return {
    id: place.place_id,
    name: place.name,
    rating: place.rating ? String(place.rating) : 'חדש',
    ratingCount: place.user_ratings_total ?? 0,
    address: place.vicinity ?? place.formatted_address ?? 'כתובת לא זמינה',
    reviewHighlight: buildReviewHighlight(place, distanceMeters, searchType),
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}`,
    source: 'google',
    distanceMeters,
  };
}

function buildReviewHighlight(place, distanceMeters, searchType) {
  const distanceText = distanceMeters ? `כ-${formatDistance(distanceMeters)} מהמיקום שלכם. ` : '';
  const ratingText = place.user_ratings_total ? `${place.user_ratings_total} דירוגים בגוגל. ` : '';
  const searchText =
    searchType === 'new-text'
      ? 'נמצאה בחיפוש Google Places לפי האזור. '
      : searchType === 'text'
        ? 'נמצאה בחיפוש טקסט לפי האזור. '
        : 'נמצאה בחיפוש קרוב לפי האזור. ';

  return `${distanceText}${ratingText}${searchText}מומלץ לבדוק זמינות ונתחים לפני ההגעה.`;
}

function markFallbackButchers(reason) {
  return butchers.map((butcher) => ({
    ...butcher,
    source: 'fallback',
    reviewHighlight: `${butcher.reviewHighlight} ${reason}`,
  }));
}

function dedupeAndRankButchers(items) {
  const uniqueItems = new Map();

  for (const item of items) {
    if (!item?.id || !isWithinSearchRadius(item)) {
      continue;
    }

    const current = uniqueItems.get(item.id);
    if (!current || weightedButcherScore(item) > weightedButcherScore(current)) {
      uniqueItems.set(item.id, item);
    }
  }

  return [...uniqueItems.values()].sort(sortButchersByTrust);
}

function isWithinSearchRadius(item) {
  return !item.distanceMeters || item.distanceMeters <= searchRadiusMeters;
}

function sortButchersByTrust(first, second) {
  const scoreDiff = weightedButcherScore(second) - weightedButcherScore(first);

  if (Math.abs(scoreDiff) > 0.01) {
    return scoreDiff;
  }

  return (first.distanceMeters ?? Infinity) - (second.distanceMeters ?? Infinity);
}

function weightedButcherScore(butcher) {
  const rating = Number.parseFloat(butcher.rating);
  const ratingCount = Number(butcher.ratingCount ?? 0);

  if (!Number.isFinite(rating) || ratingCount <= 0) {
    return 0;
  }

  const baselineRating = 4.2;
  const baselineCount = 30;
  const bayesianRating = (rating * ratingCount + baselineRating * baselineCount) / (ratingCount + baselineCount);
  const confidenceBoost = Math.min(0.35, Math.log10(ratingCount + 1) * 0.08);

  return bayesianRating + confidenceBoost;
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
