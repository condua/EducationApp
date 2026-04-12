import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

// Dữ liệu mẫu đã được việt hóa
const categories = [
  "Tất cả",
  "Lập trình Web",
  "Lập trình Python",
  "Thiết kế UI/UX",
  "Ngoại ngữ",
];

const courses = [
  {
    id: "1",
    title: "Python từ cơ bản đến nâng cao",
    price: "850.000đ",
    rating: "4.9",
    students: "2.1k Học viên",
    category: "Lập trình Python",
    image:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500&q=80",
  },
  {
    id: "2",
    title: "Lập trình Web Full-Stack",
    price: "1.200.000đ",
    rating: "4.8",
    students: "1.5k Học viên",
    category: "Lập trình Web",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&q=80",
  },
  {
    id: "3",
    title: "Thiết kế Đồ họa 3D căn bản",
    price: "600.000đ",
    rating: "4.5",
    students: "850 Học viên",
    category: "Thiết kế UI/UX",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=80",
  },
];

const mentors = [
  { id: "1", name: "Phúc", role: "Python Expert" },
  { id: "2", name: "Hoàng", role: "Web Dev" },
  { id: "3", name: "Linh", role: "UI/UX" },
  { id: "4", name: "Tuấn", role: "Data Sci" },
  { id: "5", name: "Mai", role: "English" },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const filteredCourses = courses.filter(
    (course) =>
      (selectedCategory === "Tất cả" || course.category === selectedCategory) &&
      course.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.subText}>Chào buổi sáng,</Text>
            <Text style={styles.welcomeText}>Phan Hoàng Phúc</Text>
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
          colors={["#4F46E5", "#3B82F6"]}
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
        <FlatList
          data={filteredCourses}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.courseCard} activeOpacity={0.9}>
              <Image source={{ uri: item.image }} style={styles.courseImage} />
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
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
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
const PRIMARY_COLOR = "#4F46E5";
const BG_COLOR = "#F9FAFB";

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
    color: "#111827",
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
    backgroundColor: "#FFFFFF",
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
    borderColor: "#F3F4F6",
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: "#111827", height: 40 },
  filterIcon: {
    backgroundColor: PRIMARY_COLOR,
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
    color: "#FCD34D",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  adText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 6,
  },
  adDesc: { color: "#E0E7FF", fontSize: 13, lineHeight: 20 },
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
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  categoryText: { fontSize: 14, color: "#4B5563", fontWeight: "500" },
  categorySelectedText: { color: "#FFFFFF", fontWeight: "bold" },
  courseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginRight: 16,
    width: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  courseImage: { height: 120, width: "100%", backgroundColor: "#E5E7EB" },
  courseInfo: { padding: 14 },
  courseCategory: {
    fontSize: 12,
    color: PRIMARY_COLOR,
    fontWeight: "600",
    marginBottom: 4,
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
  coursePrice: { fontSize: 16, color: "#10B981", fontWeight: "bold" },
  ratingContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
  courseRating: { fontSize: 13, color: "#4B5563", fontWeight: "600" },
  mentorCard: { alignItems: "center", marginRight: 20, width: 70 },
  mentorImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#E0E7FF",
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
