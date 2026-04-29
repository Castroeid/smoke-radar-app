import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ResultScreen() {
  const { source, payload } = useLocalSearchParams<{ source?: string; payload?: string }>();
  const isRecipe = source === 'recipe';
  const recipe = isRecipe && payload ? JSON.parse(payload) : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{isRecipe ? 'המתכון שלך מוכן' : 'תשובת המומחה'}</Text>
      {isRecipe && recipe ? (
        <View style={styles.card}>
          <Text style={styles.heading}>{recipe.title}</Text>
          <Text style={styles.summary}>{recipe.summary}</Text>
          {recipe.steps.map((s: string, i: number) => <Text key={s} style={styles.step}>{i + 1}. {s}</Text>)}
        </View>
      ) : (
        <View style={styles.card}><Text style={styles.step}>{payload}</Text></View>
      )}
      <Pressable style={styles.button} onPress={() => router.push('/radar')}><Text style={styles.buttonText}>חזרה לרדאר</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090909' },
  content: { padding: 20, gap: 14 },
  title: { color: '#F7F7F7', fontSize: 28, fontWeight: '800', textAlign: 'right' },
  card: { backgroundColor: '#171717', borderRadius: 12, borderWidth: 1, borderColor: '#2A2A2A', padding: 14, gap: 8 },
  heading: { color: '#fff', fontSize: 20, fontWeight: '700', textAlign: 'right' },
  summary: { color: '#FF9B4A', textAlign: 'right' },
  step: { color: '#ddd', lineHeight: 22, textAlign: 'right' },
  button: { backgroundColor: '#FF7A1A', borderRadius: 12, padding: 16, alignItems: 'center' },
  buttonText: { color: '#111', fontSize: 18, fontWeight: '800' },
});
