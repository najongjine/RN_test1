import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MemoEditScreen() {
  return (
    <SafeAreaView>
      <ScrollView>
        <Text>메모 수정 화면</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
