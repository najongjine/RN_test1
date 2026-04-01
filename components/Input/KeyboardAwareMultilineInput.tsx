import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Keyboard,
  Platform,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface KeyboardAwareMultilineInputProps
  extends Omit<TextInputProps, "multiline" | "style"> {
  minLines?: number;
  maxLines?: number;
  bottomSpacing?: number;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  onRequestScrollBy?: (delta: number) => void;
}

interface KeyboardFrame {
  screenY: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const KeyboardAwareMultilineInput = forwardRef<TextInput, KeyboardAwareMultilineInputProps>(
function KeyboardAwareMultilineInput(
  {
    minLines = 4,
    maxLines,
    bottomSpacing = 16,
    containerStyle,
    inputStyle,
    onRequestScrollBy,
    onFocus,
    onBlur,
    onContentSizeChange,
    scrollEnabled,
    numberOfLines,
    ...props
  },
  forwardedRef,
) {
  const innerRef = useRef<TextInput>(null);
  const containerRef = useRef<View>(null);
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [contentHeight, setContentHeight] = useState(0);
  const [containerY, setContainerY] = useState<number | null>(null);
  const [keyboardFrame, setKeyboardFrame] = useState<KeyboardFrame | null>(null);
  const keyboardFrameRef = useRef<KeyboardFrame | null>(null);
  const focusedRef = useRef(false);

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
  const maxHeightFromLines = maxLines
    ? maxLines * lineHeight + paddingTop + paddingBottom
    : Number.POSITIVE_INFINITY;
  const idealHeight = Math.max(contentHeight || 0, minHeight);

  const getResolvedHeight = useCallback((
    nextContainerY: number | null,
    keyboardScreenY = keyboardFrameRef.current?.screenY,
  ) => {
    if (nextContainerY === null) {
      return clamp(idealHeight, minHeight, maxHeightFromLines);
    }

    const keyboardTop = keyboardScreenY ?? windowHeight - insets.bottom;
    const availableHeight = keyboardTop - nextContainerY - bottomSpacing;

    return clamp(idealHeight, minHeight, Math.min(availableHeight, maxHeightFromLines));
  }, [bottomSpacing, idealHeight, insets.bottom, maxHeightFromLines, minHeight, windowHeight]);

  const syncLayout = useCallback((
    shouldRequestParentScroll = false,
    keyboardScreenY = keyboardFrameRef.current?.screenY,
  ) => {
    if (!containerRef.current?.measureInWindow) {
      return;
    }

    containerRef.current.measureInWindow((_, measuredY) => {
      setContainerY(measuredY);

      if (!shouldRequestParentScroll || !focusedRef.current || !onRequestScrollBy) {
        return;
      }

      const keyboardTop = keyboardScreenY ?? windowHeight - insets.bottom;
      const nextHeight = getResolvedHeight(measuredY, keyboardScreenY);
      const overlap = measuredY + nextHeight + bottomSpacing - keyboardTop;

      if (overlap > 1) {
        onRequestScrollBy(overlap);
      }
    });
  }, [bottomSpacing, getResolvedHeight, insets.bottom, onRequestScrollBy, windowHeight]);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      const nextKeyboardFrame = { screenY: event.endCoordinates.screenY };

      keyboardFrameRef.current = nextKeyboardFrame;
      setKeyboardFrame(nextKeyboardFrame);
      requestAnimationFrame(() => {
        syncLayout(true, nextKeyboardFrame.screenY);
      });
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      keyboardFrameRef.current = null;
      setKeyboardFrame(null);
      requestAnimationFrame(() => {
        syncLayout(false);
      });
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [syncLayout]);

  useEffect(() => {
    requestAnimationFrame(() => {
      syncLayout(false);
    });
  }, [contentHeight, syncLayout, windowHeight]);

  const resolvedHeight = getResolvedHeight(containerY, keyboardFrame?.screenY);
  const shouldEnableInnerScroll = idealHeight > resolvedHeight + 1;

  return (
    <View
      ref={containerRef}
      onLayout={() => {
        requestAnimationFrame(() => {
          syncLayout(false);
        });
      }}
      style={[
        styles.container,
        containerStyle,
        { minHeight: resolvedHeight, height: resolvedHeight },
      ]}
    >
      <TextInput
        {...props}
        ref={innerRef}
        multiline
        numberOfLines={numberOfLines ?? minLines}
        onFocus={(event) => {
          focusedRef.current = true;
          requestAnimationFrame(() => {
            syncLayout(true);
          });
          onFocus?.(event);
        }}
        onBlur={(event) => {
          focusedRef.current = false;
          onBlur?.(event);
        }}
        onContentSizeChange={(event) => {
          setContentHeight(event.nativeEvent.contentSize.height + paddingTop + paddingBottom);
          requestAnimationFrame(() => {
            syncLayout(focusedRef.current);
          });
          onContentSizeChange?.(event);
        }}
        scrollEnabled={scrollEnabled ?? shouldEnableInnerScroll}
        textAlignVertical="top"
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

export default KeyboardAwareMultilineInput;
