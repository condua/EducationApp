import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

// 1. Khởi tạo dữ liệu danh sách ngữ pháp
const grammarTopics = [
  {
    id: "1",
    title: "Hệ thống 12 Thì (Tenses)",
    description:
      "Hiện tại, Quá khứ, Tương lai (Đơn, Tiếp diễn, Hoàn thành, Hoàn thành tiếp diễn).",
  },
  {
    id: "2",
    title: "5 Mẫu Câu Cốt Lõi (Basic Patterns)",
    description: "S+V, S+V+O, S+V+C, S+V+O+O, S+V+O+C.",
  },
  {
    id: "3",
    title: "Phân Loại Câu (Sentence Types)",
    description: "Câu đơn, Câu ghép, Câu phức, Câu ghép phức.",
  },
  {
    id: "4",
    title: "Câu Điều Kiện (Conditionals)",
    description: "Câu điều kiện loại 0, 1, 2, 3 và dạng hỗn hợp.",
  },
  {
    id: "5",
    title: "Câu Bị Động (Passive Voice)",
    description: "Bị động theo các thì và động từ khuyết thiếu (Modal verbs).",
  },
  {
    id: "6",
    title: "Câu Gián Tiếp (Reported Speech)",
    description: "Cách lùi thì và đổi ngôi khi tường thuật lời nói.",
  },
  {
    id: "7",
    title: "Mệnh Đề Quan Hệ (Relative Clauses)",
    description: "Cách sử dụng Who, Whom, Which, That, Whose.",
  },
  {
    id: "8",
    title: "Cấu Trúc So Sánh (Comparisons)",
    description: "So sánh bằng, so sánh hơn, so sánh nhất, so sánh kép.",
  },
  {
    id: "9",
    title: "Động Từ Khuyết Thiếu (Modal Verbs)",
    description: "Can, Could, May, Might, Must, Should...",
  },
  {
    id: "10",
    title: "Cấu Trúc Đặc Thù",
    description: "Used to, Be used to, So...that, Such...that, Too...to...",
  },
];

// 2. Component chính
export default function EnglishGrammarScreen() {
  // Hàm render từng item trong danh sách
  const renderItem = ({ item }: { item: (typeof grammarTopics)[0] }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Cấu trúc Ngữ pháp</Text>
      </View>

      <FlatList
        data={grammarTopics}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// 3. Khai báo StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3, // Dành cho Android
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#7f8c8d",
    lineHeight: 20,
  },
});
