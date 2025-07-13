import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../../theme";

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.bar,
          {
            width: `${Math.max(0, Math.min(progress, 1)) * 100}%`,
            backgroundColor: color || colors.light.primary,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 8,
    backgroundColor: colors.light.disabled,
    borderRadius: 4,
    overflow: "hidden",
  },
  bar: {
    height: 8,
    borderRadius: 4,
  },
});
