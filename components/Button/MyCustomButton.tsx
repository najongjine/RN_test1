/*
 React Native Expo + TypeScript에서 재사용 가능한 버튼 컴포넌트를 
components/Button/MyCustomButton.tsx
여기에 만들어줘.

조건:
- props: label, onPress, color, align, size
- align: left | center | right
- size 기본값: width 100%
- size는 small, medium, large 프리셋 지원
- color 기본값 지정
- 부모 block 기준 정렬되게
- StyleSheet 사용
- 초보자도 이해 가능하게 


야, margin도 넣을수 있냐?
 */
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ButtonAlign = "left" | "center" | "right";
type ButtonSize = "small" | "medium" | "large";

interface MyCustomButtonProps {
  label: string;
  onPress: () => void;
  color?: string;
  align?: ButtonAlign;
  size?: ButtonSize;
  margin?: number;
}

const DEFAULT_COLOR = "#2563EB";

const sizeStyles = {
  small: "40%",
  medium: "70%",
  large: "100%",
} as const;

const alignStyles = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
} as const;

export default function MyCustomButton({
  label,
  onPress,
  color = DEFAULT_COLOR,
  align = "left",
  size = "large",
  margin = 1,
}: MyCustomButtonProps) {
  return (
    <View style={[styles.wrapper, { alignItems: alignStyles[align], margin }]}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: color,
            width: sizeStyles[size],
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
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
