import { Image } from "expo-image";
import { Platform, StyleSheet } from "react-native";

import { Collapsible } from "@/components/ui/collapsible";
import { ExternalLink } from "@/components/external-link";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { FText } from "@/components/f-text";
import { FView } from "@/components/f-view";
import { Fonts } from "@/constants/theme";
import { ChevronRight } from "lucide-react-native";

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <ChevronRight size={310} color="#808080" style={styles.headerImage} />
      }
    >
      <FView style={styles.titleContainer}>
        <FText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Explore
        </FText>
      </FView>
      <FText>This app includes example code to help you get started.</FText>
      <Collapsible title="File-based routing">
        <FText>
          This app has two screens:{" "}
          <FText type="defaultSemiBold">app/(tabs)/index.tsx</FText> and{" "}
          <FText type="defaultSemiBold">app/(tabs)/explore.tsx</FText>
        </FText>
        <FText>
          The layout file in{" "}
          <FText type="defaultSemiBold">app/(tabs)/_layout.tsx</FText> sets up
          the tab navigator.
        </FText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <FText type="link">Learn more</FText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <FText>
          You can open this project on Android, iOS, and the web. To open the
          web version, press <FText type="defaultSemiBold">w</FText> in the
          terminal running this project.
        </FText>
      </Collapsible>
      <Collapsible title="Images">
        <FText>
          For static images, you can use the{" "}
          <FText type="defaultSemiBold">@2x</FText> and{" "}
          <FText type="defaultSemiBold">@3x</FText> suffixes to provide files
          for different screen densities
        </FText>
        <Image
          source={require("@assets/images/react-logo.png")}
          style={{ width: 100, height: 100, alignSelf: "center" }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <FText type="link">Learn more</FText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <FText>
          This template has light and dark mode support. The{" "}
          <FText type="defaultSemiBold">useColorScheme()</FText> hook lets you
          inspect what the user&apos;s current color scheme is, and so you can
          adjust UI colors accordingly.
        </FText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <FText type="link">Learn more</FText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <FText>
          This template includes an example of an animated component. The{" "}
          <FText type="defaultSemiBold">components/HelloWave.tsx</FText>{" "}
          component uses the powerful{" "}
          <FText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
            react-native-reanimated
          </FText>{" "}
          library to create a waving hand animation.
        </FText>
        {Platform.select({
          ios: (
            <FText>
              The{" "}
              <FText type="defaultSemiBold">
                components/ParallaxScrollView.tsx
              </FText>{" "}
              component provides a parallax effect for the header image.
            </FText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
