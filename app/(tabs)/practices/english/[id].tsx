import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { grammarModules } from "@/data/grammar"; // Import manager
import { SafeAreaView } from "react-native-safe-area-context";
const COLORS = {
  background: "#F2FCF5",
  primary: "#10B981",
  cardBg: "#FFFFFF",
  textTitle: "#065F46",
  accent: "#D1FAE5",
};

export default function GrammarDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Lấy dữ liệu từ file JSON nhỏ tương ứng
  const moduleData = grammarModules[id as string];

  if (!moduleData) return <Text>Đang tải dữ liệu...</Text>;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header riêng */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textTitle} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{moduleData.topicTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {moduleData.lessons.map((lesson: any) => (
          <View key={lesson.id} style={styles.lessonCard}>
            <Text style={styles.lessonTitle}>{lesson.title}</Text>

            <View style={styles.formulaBox}>
              <Text style={styles.formulaLabel}>Cấu trúc:</Text>
              <Text style={styles.formulaText}>{lesson.formula}</Text>
            </View>

            <Text style={styles.usageText}>💡 {lesson.usage}</Text>

            <View style={styles.exampleContainer}>
              {lesson.examples.map((ex: any, index: number) => (
                <View key={index} style={styles.exampleItem}>
                  <Text style={styles.exEn}>• {ex.en}</Text>
                  <Text style={styles.exVi}>{ex.vi}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFF",
  },
  backBtn: { padding: 8, backgroundColor: COLORS.accent, borderRadius: 12 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.textTitle },
  scrollContent: { padding: 16 },
  lessonCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 12,
  },
  formulaBox: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    marginBottom: 12,
  },
  formulaLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.textTitle,
    opacity: 0.6,
  },
  formulaText: { fontSize: 16, fontWeight: "700", color: COLORS.textTitle },
  usageText: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 22,
    marginBottom: 16,
  },
  exampleContainer: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 12,
  },
  exampleItem: { marginBottom: 8 },
  exEn: { fontSize: 14, fontWeight: "600", color: COLORS.textTitle },
  exVi: { fontSize: 13, color: "#64748B", fontStyle: "italic" },
});
