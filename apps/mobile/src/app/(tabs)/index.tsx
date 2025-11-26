import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { FText } from '@/components/f-text';
import { FView } from '@/components/f-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <FView style={styles.titleContainer}>
        <FText type="title">Welcome!</FText>
        <HelloWave />
      </FView>
      <FView style={styles.stepContainer}>
        <FText type="subtitle">Step 1: Try it</FText>
        <FText>
          Edit <FText type="defaultSemiBold">app/(tabs)/index.tsx</FText> to see changes.
          Press{' '}
          <FText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </FText>{' '}
          to open developer tools.
        </FText>
      </FView>
      <FView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <FText type="subtitle">Step 2: Explore</FText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <FText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </FText>
      </FView>
      <FView style={styles.stepContainer}>
        <FText type="subtitle">Step 3: Get a fresh start</FText>
        <FText>
          {`When you're ready, run `}
          <FText type="defaultSemiBold">npm run reset-project</FText> to get a fresh{' '}
          <FText type="defaultSemiBold">app</FText> directory. This will move the current{' '}
          <FText type="defaultSemiBold">app</FText> to{' '}
          <FText type="defaultSemiBold">app-example</FText>.
        </FText>
      </FView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
