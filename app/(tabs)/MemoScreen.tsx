import { Label } from "@react-navigation/elements";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MemoScreen() {
  const [myinput, set_myinput] = useState("");
  const [multi_input, set_multi_input] = useState("");

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
