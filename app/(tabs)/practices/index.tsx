import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

// Dữ liệu mẫu về các danh mục môn học
const subjectCategories = [
  {
    id: "1",
    title: "Tiếng Anh",
    icon: "language",
    courses: "12 chủ đề",
    slug: "english",
  },
  { id: "2", title: "Toán Học", icon: "calculator", courses: "8 chủ đề" },
  { id: "3", title: "Lập Trình", icon: "code-slash", courses: "15 chủ đề" },
  // { id: "4", title: "Hóa Học", icon: "flask", courses: "6 chủ đề" },
  // { id: "5", title: "Vật Lý", icon: "magnet", courses: "7 chủ đề" },
  // { id: "6", title: "Ngữ Văn", icon: "book", courses: "10 chủ đề" },
  // { id: "7", title: "Sinh Học", icon: "leaf", courses: "5 chủ đề" },
  // { id: "8", title: "Địa Lý", icon: "earth", courses: "4 chủ đề" },
];

export default function PracticesScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: (typeof subjectCategories)[0] }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => {
        console.log(`Đang chuyển đến môn: ${item.slug}`);
        router.push(`/practices/${item.slug}`);
      }}
    >
      <View style={styles.iconContainer}>
        {/* @ts-ignore */}
        <Ionicons name={item.icon} size={30} color="#427A53" />
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.courseCount}>{item.courses}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hôm nay học gì nhỉ? 🌱</Text>
        <Text style={styles.subGreeting}>Chọn một môn học để bắt đầu</Text>
      </View>

      <FlatList
        data={subjectCategories}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F7F4", // Nền xanh rêu/xám siêu nhạt, cực kỳ dịu mắt
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2D4A36", // Xanh lá đậm trầm (Sage thẫm)
    marginBottom: 6,
  },
  subGreeting: {
    fontSize: 15,
    color: "#64826D", // Xanh xám nhạt (Muted Sage) - giảm độ chói
    fontWeight: "500",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    width: cardWidth,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    // Bóng đổ được làm mềm mại hơn, dùng màu trầm thay vì xanh sáng
    shadowColor: "#2D4A36",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, // Giảm opacity để bóng mờ ảo, tinh tế hơn
    shadowRadius: 10,
    elevation: 3, // Giảm elevation trên Android
    borderWidth: 1,
    borderColor: "#E8F0EA", // Viền xám xanh cực nhẹ
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E8F0EA", // Nền icon màu xanh pastel nhạt
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#33473B", // Đen ngả xanh rêu, mềm hơn màu đen tuyền
    marginBottom: 4,
    textAlign: "center",
  },
  courseCount: {
    fontSize: 13,
    color: "#5B8266", // Xanh lục nhạt vừa phải, dễ đọc nhưng không chói
    fontWeight: "600",
  },
});
