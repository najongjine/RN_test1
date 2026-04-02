import { Tabs } from "expo-router";
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

async function initDb(db: SQLiteDatabase) {
  try {
    //await db.execAsync("DROP TABLE IF EXISTS t_testmemo;");

    console.log("=== SQLite init 시작 ===");

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS t_testmemo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL CHECK (length(title) <= 500),
        content TEXT,
        created_dt TEXT DEFAULT (datetime('now', 'localtime')),
        updated_dt TEXT DEFAULT (datetime('now', 'localtime'))
      );
    `);

    console.log("테이블 생성 완료");

    const result = await db.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type='table'",
    );
    console.log("현재 테이블 목록:", result);

    console.log("=== SQLite init 성공 ===");
  } catch (error) {
    console.log("=== SQLite init 실패 ===");
    console.error(error);
  }
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <SQLiteProvider databaseName="testmemo.db" onInit={initDb}>
      <SafeAreaProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
            headerShown: false,
            tabBarButton: HapticTab,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="house.fill" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: "Explore",
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="paperplane.fill" color={color} />
              ),
            }}
          />
        </Tabs>
      </SafeAreaProvider>
    </SQLiteProvider>
  );
}
