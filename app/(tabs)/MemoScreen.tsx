import { Label } from "@react-navigation/elements";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
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

export default function MemoScreen() {
  const [myinput, set_myinput] = useState("");
  const [multi_input, set_multi_input] = useState("");
  const [custom_inputs, set_custom_inputs] = useState<MyInputsType[]>([]);

  useFocusEffect(
    useCallback(() => {
      // 1. 화면이 포커스(진입) 되었을 때 실행할 로직

      return () => {
        // 2. 화면이 포커스를 잃었을 때(나갈 때) 실행할 정리(Cleanup) 로직
        console.log("화면에서 나갔습니다.");
      };
    }, []),
  );

  function onAddCustomInput(e: MyInputsType) {
    set_custom_inputs([...custom_inputs, e]);
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <Text>메모 화면</Text>
        <View>
          <Label>입력:</Label>
          <TextInput
            onChangeText={(e: string) => {
              set_myinput(e);
            }}
            value={myinput}
            placeholder="입력하는곳"
          />
        </View>
        <Text>my input: {myinput}</Text>
        <View>
          <TextInput
            editable
            multiline
            numberOfLines={4}
            maxLength={40}
            onChangeText={(e: string) => {
              set_multi_input(e);
            }}
            value={multi_input}
            placeholder="여러줄 입력란"
            style={styles.textInput}
          />
        </View>
        <View>
          <Pressable
            onPress={(e) => {}}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
                padding: 10,
                borderRadius: 8,
              },
            ]}
          >
            {({ pressed }) => (
              <Text style={{ color: pressed ? "blue" : "black" }}>
                {pressed ? "누르는 중!" : "눌러보세요"}
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    padding: 10,
    borderColor: "#000",
    borderWidth: 1,
    margin: 12,
  },
});
