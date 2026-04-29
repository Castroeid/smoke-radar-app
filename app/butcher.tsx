import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { findNearbyButchers } from '@/services/smokeRadarService';

export default function ButcherScreen() {
  const [items, setItems] = useState<{ name: string; distance: string }[]>([]);
  useEffect(() => { findNearbyButchers().then(setItems); }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>קצביות קרובות אליך</Text>
      {items.map((b) => (
        <View style={styles.row} key={b.name}>
          <Text style={styles.distance}>{b.distance}</Text>
          <Text style={styles.name}>{b.name}</Text>
        </View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090909', padding: 20, gap: 12 },
  title: { color: '#F7F7F7', fontSize: 28, fontWeight: '800', textAlign: 'right' },
  row: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#171717', borderRadius: 12, padding: 14 },
  name: { color: '#fff', fontSize: 17 },
  distance: { color: '#FF9B4A', fontSize: 15 },
});
