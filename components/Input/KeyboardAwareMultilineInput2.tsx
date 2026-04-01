import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Platform,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface KeyboardAwareMultilineInputProps
  extends Omit<TextInputProps, "multiline" | "style"> {
  minLines?: number;
  maxLines?: number;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const CHANGE_EPSILON = 1;

const KeyboardAwareMultilineInput2 = forwardRef<
  TextInput,
  KeyboardAwareMultilineInputProps
>(function KeyboardAwareMultilineInput(
  {
    minLines = 4,
    maxLines,
    containerStyle,
    inputStyle,
    onContentSizeChange,
    scrollEnabled,
    numberOfLines,
    ...props
  },
  forwardedRef,
) {
  const innerRef = useRef<TextInput>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current as TextInput);

  const flattenedInputStyle = StyleSheet.flatten(inputStyle) ?? {};

  const lineHeight =
    typeof flattenedInputStyle.lineHeight === "number"
      ? flattenedInputStyle.lineHeight
      : 22;

  const paddingTop =
    typeof flattenedInputStyle.paddingTop === "number"
      ? flattenedInputStyle.paddingTop
      : typeof flattenedInputStyle.paddingVertical === "number"
        ? flattenedInputStyle.paddingVertical
        : 12;

  const paddingBottom =
    typeof flattenedInputStyle.paddingBottom === "number"
      ? flattenedInputStyle.paddingBottom
      : typeof flattenedInputStyle.paddingVertical === "number"
        ? flattenedInputStyle.paddingVertical
        : 12;

  const minHeight = minLines * lineHeight + paddingTop + paddingBottom;
  const maxHeight = maxLines
    ? maxLines * lineHeight + paddingTop + paddingBottom
    : Number.POSITIVE_INFINITY;

  const [inputHeight, setInputHeight] = useState(minHeight);

  const shouldEnableInnerScroll =
    maxLines !== undefined && inputHeight >= maxHeight - CHANGE_EPSILON;

  return (
    <View
      style={[
        styles.container,
        containerStyle,
        {
          minHeight,
          height: clamp(inputHeight, minHeight, maxHeight),
        },
      ]}
    >
      <TextInput
        {...props}
        ref={innerRef}
        multiline
        numberOfLines={numberOfLines ?? minLines}
        textAlignVertical="top"
        onContentSizeChange={(event) => {
          const nextHeight = event.nativeEvent.contentSize.height;

          setInputHeight((prevHeight) => {
            const clampedHeight = clamp(nextHeight, minHeight, maxHeight);

            if (Math.abs(prevHeight - clampedHeight) <= CHANGE_EPSILON) {
              return prevHeight;
            }

            return clampedHeight;
          });

          onContentSizeChange?.(event);
        }}
        scrollEnabled={
          scrollEnabled ??
          (Platform.OS === "ios" ? true : shouldEnableInnerScroll)
        }
        style={[
          styles.input,
          {
            lineHeight,
            paddingTop,
            paddingBottom,
          },
          inputStyle,
        ]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});

export default KeyboardAwareMultilineInput2;