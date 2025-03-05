import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
const categories = [
  "All",
  "Graphic Design",
  "3D Design",
  "Arts & Illustration",
  "Programming",
  "Web Development",
  "SEO & Marketing",
];

const coursesData = [
  {
    id: "1",
    category: "Graphic Design",
    title: "Graphic Design Advanced",
    price: "7058/-",
    rating: 4.2,
    students: 7830,
  },
  {
    id: "2",
    category: "Graphic Design",
    title: "Advertisement Design",
    price: "800/-",
    rating: 3.9,
    students: 12680,
  },
  {
    id: "3",
    category: "Programming",
    title: "Advanced Programming",
    price: "599/-",
    rating: 4.2,
    students: 990,
  },
  {
    id: "4",
    category: "Web Development",
    title: "Web Developer Concepts",
    price: "499/-",
    rating: 4.9,
    students: 14580,
  },
  {
    id: "5",
    category: "SEO & Marketing",
    title: "Digital Marketing Course",
    price: "899/-",
    rating: 4.5,
    students: 6800,
  },
];

const PopularCoursesScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bookmarkedCourses, setBookmarkedCourses] = useState({});

  // Hàm toggle trạng thái bookmark
  const toggleBookmark = (id: string) => {
    setBookmarkedCourses((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Lọc khóa học theo danh mục và sắp xếp ưu tiên khóa học được bookmark
  const filteredCourses = coursesData
    .filter(
      (course) =>
        selectedCategory === "All" || course.category === selectedCategory
    )
    .sort(
      (a, b) =>
        (bookmarkedCourses[b.id] ? 1 : 0) - (bookmarkedCourses[a.id] ? 1 : 0)
    );

  return (
    <View style={styles.container}>
      {/* Thanh danh mục khóa học */}
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
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Danh sách khóa học */}
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        style={{ paddingBottom: 50 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseCard}
            onPress={() => router.push("/(tabs)/courses/detail")}
          >
            {/* Ảnh khóa học */}
            <View style={styles.courseImage} />
            <View style={styles.courseContent}>
              <Text style={styles.categoryLabel}>{item.category}</Text>
              <Text style={styles.courseTitle}>{item.title}</Text>
              <View style={styles.courseInfo}>
                <FontAwesome name="star" size={14} color="#FFD700" />
                <Text style={styles.rating}>{item.rating}</Text>
                <Text style={styles.students}>{item.students} Std</Text>
              </View>
              <Text style={styles.price}>{item.price}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleBookmark(item.id)}>
              <FontAwesome
                name={bookmarkedCourses[item.id] ? "bookmark" : "bookmark-o"}
                size={20}
                color={bookmarkedCourses[item.id] ? "#FFD700" : "#333"}
                style={styles.bookmarkIcon}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", padding: 10, marginBottom: 50 },
  categoryContainer: {
    flexDirection: "row",
    marginBottom: 10,
    paddingVertical: 10,
    zIndex: 1, // Đảm bảo thanh danh mục không che phủ nội dung khác
    // overflow: "visible",
  },
  categoryButton: {
    minWidth: 100, // Đảm bảo nút không quá nhỏ
    minHeight: 40, // Đảm bảo đủ chỗ hiển thị chữ
    paddingVertical: 10,
    paddingHorizontal: 15, // Điều chỉnh padding để nút không quá dài
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    marginHorizontal: 5, // Thay marginRight bằng marginHorizontal để cân đối
    alignItems: "center", // Căn giữa nội dung
    justifyContent: "center",
  },
  categoryButtonSelected: { backgroundColor: "#4CAF50" },
  categoryText: {
    fontSize: 13,
    color: "#333",
    textAlign: "center",
  },
  categoryTextSelected: { color: "#fff", fontWeight: "bold" },
  courseCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  courseImage: {
    width: 80,
    height: 80,
    backgroundColor: "#000",
    borderRadius: 8,
  },
  courseContent: { flex: 1, marginLeft: 10 },
  categoryLabel: { fontSize: 12, color: "#FF5733", fontWeight: "bold" },
  courseTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 5 },
  courseInfo: { flexDirection: "row", alignItems: "center", marginVertical: 3 },
  rating: { fontSize: 14, color: "#333", marginLeft: 5 },
  students: { fontSize: 12, color: "#666", marginLeft: 10 },
  price: { fontSize: 16, fontWeight: "bold", color: "#007BFF" },
  bookmarkIcon: { alignSelf: "center", marginLeft: 10 },
});

export default PopularCoursesScreen;
