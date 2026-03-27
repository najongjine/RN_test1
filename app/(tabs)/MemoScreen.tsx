import { Label } from "@react-navigation/elements";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MemoScreen() {
  const [myinput, set_myinput] = useState("");

  return (
    <SafeAreaView>
      <ScrollView>
        <Text>메모 화면</Text>
        <View>
          <Label>입력:</Label>
          <TextInput
            onChangeText={(e) => {
              set_myinput(e);
            }}
            value={myinput}
            placeholder="입력하는곳"
          />
        </View>
        <Text>my input: {myinput}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
