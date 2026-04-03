import MyButtonGroup from "@/components/Button/MyButtonGroup";
import MyCustomButton from "@/components/Button/MyCustomButton";
import MultilineMemoInput2 from "@/components/Input/KeyboardAwareMultilineInput2";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
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
import { getMemoById, insertMemo, updateMemoById } from "../utils/db_crud";

export default function MemoEditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isReadonly = params.readonly === "true";

  const [id, setId] = useState(Number(params?.id) || 0);
  const [title, setTitle] = useState((params?.title as string) || "");
  const [content, setContent] = useState((params?.content as string) || "");

  // 파라미터가 변경되거나 탭 바를 통해 진입 시 상태를 동기화합니다.

  useFocusEffect(
    useCallback(() => {
      const loadMemo = async () => {
        const memoId = Number(params.id);
        if (memoId) {
          try {
            const memo = await getMemoById(memoId);
            if (memo) {
              setId(memo.id);
              setTitle(memo.title);
              setContent(memo.content || "");
            }
          } catch (error) {
            console.error("Failed to load memo:", error);
            Alert.alert("오류", "메모를 불러오는 데 실패했습니다.");
          }
        } else {
          // 새 메모 작성 시 초기화
          setId(0);
          setTitle("");
          setContent("");
        }
      };

      loadMemo();
    }, [params.id])
  );

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
      if (id > 0) {
        await updateMemoById(id, title, content);
        Alert.alert("성공", "메모가 수정되었습니다.", [
          {
            text: "확인",
            onPress: () => {
              router.replace("/");
            },
          },
        ]);
      } else {
        await insertMemo(title, content);
        Alert.alert("성공", "메모가 저장되었습니다.", [
          {
            text: "확인",
            onPress: () => {
              router.replace("/");
            },
          },
        ]);
      }
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
            {isReadonly ? "메모 상세보기" : "메모 편집"}
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{"제목"}</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder={"제목입력"}
              style={styles.titleInput}
              editable={!isReadonly}
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
              editable={!isReadonly}
            />
          </View>

          <MyButtonGroup
            direction="row"
            align="center"
            gap={5}
            justify="around"
          >
            {!isReadonly && (
              <MyCustomButton
                label={"저장"}
                onPress={handleSave}
                color="#8adea9ff"
                size="small"
              />
            )}
            <MyCustomButton
              label={isReadonly ? "닫기" : "취소"}
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
