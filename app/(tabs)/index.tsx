import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <ScrollView>
        <Text>홈화면 이에요</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
