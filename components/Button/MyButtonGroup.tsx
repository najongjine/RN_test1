import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

type Direction = "row" | "column";
type MainAlign = "start" | "center" | "end" | "between" | "around" | "evenly";
type CrossAlign = "start" | "center" | "end" | "stretch";

interface MyButtonGroupProps {
  direction?: Direction;
  justify?: MainAlign;
  align?: CrossAlign;
  gap?: number;
  margin?: number;
  fullWidth?: boolean;
  style?: ViewStyle;
  children: React.ReactNode;
}

const justifyMap = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
} as const;

const alignMap = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
} as const;

export default function MyButtonGroup({
  direction = "row",
  justify = "start",
  align = "center",
  gap = 8,
  margin = 2,
  fullWidth = false,
  style,
  children,
}: MyButtonGroupProps) {
  return (
    <View
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        {
          flexDirection: direction,
          justifyContent: justifyMap[justify],
          alignItems: alignMap[align],
          gap,
          margin,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  fullWidth: {
    width: "100%",
  },
});
