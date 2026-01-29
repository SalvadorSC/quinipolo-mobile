import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

const Background: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.backgroundLayer} />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1d7fb5',
    zIndex: 0,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});

export default Background;
