import MyButtonGroup from "@/components/Button/MyButtonGroup";
import MyCustomButton from "@/components/Button/MyCustomButton";
import { Label } from "@react-navigation/elements";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MyInputsType {
  myinput?: string;
  multi_input?: string;
}

export default function TestMemoScreen() {
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
    console.log(`# custom_inputs: `, custom_inputs);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={custom_inputs}
        keyExtractor={(_, index) => index.toString()}
        ListHeaderComponent={
          <>
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

            <MyButtonGroup
              direction="row"
              align="center"
              gap={5}
              justify="evenly"
            >
              <MyCustomButton
                label="메모저장"
                onPress={() => {
                  onAddCustomInput({ myinput, multi_input });
                }}
                color="#8adea9ff"
                size="medium"
              />
              <MyCustomButton
                label="버튼2"
                onPress={() => {}}
                color="#8adea9ff"
                size="small"
              />
              <MyCustomButton
                label="버3"
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
                <MyCustomButton label="버튼1" onPress={() => {}} size="small" />
              </MyButtonGroup>

              <MyButtonGroup direction="row" gap={8}>
                <MyCustomButton label="버튼2" onPress={() => {}} size="small" />
                <MyCustomButton label="버튼3" onPress={() => {}} size="small" />
              </MyButtonGroup>
            </MyButtonGroup>
            <View style={{ marginTop: 20 }}>
              <Text> 내가 지금까지 입력한것들: </Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 10 }}>
            <Text>myinput: {item.myinput}</Text>
            <Text>multi_input: {item.multi_input}</Text>
            <View
              style={{
                height: 1,
                backgroundColor: "#cccccc",
                marginVertical: 10,
              }}
            />
          </View>
        )}
        contentContainerStyle={{ padding: 10 }}
      />
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
