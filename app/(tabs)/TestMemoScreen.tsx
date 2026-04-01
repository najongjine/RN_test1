import MyButtonGroup from "@/components/Button/MyButtonGroup";
import MyCustomButton from "@/components/Button/MyCustomButton";
import MultilineMemoInput from "@/components/Input/KeyboardAwareMultilineInput";
import { Label } from "@react-navigation/elements";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MyInputsType {
  myinput?: string;
  multi_input?: string;
}

export default function TestMemoScreen() {
  const [myinput, setMyinput] = useState("");
  const [multiInput, setMultiInput] = useState("");
  const [customInputs, setCustomInputs] = useState<MyInputsType[]>([]);

  const listRef = useRef<FlatList<MyInputsType>>(null);
  const scrollOffsetRef = useRef(0);

  useFocusEffect(
    useCallback(() => {
      return () => {
        console.log("TestMemoScreen cleanup");
      };
    }, []),
  );

  function onAddCustomInput(nextInput: MyInputsType) {
    setCustomInputs((currentInputs) => [...currentInputs, nextInput]);
  }

  function handleListScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
  }

  function handleInputScrollRequest(delta: number) {
    const nextOffset = Math.max(0, scrollOffsetRef.current + delta);

    scrollOffsetRef.current = nextOffset;
    listRef.current?.scrollToOffset({
      offset: nextOffset,
      animated: true,
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        ref={listRef}
        data={customInputs}
        keyExtractor={(_, index) => index.toString()}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        onScroll={handleListScroll}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>{"\uBA54\uBAA8 \uD654\uBA74"}</Text>

            <View style={styles.fieldGroup}>
              <Label>{"\uC785\uB825"}</Label>
              <TextInput
                onChangeText={setMyinput}
                value={myinput}
                placeholder={"\uC785\uB825\uD574\uBCF4\uC138\uC694"}
                style={styles.singleLineInput}
              />
            </View>

            <Text style={styles.previewText}>my input: {myinput}</Text>

            <View style={styles.fieldGroup}>
              <Label>{"\uC5EC\uB7EC \uC904 \uC785\uB825"}</Label>
              <MultilineMemoInput
                value={multiInput}
                onChangeText={setMultiInput}
                placeholder={"\uAE38\uAC8C \uC785\uB825\uD574\uB3C4 \uCEE4\uC11C \uC704\uCE58\uAC00 \uBCF4\uC774\uAC8C \uCC98\uB9AC\uD569\uB2C8\uB2E4"}
                minLines={4}
                maxLines={12}
                maxLength={400}
                onRequestScrollBy={handleInputScrollRequest}
                containerStyle={styles.multilineContainer}
                inputStyle={styles.multilineInput}
              />
            </View>

            <MyButtonGroup
              direction="row"
              align="center"
              gap={5}
              justify="evenly"
            >
              <MyCustomButton
                label={"\uBA54\uBAA8 \uCD94\uAC00"}
                onPress={() => {
                  onAddCustomInput({ myinput, multi_input: multiInput });
                }}
                color="#8adea9ff"
                size="medium"
              />
              <MyCustomButton
                label={"Button 2"}
                onPress={() => {}}
                color="#8adea9ff"
                size="small"
              />
              <MyCustomButton
                label={"Button 3"}
                onPress={() => {}}
                color="#8adea9ff"
                size="small"
              />
            </MyButtonGroup>

            <MyButtonGroup
              direction="row"
              justify="between"
              align="center"
              fullWidth
            >
              <MyButtonGroup direction="row" gap={8}>
                <MyCustomButton label={"Button 1"} onPress={() => {}} size="small" />
              </MyButtonGroup>

              <MyButtonGroup direction="row" gap={8}>
                <MyCustomButton label={"Button 2"} onPress={() => {}} size="small" />
                <MyCustomButton label={"Button 3"} onPress={() => {}} size="small" />
              </MyButtonGroup>
            </MyButtonGroup>

            <View style={styles.sectionGap}>
              <Text>{"\uC785\uB825\uD55C \uBA54\uBAA8 \uBAA9\uB85D"}</Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>myinput: {item.myinput}</Text>
            <Text>multi_input: {item.multi_input}</Text>
            <View style={styles.separator} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  listContent: {
    padding: 10,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  fieldGroup: {
    gap: 8,
    marginBottom: 12,
  },
  singleLineInput: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  previewText: {
    marginBottom: 12,
  },
  multilineContainer: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  multilineInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    lineHeight: 22,
  },
  sectionGap: {
    marginTop: 20,
  },
  listItem: {
    paddingHorizontal: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#cccccc",
    marginVertical: 10,
  },
});
