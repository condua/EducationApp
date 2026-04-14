import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

// Import action gọi API từ courseSlice của bạn

import { getAllCourses } from "./../../src/slices/courseSlice";
const categories = [
  "Tất cả",
  "Language", // Mình đổi tên danh mục để khớp với 'category' từ API của bạn
  "Chemistry",
  "Lập trình Web",
  "Thiết kế UI/UX",
];

const mentors = [
  { id: "1", name: "Phúc", role: "Python Expert" },
  { id: "2", name: "Hoàng", role: "Web Dev" },
  { id: "3", name: "Linh", role: "UI/UX" },
  { id: "4", name: "Tuấn", role: "Data Sci" },
  { id: "5", name: "Mai", role: "English" },
];

export default function HomeScreen() {
  const dispatch = useDispatch<any>();

  // Lấy danh sách khóa học và trạng thái loading từ Redux
  const { courses, loadingAll } = useSelector((state: any) => state.course);

  // (Tùy chọn) Lấy tên người dùng từ profileSlice để lời chào thêm sinh động
  const { fullName } = useSelector((state: any) => state.profile);
  const currentHour = new Date().getHours();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  // Gọi API lấy dữ liệu ngay khi vào màn hình
  useEffect(() => {
    dispatch(getAllCourses());
  }, [dispatch]);

  let greeting = "Xin chào";
  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Chào buổi sáng";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Chào buổi chiều";
  } else {
    greeting = "Chào buổi tối"; // Từ 18h đến trước 5h sáng
  }
  // Lọc khóa học dựa theo API trả về (Lưu ý: chuyển text về chữ thường để so sánh chính xác)
  const filteredCourses =
    courses?.filter((course: any) => {
      const matchCategory =
        selectedCategory === "Tất cả" ||
        course.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchSearch = course.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    }) || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 0 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.subText}>{greeting},</Text>
            <Text style={styles.welcomeText}>
              {fullName || "Phan Hoàng Phúc"}
            </Text>
          </View>
          <TouchableOpacity style={styles.bellButton}>
            <FontAwesome name="bell-o" size={22} color="#111827" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        <Text style={styles.questionText}>Hôm nay bạn muốn học gì?</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#9CA3AF"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm khóa học..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterIcon}>
            <Ionicons name="options-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Advertisement Banner */}
        <LinearGradient
          colors={["#bbf7d0", "#4ade80"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.adContainer}
        >
          <View style={styles.adTextContent}>
            <Text style={styles.adTitle}>GIẢM 25%*</Text>
            <Text style={styles.adText}>Ưu đãi hôm nay</Text>
            <Text style={styles.adDesc}>
              Nhận chiết khấu cho mọi khóa học. Chỉ áp dụng trong ngày hôm nay!
            </Text>
          </View>
          <Image
            source={{
              uri: "https://cdn3d.iconscout.com/3d/premium/thumb/student-graduating-5360980-4491080.png",
            }}
            style={styles.adImage}
          />
        </LinearGradient>

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Danh mục</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/courses")}>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryItem,
                selectedCategory === item && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item && styles.categorySelectedText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />

        {/* Courses Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Khóa học nổi bật</Text>
        </View>

        {/* Hiển thị vòng xoay nếu API đang tải */}
        {loadingAll ? (
          <ActivityIndicator
            size="large"
            color={PRIMARY_COLOR}
            style={{ marginVertical: 30 }}
          />
        ) : (
          <FlatList
            data={filteredCourses}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.courseCard}
                activeOpacity={0.9}
                // Điều hướng sang trang chi tiết khóa học
                onPress={() => router.push(`/(tabs)/courses`)}
              >
                <Image
                  source={{ uri: item.thumbnail }}
                  style={styles.courseImage}
                />
                <View style={styles.courseInfo}>
                  <Text style={styles.courseCategory}>{item.category}</Text>
                  <Text style={styles.courseTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={styles.courseFooter}>
                    <Text style={styles.coursePrice}>{item.price}</Text>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color="#FBBF24" />
                      <Text style={styles.courseRating}>{item.rating}</Text>
                      {/* Thêm số lượng học viên */}
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#9CA3AF",
                          marginLeft: 4,
                        }}
                      >
                        ({item.students})
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  color: "gray",
                  marginLeft: 16,
                }}
              >
                Không tìm thấy khóa học nào.
              </Text>
            }
          />
        )}

        {/* Mentors Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Giảng viên tiêu biểu</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/mentors")}>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={mentors}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.mentorCard}>
              <Image
                source={{
                  uri: `https://ui-avatars.com/api/?name=${item.name}&background=4F46E5&color=fff&size=128`,
                }}
                style={styles.mentorImage}
              />
              <Text style={styles.mentorName}>{item.name}</Text>
              <Text style={styles.mentorRole}>{item.role}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// Bảng màu chuẩn
const PRIMARY_COLOR = "#86efac"; // xanh lá nhạt (main)
const PRIMARY_DARK = "#22c55e"; // xanh lá đậm để nhấn
const BG_COLOR = "#f0fdf4"; // nền xanh rất nhạt
const CARD_COLOR = "#ffffff"; // giữ trắng cho card
const TEXT_MAIN = "#065f46"; // xanh đậm cho chữ chính
const TEXT_SUB = "#4b5563";

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG_COLOR },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  subText: { fontSize: 14, color: "#6B7280" },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: TEXT_MAIN,
    marginTop: 2,
  },
  bellButton: {
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    backgroundColor: "#EF4444",
    borderRadius: 4,
  },
  questionText: {
    fontSize: 16,
    color: "#4B5563",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#ecfdf5", // xanh nhạt hơn trắng
    borderRadius: 14,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    marginHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#d1fae5",
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: "#111827", height: 40 },
  filterIcon: {
    backgroundColor: PRIMARY_DARK,
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  adContainer: {
    flexDirection: "row",
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 24,
    alignItems: "center",
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  adTextContent: { flex: 1, paddingRight: 10 },
  adTitle: {
    color: "#16a34a", // xanh lá đậm (nhấn nhẹ)
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  adText: {
    color: "#064e3b", // xanh đậm, dễ đọc
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 6,
  },

  adDesc: {
    color: "#166534", // xanh lá trung tính
    fontSize: 13,
    lineHeight: 20,
  },
  adImage: { width: 90, height: 90, resizeMode: "contain" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  seeAllText: { fontSize: 14, color: PRIMARY_COLOR, fontWeight: "600" },
  categoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  selectedCategory: {
    backgroundColor: PRIMARY_DARK,
    borderColor: PRIMARY_DARK,
  },
  categoryText: { fontSize: 14, color: "#4B5563", fontWeight: "500" },
  categorySelectedText: { color: "#FFFFFF", fontWeight: "bold" },
  courseCard: {
    backgroundColor: CARD_COLOR,
    borderRadius: 16,
    marginRight: 16,
    width: 240, // Mở rộng nhẹ để hiển thị số lượng học viên đẹp hơn
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#dcfce7",
  },
  courseImage: { height: 120, width: "100%", backgroundColor: "#E5E7EB" },
  courseInfo: { padding: 14 },
  courseCategory: {
    fontSize: 12,
    color: PRIMARY_COLOR,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "capitalize", // Cho chữ đẹp hơn
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111827",
    lineHeight: 22,
    height: 44,
  },
  courseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  coursePrice: { fontSize: 16, color: "#16a34a", fontWeight: "bold" },
  ratingContainer: { flexDirection: "row", alignItems: "center" },
  courseRating: {
    fontSize: 13,
    color: "#4B5563",
    fontWeight: "600",
    marginLeft: 4,
  },
  mentorCard: { alignItems: "center", marginRight: 20, width: 70 },
  mentorImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#bbf7d0",
    marginBottom: 8,
  },
  mentorName: { fontSize: 14, fontWeight: "600", color: "#111827" },
  mentorRole: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
    textAlign: "center",
  },
});
