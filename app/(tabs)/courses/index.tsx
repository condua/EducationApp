import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store"; // Đảm bảo đường dẫn store đúng
import { getAllCourses } from "@/src/slices/courseSlice";
import { fetchCurrentUser } from "@/src/slices/profileSlice";
import { SafeAreaView } from "react-native-safe-area-context";

const categories = [
  "Tất cả",
  "Language",
  "Chemistry",
  "Programming",
  "Web Development",
];

export default function CoursesIndexScreen() {
  const dispatch = useDispatch<any>();

  const [activeTab, setActiveTab] = useState<"ALL" | "MY_COURSES">("ALL");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [bookmarkedCourses, setBookmarkedCourses] = useState<{
    [key: string]: boolean;
  }>({});

  const { courses, loadingAll } = useSelector(
    (state: RootState) => state.course,
  );

  const { user, enrolledCourses } = useSelector((state: any) => state.profile);

  useEffect(() => {
    dispatch(getAllCourses());
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const toggleBookmark = (id: string) => {
    setBookmarkedCourses((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredCourses = (courses || [])
    .filter((course) => {
      if (activeTab === "MY_COURSES") {
        const isEnrolled =
          enrolledCourses && enrolledCourses.includes(course._id);
        if (!isEnrolled) return false;
      }
      const matchCategory =
        selectedCategory === "Tất cả" ||
        course.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchCategory;
    })
    .sort(
      (a, b) =>
        (bookmarkedCourses[b._id] ? 1 : 0) - (bookmarkedCourses[a._id] ? 1 : 0),
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Khóa học</Text>
        <View style={styles.headerRight} />
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "ALL" && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab("ALL")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "ALL" && styles.tabTextActive,
            ]}
          >
            Khám phá
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "MY_COURSES" && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab("MY_COURSES")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "MY_COURSES" && styles.tabTextActive,
            ]}
          >
            Khóa học của tôi
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonSelected,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextSelected,
                ]}
              >
                {category === "Language"
                  ? "Ngoại ngữ"
                  : category === "Chemistry"
                    ? "Hóa học"
                    : category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loadingAll ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={{ marginTop: 10, color: "gray" }}>
            Đang tải dữ liệu...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item._id}
          style={{ paddingBottom: 50, marginBottom: 10 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isEnrolled =
              enrolledCourses && enrolledCourses.includes(item._id);

            return (
              <TouchableOpacity
                style={styles.courseCard}
                onPress={() =>
                  // Điều hướng chuẩn xác dựa theo cấu trúc thư mục của bạn
                  router.push({
                    pathname: "/(tabs)/courses/detail",
                    params: { id: item._id },
                  })
                }
              >
                <Image
                  style={styles.courseImage}
                  source={{ uri: item.thumbnail }}
                />

                <View style={styles.courseContent}>
                  <Text style={styles.categoryLabel}>{item.category}</Text>
                  <Text style={styles.courseTitle} numberOfLines={2}>
                    {item.title}
                  </Text>

                  <View style={styles.courseInfo}>
                    <FontAwesome name="star" size={14} color="#FFD700" />
                    <Text style={styles.rating}>{item.rating}</Text>
                    <Text style={styles.students}>
                      {item.students} Học viên
                    </Text>
                  </View>

                  <View style={styles.footerCard}>
                    <Text style={styles.price}>{item.price}</Text>
                    {isEnrolled && (
                      <Text style={styles.enrolledTag}>Đã đăng ký</Text>
                    )}
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => toggleBookmark(item._id)}
                  style={styles.bookmarkWrapper}
                >
                  <FontAwesome
                    name={
                      bookmarkedCourses[item._id] ? "bookmark" : "bookmark-o"
                    }
                    size={24}
                    color={bookmarkedCourses[item._id] ? "#FFD700" : "#D1D5DB"}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={{ marginTop: 60, alignItems: "center" }}>
              <Ionicons name="folder-open-outline" size={60} color="#D1D5DB" />
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 10,
                  color: "#6B7280",
                  fontSize: 16,
                }}
              >
                {activeTab === "MY_COURSES"
                  ? "Bạn chưa đăng ký khóa học nào trong danh mục này."
                  : "Không có khóa học nào thuộc danh mục này."}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const PRIMARY_COLOR = "#4F46E5";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 18,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
  },
  headerRight: {
    width: 32, // Để cân bằng với nút back giúp title nằm giữa
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: { fontSize: 15, fontWeight: "600", color: "#6B7280" },
  tabTextActive: { color: PRIMARY_COLOR },
  categoryContainer: { flexDirection: "row", marginBottom: 16 },
  categoryButton: {
    minWidth: 90,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryButtonSelected: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  categoryText: { fontSize: 13, color: "#4B5563", fontWeight: "500" },
  categoryTextSelected: { color: "#FFFFFF", fontWeight: "bold" },
  courseCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  courseImage: {
    width: 90,
    height: 90,
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
  },
  courseContent: { flex: 1, marginLeft: 16, justifyContent: "center" },
  categoryLabel: {
    fontSize: 12,
    color: PRIMARY_COLOR,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 6,
  },
  courseInfo: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  rating: { fontSize: 14, color: "#374151", fontWeight: "600", marginLeft: 4 },
  students: { fontSize: 12, color: "#6B7280", marginLeft: 12 },
  footerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 10,
  },
  price: { fontSize: 15, fontWeight: "bold", color: "#10B981" },
  enrolledTag: {
    fontSize: 11,
    backgroundColor: "#D1FAE5",
    color: "#065F46",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: "600",
  },
  bookmarkWrapper: { padding: 4 },
});
