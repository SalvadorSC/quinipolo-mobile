import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SegmentedButtons, SegmentedButtonsProps } from 'react-native-paper';
import { colors } from '../styles/globalStyles';

interface SegmentedButtonGroupProps
  extends Omit<SegmentedButtonsProps, 'style'> {
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  whiteBackground?: boolean;
}

const SegmentedButtonGroup: React.FC<SegmentedButtonGroupProps> = ({
  style,
  containerStyle,
  whiteBackground = true,
  ...segmentedButtonsProps
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <SegmentedButtons
        {...segmentedButtonsProps}
        style={[
          styles.segmentedButton,
          whiteBackground && styles.whiteBackground,
          style,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden', // Ensure child respects border radius
  },
  segmentedButton: {
    borderRadius: 20, // 20px border radius
  },
  whiteBackground: {
    backgroundColor: '#FFFFFF',
  },
});

export default SegmentedButtonGroup;
