import { Image, type ImageContentFit, type ImageSource } from 'expo-image';
import { StyleSheet, View } from 'react-native';

type SmokeImageProps = {
  source: ImageSource | string | number | ImageSource[] | string[] | null;
  height?: number;
  contentFit?: ImageContentFit;
};

export function SmokeImage({ source, height = 180, contentFit = 'cover' }: SmokeImageProps) {
  return (
    <View style={[styles.image, { height }]}>
      <Image
        source={source}
        style={StyleSheet.absoluteFill}
        contentFit={contentFit}
        transition={0}
        cachePolicy="memory-disk"
        priority="high"
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
