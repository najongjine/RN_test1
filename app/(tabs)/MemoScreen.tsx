import { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MemoScreen() {
  const [a, seta] = useState(0);

  return (
    <SafeAreaView>
      <ScrollView>
        <Text>메모 화면</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
