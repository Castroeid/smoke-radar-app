import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function SelectionScreen() {
  const { meat } = useLocalSearchParams<{ meat?: string }>();
  const selectedMeat = typeof meat === 'string' && meat.length > 0 ? meat : 'Unknown Cut';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected Cut</Text>
      <Text style={styles.selectedMeat}>{selectedMeat}</Text>
      <Text style={styles.subtitle}>Let’s build your cook</Text>

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Generate Recipe</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Ask the Expert</Text>
        </Pressable>
      </View>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back to Radar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090909',
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 28,
  },
  title: {
    color: '#F7F7F7',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  selectedMeat: {
    color: '#FF9B4A',
    fontSize: 26,
    fontWeight: '700',
    marginTop: 16,
  },
  subtitle: {
    color: '#B2B2B2',
    fontSize: 16,
    marginTop: 8,
  },
  actions: {
    marginTop: 40,
    gap: 14,
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF7A1A',
  },
  primaryButtonText: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    minHeight: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B1B1B',
    borderColor: '#2A2A2A',
    borderWidth: 1,
  },
  secondaryButtonText: {
    color: '#F2F2F2',
    fontSize: 16,
    fontWeight: '700',
  },
  backButton: {
    marginTop: 'auto',
    minHeight: 54,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    backgroundColor: '#111111',
  },
  backButtonText: {
    color: '#F2F2F2',
    fontSize: 16,
    fontWeight: '700',
  },
});
