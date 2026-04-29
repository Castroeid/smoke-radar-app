import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const TRENDING_ITEMS = [
  {
    title: 'Brisket',
    description: 'Low-and-slow favorite with rich bark appeal.',
    momentum: '+87%',
  },
  {
    title: 'Short Ribs',
    description: 'Bold marbling trends for late-night cooks.',
    momentum: '+74%',
  },
  {
    title: 'Picanha',
    description: 'Fast-growing cut for premium backyard menus.',
    momentum: '+69%',
  },
  {
    title: 'Smoked Lamb Shoulder',
    description: 'Rising pick for deep flavor and share plates.',
    momentum: '+61%',
  },
];

export default function RadarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>TRENDING NOW</Text>
      <Text style={styles.subtitle}>Choose what’s hot for tonight</Text>

      <View style={styles.cardsWrapper}>
        {TRENDING_ITEMS.map((item) => (
          <View key={item.title} style={styles.card}>
            <View style={styles.cardTopRow}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.arrow}>↗</Text>
            </View>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.momentum}>Momentum {item.momentum}</Text>
          </View>
        ))}
      </View>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090909',
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 28,
  },
  header: {
    color: '#F7F7F7',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  subtitle: {
    color: '#9D9D9D',
    fontSize: 15,
    marginTop: 8,
    marginBottom: 24,
  },
  cardsWrapper: {
    gap: 14,
  },
  card: {
    backgroundColor: '#141414',
    borderColor: '#1F1F1F',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    color: '#F2F2F2',
    fontSize: 18,
    fontWeight: '700',
  },
  arrow: {
    color: '#FF7A1A',
    fontSize: 18,
    fontWeight: '800',
  },
  description: {
    color: '#B2B2B2',
    fontSize: 14,
    lineHeight: 20,
  },
  momentum: {
    marginTop: 10,
    color: '#FF9B4A',
    fontSize: 13,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 'auto',
    backgroundColor: '#1B1B1B',
    borderRadius: 999,
    minHeight: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  backText: {
    color: '#F2F2F2',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
