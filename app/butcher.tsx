import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppScreen } from '@/components/AppScreen';
import { SectionTitle } from '@/components/SectionTitle';
import { SmokeImage } from '@/components/SmokeImage';
import { smokeImages } from '@/constants/smokeImages';
import { centerText, rtlBlockText, rtlRow, rtlText, smokeColors } from '@/constants/smokeTheme';
import { requestUserLocation, type UserLocation } from '@/services/locationService';
import { findNearbyButchers, type Butcher } from '@/services/smokeRadarService';

export default function ButcherScreen() {
  const [items, setItems] = useState<Butcher[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('מציגים תוצאות קרובות לדוגמה עד לקבלת מיקום.');

  const loadButchers = useCallback(async (location?: UserLocation | null) => {
    setLoading(true);
    try {
      const results = await findNearbyButchers(location);
      setItems(rankButchers(results));
      if (location) {
        const hasGoogleResults = results.some((item) => item.source === 'google');
        setLocationStatus(
          hasGoogleResults
            ? `נמצא מיקום: ${formatLocation(location)}. מוצגות קצביות אמיתיות מגוגל.`
            : `נמצא מיקום: ${formatLocation(location)}, אבל גוגל לא החזיר קצביות אמיתיות באזור. מוצגות תוצאות ברירת מחדל.`
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const findNearMe = useCallback(async () => {
    setLoading(true);
    setLocationStatus('מבקשים מיקום ומחפשים קצביות קרובות...');
    const result = await requestUserLocation();

    if (!result.location) {
      const message =
        result.reason === 'services-disabled'
          ? 'שירותי המיקום כבויים בטלפון. הפעילו Location במכשיר ונסו שוב.'
          : result.reason === 'permission-denied' && result.canAskAgain === false
          ? 'הרשאת המיקום חסומה ל-Expo Go. פתחו הגדרות ואפשרו Location.'
          : result.reason === 'location-timeout'
            ? 'המכשיר לא הספיק להחזיר מיקום. נסו לצאת החוצה רגע או להפעיל דיוק מיקום גבוה.'
            : result.reason === 'position-unavailable'
              ? 'המכשיר לא החזיר מיקום זמין כרגע.'
          : 'לא התקבלה הרשאת מיקום. לחצו שוב ואשרו מיקום, או בדקו הרשאות בטלפון.';
      setLocationStatus(`${message} בינתיים מוצגות תוצאות ברירת מחדל.`);
      await loadButchers(null);
      return;
    }

    setLocationStatus(`נמצא מיקום: ${formatLocation(result.location)}. מחפשים קצביות בגוגל...`);
    await loadButchers(result.location);
  }, [loadButchers]);

  useEffect(() => {
    void findNearMe();
  }, [findNearMe]);

  return (
    <AppScreen>
      <SectionTitle
        eyebrow="מציאת קצביות"
        title="קצביות קרובות אליכם"
        subtitle="הקצביות מוצגות לפי המיקום שלכם, עם תוצאות גוגל כשהחיבור פעיל."
      />

      <SmokeImage source={smokeImages.butcher} height={145} />

      <AppButton title={loading ? 'מחפש קצביות...' : 'מצא קצביות לידי'} onPress={findNearMe} />
      <AppButton title="פתחו הרשאות מיקום" variant="ghost" onPress={() => Linking.openSettings()} />
      <Text style={styles.status}>{locationStatus}</Text>

      <View style={styles.list}>
        {items.map((item) => (
          <AppCard key={item.id}>
            <View style={styles.topRow}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.rating}>{formatRating(item)}</Text>
            </View>
            <Text style={styles.address}>{item.address}</Text>
            {item.distanceMeters ? <Text style={styles.distance}>{formatDistance(item.distanceMeters)}</Text> : null}
            <Text style={styles.review}>{item.reviewHighlight}</Text>
            <AppButton
              title="פתחו מפה"
              variant="secondary"
              onPress={() => {
                const url = item.mapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name)}`;
                Linking.openURL(url);
              }}
            />
          </AppCard>
        ))}
      </View>
      <AppButton title="חזרה לרדאר" variant="secondary" onPress={() => router.push('/radar')} />
      <AppButton title="לעמוד הבית" variant="ghost" onPress={() => router.push('/')} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  status: {
    color: smokeColors.muted,
    fontSize: 15,
    lineHeight: 22,
    ...rtlBlockText,
  },
  topRow: {
    ...rtlRow,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  name: {
    flex: 1,
    color: smokeColors.text,
    fontSize: 23,
    fontWeight: '900',
    ...rtlText,
  },
  rating: {
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: '#2B140E',
    color: smokeColors.gold,
    fontSize: 13,
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 7,
    ...centerText,
  },
  address: {
    color: smokeColors.orange,
    fontSize: 15,
    fontWeight: '900',
    ...rtlText,
  },
  review: {
    color: smokeColors.muted,
    fontSize: 15,
    lineHeight: 23,
    ...rtlText,
  },
  distance: {
    color: smokeColors.gold,
    fontSize: 14,
    fontWeight: '900',
    ...rtlText,
  },
});

function formatLocation(location: UserLocation) {
  return `קו רוחב ${location.lat.toFixed(4)} | קו אורך ${location.lng.toFixed(4)}`;
}

function formatDistance(distanceMeters: number) {
  if (distanceMeters < 1000) {
    return `כ-${distanceMeters} מטר ממך`;
  }

  return `כ-${(distanceMeters / 1000).toFixed(1)} ק״מ ממך`;
}

function formatRating(item: Butcher) {
  const rating = item.rating === 'חדש' ? item.rating : `★ ${item.rating}`;
  return item.ratingCount ? `${rating} · ${item.ratingCount}` : rating;
}

function rankButchers(items: Butcher[]) {
  return [...items].sort((first, second) => {
    const scoreDiff = weightedButcherScore(second) - weightedButcherScore(first);

    if (Math.abs(scoreDiff) > 0.01) {
      return scoreDiff;
    }

    return (first.distanceMeters ?? Infinity) - (second.distanceMeters ?? Infinity);
  });
}

function weightedButcherScore(item: Butcher) {
  const rating = Number.parseFloat(item.rating);
  const ratingCount = Number(item.ratingCount ?? 0);

  if (!Number.isFinite(rating) || ratingCount <= 0) {
    return 0;
  }

  const baselineRating = 4.2;
  const baselineCount = 30;
  const bayesianRating = (rating * ratingCount + baselineRating * baselineCount) / (ratingCount + baselineCount);
  const confidenceBoost = Math.min(0.35, Math.log10(ratingCount + 1) * 0.08);

  return bayesianRating + confidenceBoost;
}
