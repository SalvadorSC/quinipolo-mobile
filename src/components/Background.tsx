import React, { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BACKGROUND = '#1d7fb5';

type BackgroundProps = {
  children: React.ReactNode;
  /**
   * Pad for the gesture bar. Screens inside the tab bar should leave this
   * off so the tab bar owns the bottom inset.
   */
  safeBottom?: boolean;
};

const Background: React.FC<BackgroundProps> = ({
  children,
  safeBottom = false,
}) => {
  const insets = useSafeAreaInsets();
  const clipId = `bgclip${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const contentInset = {
    paddingTop: insets.top,
    paddingBottom: safeBottom ? insets.bottom : 0,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  return (
    <View style={styles.container}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 373 768"
        preserveAspectRatio="xMidYMid slice"
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <ClipPath id={clipId}>
            <Rect x={0.28} y={0} width={372.45} height={768} />
          </ClipPath>
        </Defs>
        <Rect x={0} y={0} width={373} height={768} fill={BACKGROUND} />
        <G clipPath={`url(#${clipId})`}>
          <Path d="M-5.88-6.36h384.75v780.72H-5.88z" fill="#1d7fb5" />
          <Path
            d="M-5.88 87.07c11.56-3.13 23.62-5.42 36.22-6.71 118.27-12.15 200.17 92.2 299.93 111.63 16.19 3.15 32.4 6.21 48.61 8.95v420.79l-384.75 1.24V87.07Z"
            fill="#236bad"
            fillRule="evenodd"
          />
          <Path
            d="M378.88 426.23c-11.56-3.55-23.62-6.14-36.22-7.61-118.27-13.77-200.17 104.48-299.93 126.5-16.19 3.57-32.4 7.03-48.61 10.14v251.22l384.75-23.63v-356.62Z"
            fill="#235387"
            fillRule="evenodd"
          />
        </G>
      </Svg>
      <View style={[styles.content, contentInset]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  content: {
    flex: 1,
  },
});

export default Background;
