import MyButtonGroup from "@/components/Button/MyButtonGroup";
import MyCustomButton from "@/components/Button/MyCustomButton";
import MultilineMemoInput2 from "@/components/Input/KeyboardAwareMultilineInput2";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
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
import { insertMemo } from "../utils/db_crud";

export default function MemoEditScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const scrollRef = useRef<ScrollView>(null);
  const scrollOffsetRef = useRef(0);

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
  }

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("알림", "제목을 입력해주세요.");
      return;
    }

    try {
      await insertMemo(title, content);
      Alert.alert("성공", "메모가 저장되었습니다.", [
        {
          text: "확인",
          onPress: () => {
            router.replace("/");
          },
        },
      ]);
    } catch (error) {
      console.error("Save Error:", error);
      Alert.alert("오류", "메모 저장 중 문제가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

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
            <MultilineMemoInput2
              value={content}
              onChangeText={setContent}
              placeholder={"내용입력"}
              minLines={8}
              maxLines={16}
              containerStyle={styles.contentContainer}
              inputStyle={styles.contentInput}
            />
          </View>

          <MyButtonGroup
            direction="row"
            align="center"
            gap={5}
            justify="around"
          >
            <MyCustomButton
              label={"저장"}
              onPress={handleSave}
              color="#8adea9ff"
              size="small"
            />
            <MyCustomButton
              label={"취소"}
              onPress={handleCancel}
              color="#e78260ff"
              size="small"
            />
          </MyButtonGroup>
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
