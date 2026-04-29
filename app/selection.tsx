import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function SelectionScreen() {
  const { meat } = useLocalSearchParams<{ meat?: string }>();
  const selectedMeat = typeof meat === 'string' && meat.length > 0 ? meat : 'נתח לא ידוע';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>בחר מה ממשיכים עכשיו</Text>
      <Text style={styles.selectedMeat}>הנתח שבחרת: {selectedMeat}</Text>

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={() => router.push({ pathname: '/recipe', params: { meat: selectedMeat } })}>
          <Text style={styles.primaryButtonText}>מחולל מתכון</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.push('/expert')}>
          <Text style={styles.secondaryButtonText}>שאל את המומחה</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.push('/butcher')}>
          <Text style={styles.secondaryButtonText}>מצא קצביה קרובה</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090909', paddingHorizontal: 20, paddingTop: 40 },
  title: { color: '#F7F7F7', fontSize: 30, fontWeight: '800', textAlign: 'right' },
  selectedMeat: { color: '#FF9B4A', fontSize: 20, marginTop: 16, textAlign: 'right' },
  actions: { marginTop: 32, gap: 14 },
  primaryButton: { minHeight: 56, borderRadius: 14, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF7A1A' },
  primaryButtonText: { color: '#111', fontSize: 18, fontWeight: '800' },
  secondaryButton: { minHeight: 56, borderRadius: 14, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1B1B1B', borderColor: '#2A2A2A', borderWidth: 1 },
  secondaryButtonText: { color: '#F2F2F2', fontSize: 17, fontWeight: '700' },
});
