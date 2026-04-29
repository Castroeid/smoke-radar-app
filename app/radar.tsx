import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getTrendingCuts } from '@/services/smokeRadarService';

export default function RadarScreen() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    getTrendingCuts().then(setItems);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>מה חם עכשיו</Text>
      <Text style={styles.subtitle}>בחר נתח והמשך למסלול הבא</Text>
      <View style={styles.cardsWrapper}>
        {items.map((item) => (
          <Pressable key={item.id} style={styles.card} onPress={() => router.push({ pathname: '/selection', params: { meat: item.title } })}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.momentum}>מומנטום {item.momentum}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090909', paddingHorizontal: 20, paddingTop: 30 },
  header: { color: '#F7F7F7', fontSize: 30, fontWeight: '800', textAlign: 'right' },
  subtitle: { color: '#9D9D9D', fontSize: 15, marginTop: 8, marginBottom: 24, textAlign: 'right' },
  cardsWrapper: { gap: 14 },
  card: { backgroundColor: '#141414', borderColor: '#2A2A2A', borderWidth: 1, borderRadius: 16, padding: 16 },
  cardTitle: { color: '#F2F2F2', fontSize: 22, fontWeight: '700', textAlign: 'right' },
  description: { color: '#B2B2B2', fontSize: 14, lineHeight: 20, textAlign: 'right' },
  momentum: { marginTop: 10, color: '#FF9B4A', fontSize: 13, fontWeight: '600', textAlign: 'right' },
});
