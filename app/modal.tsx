import { router } from 'expo-router';

import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppScreen } from '@/components/AppScreen';
import { SectionTitle } from '@/components/SectionTitle';

export default function ModalScreen() {
  return (
    <AppScreen scroll={false}>
      <SectionTitle title="Smoke Radar" subtitle="אפליקציית בשר, עשן והשראה בעברית." />
      <AppCard>
        <AppButton title="חזרה לבית" onPress={() => router.push('/')} />
      </AppCard>
    </AppScreen>
  );
}
