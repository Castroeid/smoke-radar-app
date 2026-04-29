import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { generateRecipe } from '@/services/smokeRadarService';

export default function RecipeScreen() {
  const { meat } = useLocalSearchParams<{ meat?: string }>();
  const selectedMeat = typeof meat === 'string' ? meat : 'בריסקט';
  const [step, setStep] = useState(1);
  const [style, setStyle] = useState('מעושן קלאסי');
  const [level, setLevel] = useState('קל');

  const onGenerate = async () => {
    const recipe = await generateRecipe({ meat: selectedMeat, style, level });
    router.push({ pathname: '/result', params: { source: 'recipe', payload: JSON.stringify(recipe) } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>מחולל מתכון ל-{selectedMeat}</Text>
      {step === 1 && (
        <>
          <Text style={styles.label}>שלב 1: בחר סגנון</Text>
          <Pressable style={styles.option} onPress={() => setStyle('מעושן קלאסי')}><Text style={styles.text}>מעושן קלאסי</Text></Pressable>
          <Pressable style={styles.option} onPress={() => setStyle('מתקתק-חריף')}><Text style={styles.text}>מתקתק-חריף</Text></Pressable>
          <Pressable style={styles.button} onPress={() => setStep(2)}><Text style={styles.buttonText}>המשך</Text></Pressable>
        </>
      )}
      {step === 2 && (
        <>
          <Text style={styles.label}>שלב 2: רמת ניסיון</Text>
          <Pressable style={styles.option} onPress={() => setLevel('קל')}><Text style={styles.text}>קל</Text></Pressable>
          <Pressable style={styles.option} onPress={() => setLevel('מתקדם')}><Text style={styles.text}>מתקדם</Text></Pressable>
          <Pressable style={styles.button} onPress={onGenerate}><Text style={styles.buttonText}>צור מתכון</Text></Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090909', padding: 20, gap: 12 },
  title: { color: '#F7F7F7', fontSize: 28, fontWeight: '800', textAlign: 'right' },
  label: { color: '#BDBDBD', fontSize: 17, marginTop: 6, textAlign: 'right' },
  option: { backgroundColor: '#171717', borderWidth: 1, borderColor: '#2A2A2A', borderRadius: 12, padding: 14 },
  text: { color: '#F2F2F2', fontSize: 17, textAlign: 'right' },
  button: { backgroundColor: '#FF7A1A', borderRadius: 12, padding: 16, marginTop: 8, alignItems: 'center' },
  buttonText: { color: '#111', fontSize: 18, fontWeight: '800' },
});
