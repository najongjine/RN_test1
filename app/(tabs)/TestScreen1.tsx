import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TestScreen1() {
  return (
    <SafeAreaView>
      <ScrollView>
        <Text>TestScreen1</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
