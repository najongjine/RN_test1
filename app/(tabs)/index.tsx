import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllMemos, Memo } from "../utils/db_crud";

export default function HomeScreen() {
  const router = useRouter();
  const [memos, setMemos] = useState<Memo[]>([]);

  // 화면이 포커스될 때마다 데이터를 새로 가져옵니다.
  useFocusEffect(
    useCallback(() => {
      loadMemos();
    }, []),
  );

  const loadMemos = async () => {
    try {
      const data = await getAllMemos();
      setMemos(data);
    } catch (error) {
      console.error("Failed to load memos:", error);
    }
  };

  const renderItem = ({ item }: { item: Memo }) => {
    // 날짜 포맷팅 (YYYY-MM-DD HH:mm 형식으로 표시하거나 간단하게)
    const dateStr = item.created_dt ? item.created_dt.split(" ")[0] : "";

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => {
          router.push({
            pathname: "/MemoEditScreen",
            params: {
              id: item?.id || 0,
              title: item?.title || "",
              content: item?.content || "",
              readonly: "true",
            },
          });
        }}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.date}>{dateStr}</Text>
        </View>
        <Text style={styles.content} numberOfLines={2}>
          {item.content || "내용 없음"}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>나의 메모</Text>
        <Text style={styles.headerSubtitle}>
          {memos.length}개의 메모가 있습니다
        </Text>
      </View>

      <FlatList
        data={memos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>작성된 메모가 없습니다.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#212529",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6C757D",
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    // Android Shadow
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#343A40",
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: "#ADB5BD",
    fontWeight: "500",
  },
  content: {
    fontSize: 15,
    color: "#495057",
    lineHeight: 22,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: "#ADB5BD",
  },
});
