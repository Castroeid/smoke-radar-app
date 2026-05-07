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
    } finally {
      setLoading(false);
    }
  }, []);

  const findNearMe = useCallback(async () => {
    setLocationStatus('מבקשים מיקום ומחפשים קצביות קרובות...');
    const result = await requestUserLocation();

    if (!result.location) {
      const message =
        result.reason === 'services-disabled'
          ? 'שירותי המיקום כבויים בטלפון. הפעילו Location במכשיר ונסו שוב.'
          : result.reason === 'permission-denied' && result.canAskAgain === false
            ? 'הרשאת המיקום חסומה ל-Expo Go. פתחו הגדרות ואפשרו Location.'
            : 'לא התקבלה הרשאת מיקום. לחצו שוב ואשרו מיקום, או בדקו הרשאות בטלפון.';
      setLocationStatus(`${message} בינתיים מוצגות תוצאות ברירת מחדל.`);
      await loadButchers(null);
      return;
    }

    setLocationStatus('מציגים קצביות לפי המיקום הנוכחי שלכם.');
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
});
