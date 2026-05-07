import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

type SmokeImageProps = {
  source: string;
  height?: number;
};

export function SmokeImage({ source, height = 180 }: SmokeImageProps) {
  return (
    <View style={[styles.image, { height }]}>
      <Image
        source={source}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={260}
        cachePolicy="disk"
        placeholder={{ blurhash: 'L25O6[0L4T~W4TMyx[t7M{Rj00IV' }}
      />
      <View style={styles.overlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    overflow: 'hidden',
    borderRadius: 22,
    backgroundColor: '#120B08',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 6, 5, 0.28)',
  },
});
