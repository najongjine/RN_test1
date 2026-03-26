import { useState } from "react";
import {
  Button,
  GestureResponderEvent,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TestScreen1() {
  const [a, seta] = useState(0);

  function onPressLearnMore(event: GestureResponderEvent): void {
    let _a = a;
    _a++;
    seta(_a);
    console.log(`a:${a}`);
  }
  function onDecA(event: GestureResponderEvent): void {
    let _a = a;
    _a--;
    seta(_a);
    console.log(`a:${a}`);
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <Text>TestScreen1</Text>
        <Text>a: {a}</Text>
        <Button
          onPress={onPressLearnMore}
          title="증가"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={onDecA}
          title="감소"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
