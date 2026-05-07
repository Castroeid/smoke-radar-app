import { useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppScreen } from '@/components/AppScreen';
import { SectionTitle } from '@/components/SectionTitle';
import { SmokeImage } from '@/components/SmokeImage';
import { smokeImages } from '@/constants/smokeImages';
import { rtlRow, rtlText, smokeColors } from '@/constants/smokeTheme';
import { findNearbyButchers, type Butcher } from '@/services/smokeRadarService';

export default function ButcherScreen() {
  const [items, setItems] = useState<Butcher[]>([]);

  useEffect(() => {
    findNearbyButchers().then(setItems);
  }, []);

  return (
    <AppScreen>
      <SectionTitle
        eyebrow="מציאת קצביות"
        title="קצביות קרובות אליכם"
        subtitle="תוצאות קרובות לפי Google Places כשיש מפתח פעיל, עם fallback מקומי אם החיבור לא זמין."
      />

      <SmokeImage source={smokeImages.butcher} height={130} />

      <AppButton
        title="מצא קצביות לידי"
        onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query=%D7%A7%D7%A6%D7%91%D7%99%D7%94%20%D7%A7%D7%A8%D7%95%D7%91%D7%94%20%D7%90%D7%9C%D7%99%D7%99')}
      />

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
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
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
