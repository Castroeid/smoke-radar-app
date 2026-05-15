import { butchers } from './mockData.js';

const nearbySearchUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const textSearchUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
const newNearbySearchUrl = 'https://places.googleapis.com/v1/places:searchNearby';
const newTextSearchUrl = 'https://places.googleapis.com/v1/places:searchText';
const overpassSearchUrl = 'https://overpass-api.de/api/interpreter';
const defaultLocation = { lat: 32.0853, lng: 34.7818 };
const primarySearchRadiusMeters = 12000;
const searchRadiusMeters = 35000;
const maxButcherResults = 10;
const butcherSearchQueries = ['קצבייה', 'קצביה', 'אטליז', 'חנות בשר', 'בשר טרי', 'butcher shop', 'meat market'];

export async function findButchersWithPlaces({ lat, lng } = {}) {
  if (!process.env.GOOGLE_PLACES_API_KEY) {
    console.warn('Butcher lookup fallback: missing GOOGLE_PLACES_API_KEY');
    return markFallbackButchers('אין מפתח Google Places פעיל בשרת.');
  }

  const location = {
    lat: Number.isFinite(Number(lat)) ? Number(lat) : defaultLocation.lat,
    lng: Number.isFinite(Number(lng)) ? Number(lng) : defaultLocation.lng,
  };

  try {
    console.log('Butcher lookup started:', location);

    const [newNearbyResults, newTextResults, nearbyResults, textResults, openStreetMapResults] = await Promise.all([
      searchNewNearbyButchers(location),
      searchNewTextButchers(location),
      searchNearbyButchers(location),
      searchTextButchers(location),
      searchOpenStreetMapButchers(location),
    ]);

    console.log('Butcher lookup counts:', {
      newNearby: newNearbyResults.length,
      newText: newTextResults.length,
      nearby: nearbyResults.length,
      text: textResults.length,
      osm: openStreetMapResults.length,
    });

    const rankedResults = dedupeAndRankButchers([
      ...newNearbyResults,
      ...newTextResults,
      ...nearbyResults,
      ...textResults,
      ...openStreetMapResults,
    ]).slice(0, maxButcherResults);

    if (rankedResults.length > 0) {
      console.log(
        'Butcher lookup selected:',
        rankedResults.map((item) => ({
          name: item.name,
          distanceMeters: item.distanceMeters,
          rating: item.rating,
          ratingCount: item.ratingCount,
          source: item.source,
        }))
      );
      return rankedResults;
    }

    console.warn('Google Places returned no butcher results near location:', location);
    return markFallbackButchers('Google לא החזיר תוצאות באזור הזה.');
  } catch (error) {
    console.warn('Falling back to mock butchers:', error.message);
    return markFallbackButchers('החיבור לשירותי מפה נכשל זמנית.');
  }
}

async function searchNewNearbyButchers(location) {
  const response = await fetch(newNearbySearchUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.googleMapsUri,places.businessStatus,places.primaryType,places.types',
    },
    body: JSON.stringify({
      includedTypes: ['butcher_shop'],
      maxResultCount: 20,
      rankPreference: 'DISTANCE',
      languageCode: 'he',
      regionCode: 'IL',
      locationRestriction: {
        circle: {
          center: {
            latitude: location.lat,
            longitude: location.lng,
          },
          radius: primarySearchRadiusMeters,
        },
      },
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.warn('Google Places New nearby search failed:', response.status, data.error?.message ?? '');
    return [];
  }

  return (data.places ?? [])
    .filter((place) => place.businessStatus !== 'CLOSED_PERMANENTLY')
    .map((place) => mapNewPlaceToButcher(place, location, 'new-nearby'));
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
        'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.googleMapsUri,places.businessStatus,places.primaryType,places.types',
    },
    body: JSON.stringify({
      textQuery,
      languageCode: 'he',
      regionCode: 'IL',
      pageSize: 12,
      rankPreference: 'DISTANCE',
      locationBias: {
        circle: {
          center: {
            latitude: location.lat,
            longitude: location.lng,
          },
          radius: primarySearchRadiusMeters,
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
    .filter((place) => looksLikeButcher(place))
    .map((place) => mapNewPlaceToButcher(place, location, 'new-text'));
}

async function searchNearbyButchers(location) {
  const resultGroups = await Promise.all(
    butcherSearchQueries.map((keyword) => {
      const url = new URL(nearbySearchUrl);
      url.searchParams.set('location', `${location.lat},${location.lng}`);
      url.searchParams.set('keyword', keyword);
      url.searchParams.set('rankby', 'distance');
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
      url.searchParams.set('radius', String(primarySearchRadiusMeters));
      url.searchParams.set('language', 'he');
      url.searchParams.set('key', process.env.GOOGLE_PLACES_API_KEY);

      return fetchPlaces(url, location, 'text');
    })
  );

  return dedupeAndRankButchers(resultGroups.flat()).slice(0, maxButcherResults);
}

async function searchOpenStreetMapButchers(location) {
  const data = new URLSearchParams({
    data: buildOpenStreetMapQuery(location),
  });

  const response = await fetch(overpassSearchUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: data,
  });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.warn('OpenStreetMap Overpass search failed:', response.status);
    return [];
  }

  return dedupeAndRankButchers(
    (body.elements ?? [])
      .map((element) => mapOpenStreetMapElementToButcher(element, location))
      .filter(Boolean)
  ).slice(0, maxButcherResults);
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

  return (data.results ?? [])
    .filter((place) => place.business_status !== 'CLOSED_PERMANENTLY')
    .map((place) => mapPlaceToButcher(place, location, searchType));
}

function mapNewPlaceToButcher(place, location, searchType) {
  const placeLocation = place.location ? { lat: place.location.latitude, lng: place.location.longitude } : undefined;
  const distanceMeters = placeLocation ? calculateDistanceMeters(location, placeLocation) : undefined;

  return {
    id: place.id,
    name: place.displayName?.text ?? 'קצבייה',
    rating: place.rating ? String(place.rating) : 'חדש',
    ratingCount: place.userRatingCount ?? 0,
    address: place.formattedAddress ?? 'כתובת לא זמינה',
    reviewHighlight: buildReviewHighlight({ user_ratings_total: place.userRatingCount }, distanceMeters, searchType),
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

function mapOpenStreetMapElementToButcher(element, location) {
  const placeLocation = resolveOpenStreetMapLocation(element);

  if (!placeLocation) {
    return null;
  }

  const tags = element.tags ?? {};
  const name = tags['name:he'] ?? tags.name ?? tags.brand ?? 'קצבייה';
  const distanceMeters = calculateDistanceMeters(location, placeLocation);

  return {
    id: `osm-${element.type}-${element.id}`,
    name,
    rating: 'חדש',
    ratingCount: 0,
    address: formatOpenStreetMapAddress(tags, placeLocation),
    reviewHighlight: `כ-${formatDistance(distanceMeters)} מהמיקום שלכם. נמצאה במאגר OpenStreetMap לפי המיקום. מומלץ לבדוק זמינות ונתחים לפני ההגעה.`,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${placeLocation.lat},${placeLocation.lng}`)}`,
    source: 'osm',
    distanceMeters,
  };
}

function buildReviewHighlight(place, distanceMeters, searchType) {
  const distanceText = distanceMeters ? `כ-${formatDistance(distanceMeters)} מהמיקום שלכם. ` : '';
  const ratingText = place.user_ratings_total ? `${place.user_ratings_total} דירוגים בגוגל. ` : '';
  const searchText =
    searchType === 'new-nearby'
      ? 'נמצאה בחיפוש קצביות סמוכות של Google Places. '
      : searchType === 'new-text'
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

function buildOpenStreetMapQuery(location) {
  const around = `(around:${primarySearchRadiusMeters},${location.lat},${location.lng})`;

  return `
[out:json][timeout:10];
(
  node["shop"="butcher"]${around};
  way["shop"="butcher"]${around};
  relation["shop"="butcher"]${around};
  node["craft"="butcher"]${around};
  way["craft"="butcher"]${around};
  relation["craft"="butcher"]${around};
  node["name"~"קצב|קצביה|קצבייה|אטליז|בשר",i]${around};
  way["name"~"קצב|קצביה|קצבייה|אטליז|בשר",i]${around};
  relation["name"~"קצב|קצביה|קצבייה|אטליז|בשר",i]${around};
);
out center ${maxButcherResults * 3};
`;
}

function resolveOpenStreetMapLocation(element) {
  const lat = element.lat ?? element.center?.lat;
  const lng = element.lon ?? element.center?.lon;

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return { lat, lng };
}

function formatOpenStreetMapAddress(tags, location) {
  const street = tags['addr:street'];
  const houseNumber = tags['addr:housenumber'];
  const city = tags['addr:city'] ?? tags['addr:town'] ?? tags['addr:suburb'];
  const streetAddress = [street, houseNumber].filter(Boolean).join(' ');
  const address = [streetAddress, city].filter(Boolean).join(', ');

  if (address) {
    return address;
  }

  return `מיקום במפה: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
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
  const distanceMeters = Number(butcher.distanceMeters ?? searchRadiusMeters);

  if (!Number.isFinite(rating) || ratingCount <= 0) {
    return Number.isFinite(distanceMeters) ? Math.max(0, 3.6 - distanceMeters / 10000) : 0;
  }

  const baselineRating = 4.2;
  const baselineCount = 30;
  const bayesianRating = (rating * ratingCount + baselineRating * baselineCount) / (ratingCount + baselineCount);
  const confidenceBoost = Math.min(0.35, Math.log10(ratingCount + 1) * 0.08);
  const distanceKm = Number.isFinite(distanceMeters) ? distanceMeters / 1000 : searchRadiusMeters / 1000;
  const distancePenalty = Math.min(0.9, Math.log1p(distanceKm) * 0.22);

  return bayesianRating + confidenceBoost - distancePenalty;
}

function looksLikeButcher(place) {
  const typeText = [...(place.types ?? []), place.primaryType ?? ''].join(' ').toLowerCase();
  const nameText = place.displayName?.text ?? '';
  const addressText = place.formattedAddress ?? '';
  const text = `${nameText} ${addressText}`.toLowerCase();

  return (
    typeText.includes('butcher_shop') ||
    text.includes('קצב') ||
    text.includes('אטליז') ||
    text.includes('בשר') ||
    text.includes('butcher') ||
    text.includes('meat')
  );
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

  return `${(distanceMeters / 1000).toFixed(1)} ק"מ`;
}
