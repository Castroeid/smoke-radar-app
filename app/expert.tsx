import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { askExpert } from '@/services/smokeRadarService';

export default function ExpertScreen() {
  const [question, setQuestion] = useState('איך לשמור על סטייק עסיסי?');
  const [loading, setLoading] = useState(false);

  const onAsk = async () => {
    setLoading(true);
    const answer = await askExpert(question);
    setLoading(false);
    router.push({ pathname: '/result', params: { source: 'expert', payload: answer } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>שאל את מומחה הבשרים</Text>
      <TextInput style={styles.input} value={question} onChangeText={setQuestion} placeholder="כתוב כאן שאלה" placeholderTextColor="#7f7f7f" multiline textAlign="right" />
      <Pressable style={styles.button} onPress={onAsk}><Text style={styles.buttonText}>{loading ? 'טוען...' : 'קבל תשובה'}</Text></Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090909', padding: 20, gap: 14 },
  title: { color: '#F7F7F7', fontSize: 28, fontWeight: '800', textAlign: 'right' },
  input: { minHeight: 140, borderRadius: 12, backgroundColor: '#171717', borderWidth: 1, borderColor: '#2A2A2A', color: '#fff', padding: 14 },
  button: { backgroundColor: '#FF7A1A', borderRadius: 12, padding: 16, alignItems: 'center' },
  buttonText: { color: '#111', fontSize: 18, fontWeight: '800' },
});
