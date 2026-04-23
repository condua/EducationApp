import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { grammarModules } from "@/data/grammar";

const COLORS = {
  background: "#F2FCF5",
  primary: "#10B981",
  cardBg: "#FFFFFF",
  textTitle: "#065F46",
  textDesc: "#475569",
  accentLight: "#D1FAE5",
  formulaBg: "#ECFDF5",
  exampleBg: "#F8FAFC",
  signalsBg: "#EFF6FF",
  signalsAccent: "#3B82F6",
};

export default function GrammarDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const moduleData = useMemo(() => {
    return grammarModules[id as string];
  }, [id]);

  if (!moduleData) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Ionicons name="document-text-outline" size={60} color="#D1D5DB" />
        <Text style={styles.errorText}>Nội dung đang được cập nhật...</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtnError}
        >
          <Text style={styles.backBtnErrorText}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={COLORS.textTitle} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {moduleData.topicTitle}
        </Text>
        <View style={styles.placeholderBox} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {moduleData.lessons.map((lesson: any, index: number) => (
          <View key={lesson.id || index} style={styles.lessonCard}>
            <View style={styles.lessonHeader}>
              <View style={styles.dot} />
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
            </View>

            <View style={styles.formulaBox}>
              <View style={styles.sectionHeader}>
                <Ionicons
                  name="construct-outline"
                  size={16}
                  color={COLORS.primary}
                />
                <Text style={styles.formulaLabel}>CẤU TRÚC</Text>
              </View>
              <Text style={styles.formulaText}>{lesson.formula}</Text>
            </View>

            <View style={styles.usageBox}>
              <Ionicons name="bulb-outline" size={22} color="#F59E0B" />
              <Text style={styles.usageText}>{lesson.usage}</Text>
            </View>

            {/* Thêm phần hiển thị Dấu hiệu nhận biết */}
            {lesson.signals && (
              <View style={styles.signalsBox}>
                <View style={styles.sectionHeader}>
                  <Ionicons
                    name="search-outline"
                    size={16}
                    color={COLORS.signalsAccent}
                  />
                  <Text style={styles.signalsLabel}>DẤU HIỆU NHẬN BIẾT</Text>
                </View>
                <Text style={styles.signalsText}>{lesson.signals}</Text>
              </View>
            )}

            <View style={styles.exampleContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={16}
                  color={COLORS.textDesc}
                />
                <Text style={styles.exampleTitle}>VÍ DỤ</Text>
              </View>

              {lesson.examples.map((ex: any, exIdx: number) => (
                <View key={exIdx} style={styles.exampleItem}>
                  <Text style={styles.exEn}>{ex.en}</Text>
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
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { marginTop: 16, fontSize: 16, color: COLORS.textDesc },
  backBtnError: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.accentLight,
    borderRadius: 8,
  },
  backBtnErrorText: { color: COLORS.primary, fontWeight: "bold" },
  placeholderBox: { width: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  backBtn: {
    padding: 6,
    backgroundColor: COLORS.accentLight,
    borderRadius: 12,
    width: 40,
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textTitle,
    textAlign: "center",
  },
  scrollContent: { padding: 16, paddingBottom: 40 },
  lessonCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F0FDF4",
  },
  lessonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginRight: 10,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.textTitle,
    flex: 1,
  },
  formulaBox: {
    backgroundColor: COLORS.formulaBg,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  formulaLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.primary,
    marginLeft: 6,
    letterSpacing: 1,
  },
  formulaText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textTitle,
    lineHeight: 26,
  },
  usageBox: {
    flexDirection: "row",
    backgroundColor: "#FFFBEB",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "flex-start",
  },
  usageText: {
    flex: 1,
    fontSize: 15,
    color: "#92400E",
    lineHeight: 24,
    marginLeft: 10,
  },
  signalsBox: {
    backgroundColor: COLORS.signalsBg,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.signalsAccent,
  },
  signalsLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.signalsAccent,
    marginLeft: 6,
    letterSpacing: 1,
  },
  signalsText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E3A8A",
    lineHeight: 24,
  },
  exampleContainer: { marginTop: 8 },
  exampleTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.textDesc,
    marginLeft: 6,
    letterSpacing: 1,
  },
  exampleItem: {
    backgroundColor: COLORS.exampleBg,
    padding: 14,
    borderRadius: 10,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#CBD5E1",
  },
  exEn: { fontSize: 16, fontWeight: "700", color: "#1E293B", marginBottom: 6 },
  exVi: {
    fontSize: 14,
    color: COLORS.textDesc,
    fontStyle: "italic",
    lineHeight: 20,
  },
});
