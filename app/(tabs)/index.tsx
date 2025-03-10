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
import { FontAwesome, Feather } from "@expo/vector-icons";
import LinearGradient from "react-native-linear-gradient";
import { router } from "expo-router";
const categories = ["All", "Graphic Design", "3D Design", "Arts & Humanities"];
const courses = [
  {
    id: "1",
    title: "Graphic Design Advanced",
    price: "850/-",
    rating: "4.2",
    students: "7830 Std",
    category: "Graphic Design",
  },
  {
    id: "2",
    title: "Advertisement Design",
    price: "400/-",
    rating: "4.0",
    students: "5000 Std",
    category: "Graphic Design",
  },
  {
    id: "3",
    title: "3D Animation",
    price: "600/-",
    rating: "4.5",
    students: "6000 Std",
    category: "3D Design",
  },
];
const mentors = ["Phúc", "Aman", "Rahul.J", "Manav", "Emily", "John"];

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredCourses = courses.filter(
    (course) =>
      (selectedCategory === "All" || course.category === selectedCategory) &&
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Hi, Phan Hoàng Phúc</Text>
        <FontAwesome name="bell" size={24} color="black" />
      </View>
      <Text style={styles.subText}>What would you like to learn today?</Text>
      {/* <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for.."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View> */}
      {/* Advertisement */}
      <View style={styles.adContainer}>
        <Text style={styles.adTitle}>25% OFF*</Text>
        <Text style={styles.adText}>Today's Special</Text>
        <Text style={styles.adDesc}>
          Get a Discount for Every Course Order only Valid for Today!
        </Text>
      </View>
      {/* Categories */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/courses")}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
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
      {/* Courses */}
      <FlatList
        data={filteredCourses}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingTop: 20, paddingBottom: 10 }}
        renderItem={({ item }) => (
          <View style={styles.courseCard}>
            <View style={styles.courseImage}></View>
            <Text style={styles.courseTitle}>{item.title}</Text>
            <Text style={styles.coursePrice}>{item.price}</Text>
            <Text style={styles.courseRating}>
              {item.rating} ⭐ | {item.students}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      {/* Mentors */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top Mentors</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/mentors")}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={mentors}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.mentorCard}>
            <View style={styles.mentorImage}></View>
            <Text style={styles.mentorName}>{item}</Text>
          </View>
        )}
        keyExtractor={(item) => item}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFF", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: { fontSize: 22, fontWeight: "bold" },
  subText: { fontSize: 14, color: "gray", marginBottom: 10 },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#EEE",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  searchInput: { flex: 1, fontSize: 16 },
  filterIcon: {
    backgroundColor: "blue",
    padding: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
  adContainer: {
    padding: 15,
    backgroundColor: "lightblue",
    borderRadius: 10,
    marginVertical: 10,
  },
  adTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
  adText: { color: "white", fontSize: 16 },
  adDesc: { color: "white", fontSize: 14, marginTop: 5 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  seeAllText: { fontSize: 14, color: "blue" },
  categoryItem: {
    minWidth: 80,
    paddingVertical: 10,
    paddingHorizontal: 20, // Điều chỉnh padding để nút không quá dài
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    marginHorizontal: 5, // Thay marginRight bằng marginHorizontal để cân đối
    alignItems: "center", // Căn giữa nội dung
    justifyContent: "center",
  },
  categoryText: { fontSize: 14 },
  categorySelectedText: {
    color: "white",
    fontWeight: "bold",
  },
  selectedCategory: { backgroundColor: "#4CAF50", color: "white" },

  courseCard: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    width: 150,
  },
  courseImage: { height: 80, backgroundColor: "#000", borderRadius: 10 },
  courseTitle: { fontSize: 14, fontWeight: "bold", marginVertical: 5 },
  coursePrice: { fontSize: 14, color: "green" },
  courseRating: { fontSize: 12, color: "gray" },
  mentorCard: { alignItems: "center", marginRight: 10 },
  mentorImage: {
    width: 60,
    height: 60,
    backgroundColor: "#000",
    borderRadius: 30,
  },
  mentorName: { fontSize: 14, marginTop: 5 },
});

export default HomeScreen;
