import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

type ButtonSize = "small" | "medium" | "large";

interface MyCustomButtonProps {
  label: string;
  onPress: () => void;
  color?: string;
  size?: ButtonSize;
  style?: ViewStyle;
}

const DEFAULT_COLOR = "#2563EB";

const sizeStyles = {
  small: 90,
  medium: 140,
  large: 220,
} as const;

export default function MyCustomButton({
  label,
  onPress,
  color = DEFAULT_COLOR,
  size = "medium",
  style,
}: MyCustomButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: color,
          width: sizeStyles[size],
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
