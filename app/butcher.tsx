import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppScreen } from '@/components/AppScreen';
import { SectionTitle } from '@/components/SectionTitle';
import { SmokeImage } from '@/components/SmokeImage';
import { smokeImages } from '@/constants/smokeImages';
import { centerBlockText, rtlRow, rtlText, smokeColors } from '@/constants/smokeTheme';
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
      setItems(results);
      if (location) {
        const hasGoogleResults = results.some((item) => item.source === 'google');
        setLocationStatus(
          hasGoogleResults
            ? `נמצא מיקום: ${formatLocation(location)}. מוצגות תוצאות אמיתיות מ-Google Places.`
            : `נמצא מיקום: ${formatLocation(location)}, אבל Google Places לא החזיר קצביות אמיתיות. מוצגות תוצאות ברירת מחדל.`
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

    setLocationStatus(`נמצא מיקום: ${formatLocation(result.location)}. מחפשים ב-Google Places...`);
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
        subtitle="תוצאות קרובות לפי Google Places כשיש מפתח פעיל, עם fallback מקומי אם החיבור לא זמין."
      />

      <SmokeImage source={smokeImages.butcher} height={130} />

      <AppButton title={loading ? 'מחפש קצביות...' : 'מצא קצביות לידי'} onPress={findNearMe} />
      <AppButton title="פתחו הרשאות מיקום" variant="ghost" onPress={() => Linking.openSettings()} />
      <Text style={styles.status}>{locationStatus}</Text>

      <View style={styles.list}>
        {items.map((item) => (
          <AppCard key={item.id}>
            <View style={styles.topRow}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.rating}>★ {item.rating}</Text>
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
    ...centerBlockText,
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
