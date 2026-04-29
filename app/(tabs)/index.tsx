import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.badge}>Smoke Radar</Text>
        <Text style={styles.title}>ברוכים הבאים לרדאר העשן</Text>
        <Text style={styles.subtitle}>מגלים מה חם עכשיו ומתקדמים למסלול שמתאים בדיוק לארוחה שלך.</Text>
        <Pressable style={styles.button} onPress={() => router.push('/radar')}>
          <Text style={styles.buttonText}>התחל רדאר</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090909' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, gap: 16 },
  badge: { color: '#FF9B4A', fontSize: 14, textAlign: 'right' },
  title: { color: '#F5F5F5', fontSize: 34, fontWeight: '800', textAlign: 'right', lineHeight: 42 },
  subtitle: { color: '#B4B4B4', fontSize: 16, textAlign: 'right', lineHeight: 24 },
  button: { backgroundColor: '#FF6A00', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 6 },
  buttonText: { color: '#111', fontSize: 18, fontWeight: '800' },
});
