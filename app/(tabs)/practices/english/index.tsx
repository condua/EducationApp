import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import thư viện icon
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

// 1. Khởi tạo dữ liệu danh sách ngữ pháp (Thêm trường 'icon')
const grammarTopics = [
  {
    id: "tenses",
    title: "Hệ thống 12 Thì (Tenses)",
    description:
      "Hiện tại, Quá khứ, Tương lai (Đơn, Tiếp diễn, Hoàn thành, Hoàn thành tiếp diễn).",
    icon: "time-outline",
  },
  {
    id: "2",
    title: "5 Mẫu Câu Cốt Lõi (Basic Patterns)",
    description: "S+V, S+V+O, S+V+C, S+V+O+O, S+V+O+C.",
    icon: "git-commit-outline",
  },
  {
    id: "3",
    title: "Phân Loại Câu (Sentence Types)",
    description: "Câu đơn, Câu ghép, Câu phức, Câu ghép phức.",
    icon: "layers-outline",
  },
  {
    id: "4",
    title: "Câu Điều Kiện (Conditionals)",
    description: "Câu điều kiện loại 0, 1, 2, 3 và dạng hỗn hợp.",
    icon: "swap-horizontal-outline",
  },
  {
    id: "5",
    title: "Câu Bị Động (Passive Voice)",
    description: "Bị động theo các thì và động từ khuyết thiếu (Modal verbs).",
    icon: "sync-outline",
  },
  {
    id: "6",
    title: "Câu Gián Tiếp (Reported Speech)",
    description: "Cách lùi thì và đổi ngôi khi tường thuật lời nói.",
    icon: "chatbubbles-outline",
  },
  {
    id: "7",
    title: "Mệnh Đề Quan Hệ (Relative Clauses)",
    description: "Cách sử dụng Who, Whom, Which, That, Whose.",
    icon: "link-outline",
  },
  {
    id: "8",
    title: "Cấu Trúc So Sánh (Comparisons)",
    description: "So sánh bằng, so sánh hơn, so sánh nhất, so sánh kép.",
    icon: "bar-chart-outline",
  },
  {
    id: "9",
    title: "Động Từ Khuyết Thiếu (Modal)",
    description: "Can, Could, May, Might, Must, Should...",
    icon: "construct-outline",
  },
  {
    id: "10",
    title: "Cấu Trúc Đặc Thù",
    description: "Used to, Be used to, So...that, Such...that, Too...to...",
    icon: "star-outline",
  },
];

// Định nghĩa tông màu chủ đạo (Xanh Lá Nhạt)
const COLORS = {
  background: "#F2FCF5", // Nền xanh lá cực nhạt (Mint Cream) - Dịu mắt, không chói
  primary: "#10B981", // Xanh lục bảo (Emerald 500) - Tươi tắn, năng động (Dùng cho icon/button)
  cardBg: "#FFFFFF", // Trắng tinh - Làm nổi bật các thẻ (cards)
  textTitle: "#065F46", // Xanh rêu đậm (Emerald 800) - Đọc rõ, sang trọng, không bị gắt như màu đen
  textDesc: "#64748B", // Xám nhạt (Slate 500) - Màu xám tiêu chuẩn để chữ phụ không tranh chú ý với chữ chính
  iconBg: "#D1FAE5", // Nền icon xanh lá nhạt (Emerald 100) - Làm nền cho icon nổi bật
};

export default function EnglishGrammarScreen() {
  // Hàm render từng item
  const renderItem = ({ item }: { item: (typeof grammarTopics)[0] }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => router.push(`/practices/english/${item.id}`)}
    >
      {/* Cột chứa Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon as any} size={28} color={COLORS.primary} />
      </View>

      {/* Cột chứa Nội dung */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      {/* Mũi tên chỉ hướng */}
      <Ionicons
        name="chevron-forward"
        size={20}
        color="#CBD5E1"
        style={styles.arrowIcon}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header vui nhộn, thân thiện */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>Chào bạn 👋</Text>
        <Text style={styles.headerTitle}>Khám phá Ngữ Pháp</Text>
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
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textDesc,
    fontWeight: "600",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900", // Chữ đậm tạo điểm nhấn
    color: COLORS.textTitle,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40, // Đệm đáy để khi cuộn không bị sát mép
  },
  card: {
    flexDirection: "row", // Xếp icon và text theo hàng ngang
    alignItems: "center",
    backgroundColor: COLORS.cardBg,
    padding: 16,
    borderRadius: 20, // Bo góc to, tròn trịa thân thiện với học sinh
    marginBottom: 16,

    // Đổ bóng (Shadow) mềm mại
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4, // Dành cho Android
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28, // Tròn xoe
    backgroundColor: COLORS.iconBg,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1, // Chiếm hết không gian còn lại
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textTitle,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: COLORS.textDesc,
    lineHeight: 20,
  },
  arrowIcon: {
    marginLeft: 8,
  },
});
