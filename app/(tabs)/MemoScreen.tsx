import { Label } from "@react-navigation/elements";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MemoScreen() {
  const [a, seta] = useState(0);

  return (
    <SafeAreaView>
      <ScrollView>
        <Text>메모 화면</Text>
        <View>
          <Label>입력:</Label>
          <TextInput
            onChangeText={(e) => {}}
            value={""}
            placeholder="입력하는곳"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
