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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const CHANGE_EPSILON = 1;

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

    const focusedRef = useRef(false);
    const keyboardScreenYRef = useRef<number | null>(null);
    const anchorYRef = useRef<number | null>(null);
    const contentHeightRef = useRef(0);
    const resolvedHeightRef = useRef(0);

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

    const [contentHeight, setContentHeight] = useState(minHeight);
    const [resolvedHeight, setResolvedHeight] = useState(minHeight);

    const getIdealHeight = useCallback(() => {
      return Math.max(contentHeightRef.current || minHeight, minHeight);
    }, [minHeight]);

    const updateResolvedHeight = useCallback(
      (nextHeight: number) => {
        if (Math.abs(resolvedHeightRef.current - nextHeight) <= CHANGE_EPSILON) {
          return;
        }

        resolvedHeightRef.current = nextHeight;
        setResolvedHeight(nextHeight);
      },
      [],
    );

    const resetToContentHeight = useCallback(() => {
      const nextHeight = clamp(getIdealHeight(), minHeight, maxHeightFromLines);
      updateResolvedHeight(nextHeight);
    }, [getIdealHeight, maxHeightFromLines, minHeight, updateResolvedHeight]);

    const recalculateLayout = useCallback(
      (shouldRequestParentScroll = false) => {
        if (!containerRef.current?.measureInWindow) {
          resetToContentHeight();
          return;
        }

        containerRef.current.measureInWindow((_, measuredY) => {
          const keyboardScreenY = keyboardScreenYRef.current;
          const keyboardVisible = keyboardScreenY !== null;

          if (!keyboardVisible) {
            anchorYRef.current = null;
            resetToContentHeight();
            return;
          }

          const anchorY =
            anchorYRef.current === null ? measuredY : anchorYRef.current;
          anchorYRef.current = anchorY;

          const availableHeight = keyboardScreenY - anchorY - bottomSpacing;
          const nextHeight = clamp(
            getIdealHeight(),
            minHeight,
            Math.min(availableHeight, maxHeightFromLines),
          );

          updateResolvedHeight(nextHeight);

          if (!shouldRequestParentScroll || !focusedRef.current || !onRequestScrollBy) {
            return;
          }

          const overlap = measuredY + nextHeight + bottomSpacing - keyboardScreenY;

          if (overlap > CHANGE_EPSILON) {
            onRequestScrollBy(overlap);
          }
        });
      },
      [
        bottomSpacing,
        getIdealHeight,
        maxHeightFromLines,
        minHeight,
        onRequestScrollBy,
        resetToContentHeight,
        updateResolvedHeight,
      ],
    );

    useEffect(() => {
      const showEvent = Platform.OS === "ios" ? "keyboardDidShow" : "keyboardDidShow";
      const hideEvent = Platform.OS === "ios" ? "keyboardDidHide" : "keyboardDidHide";

      const showSubscription = Keyboard.addListener(showEvent, (event) => {
        keyboardScreenYRef.current = event.endCoordinates.screenY;
        anchorYRef.current = null;
        requestAnimationFrame(() => {
          recalculateLayout(true);
        });
      });

      const hideSubscription = Keyboard.addListener(hideEvent, () => {
        keyboardScreenYRef.current = null;
        anchorYRef.current = null;
        resetToContentHeight();
      });

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, [recalculateLayout, resetToContentHeight]);

    useEffect(() => {
      if (Platform.OS === "ios") {
        return;
      }

      if (keyboardScreenYRef.current !== null) {
        recalculateLayout(false);
        return;
      }

      resetToContentHeight();
    }, [insets.bottom, recalculateLayout, resetToContentHeight, windowHeight]);

    const shouldEnableInnerScroll =
      Platform.OS === "ios"
        ? true
        : contentHeight > resolvedHeight + CHANGE_EPSILON;

    return (
      <View
        ref={containerRef}
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
            anchorYRef.current = null;
            requestAnimationFrame(() => {
              recalculateLayout(true);
            });
            onFocus?.(event);
          }}
          onBlur={(event) => {
            focusedRef.current = false;
            anchorYRef.current = null;
            onBlur?.(event);
          }}
          onContentSizeChange={(event) => {
            const nextContentHeight = event.nativeEvent.contentSize.height;

            if (Math.abs(contentHeightRef.current - nextContentHeight) > CHANGE_EPSILON) {
              contentHeightRef.current = nextContentHeight;
              setContentHeight(nextContentHeight);
            }

            resetToContentHeight();

            onContentSizeChange?.(event);
          }}
          scrollEnabled={scrollEnabled ?? (Platform.OS === "ios" ? true : shouldEnableInnerScroll)}
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
  },
);

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
