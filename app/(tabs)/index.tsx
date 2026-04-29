import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>SMOKE RADAR</Text>
        <Text style={styles.subtitle}>What’s hot right now in meat</Text>
        <Pressable style={styles.button} onPress={() => router.push('/radar')}>
          <Text style={styles.buttonText}>Start Radar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0B',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 14,
  },
  title: {
    color: '#F5F5F5',
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    color: '#A8A8A8',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 22,
  },
  button: {
    backgroundColor: '#FF6A00',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 999,
    minWidth: 190,
    alignItems: 'center',
  },
  buttonText: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
