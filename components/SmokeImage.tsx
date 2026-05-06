import { ImageBackground, StyleSheet, View } from 'react-native';

type SmokeImageProps = {
  source: string;
  height?: number;
};

export function SmokeImage({ source, height = 180 }: SmokeImageProps) {
  return (
    <ImageBackground source={{ uri: source }} style={[styles.image, { height }]} imageStyle={styles.imageRadius}>
      <View style={styles.overlay} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: {
    overflow: 'hidden',
    borderRadius: 22,
    backgroundColor: '#120B08',
  },
  imageRadius: {
    borderRadius: 22,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 6, 5, 0.28)',
  },
});
