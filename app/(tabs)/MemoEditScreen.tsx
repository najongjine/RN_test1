import MultilineMemoInput from "@/components/Input/KeyboardAwareMultilineInput";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MemoEditScreen() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const scrollRef = useRef<ScrollView>(null);
  const scrollOffsetRef = useRef(0);

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
  }

  function handleInputScrollRequest(delta: number) {
    const nextOffset = Math.max(0, scrollOffsetRef.current + delta);

    scrollOffsetRef.current = nextOffset;
    scrollRef.current?.scrollTo({
      y: nextOffset,
      animated: false,
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
          onScroll={handleScroll}
          contentContainerStyle={styles.container}
        >
          <Text style={styles.screenTitle}>
            {"\uBA54\uBAA8 \uC218\uC815 \uD654\uBA74"}
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{"제목"}</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder={"제목입력"}
              style={styles.titleInput}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{"내용"}</Text>
            <MultilineMemoInput
              value={content}
              onChangeText={setContent}
              placeholder={"내용입력"}
              minLines={8}
              maxLines={16}
              onRequestScrollBy={handleInputScrollRequest}
              containerStyle={styles.contentContainer}
              inputStyle={styles.contentInput}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
    gap: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  titleInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#f9fafb",
  },
  contentContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    backgroundColor: "#f9fafb",
  },
  contentInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 22,
  },
});
