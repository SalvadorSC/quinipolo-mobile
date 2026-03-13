import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import DarkBg from '../../assets/light_bg.svg';

const Background: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { width, height } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <DarkBg
        width={width}
        height={height}
        preserveAspectRatio="xMidYMid slice"
        style={styles.svg}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  svg: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
  },
});

export default Background;
