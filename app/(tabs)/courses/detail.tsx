import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const sections = [
  {
    title: "Section 01 - Introduction",
    duration: "25 Mins",
    lessons: [
      {
        id: "1",
        title: "Why Using Graphic De..",
        time: "15 Mins",
        locked: false,
      },
      {
        id: "2",
        title: "Setup Your Graphic De..",
        time: "10 Mins",
        locked: false,
      },
    ],
  },
  {
    title: "Section 02 - Graphic Design",
    duration: "55 Mins",
    lessons: [
      {
        id: "3",
        title: "Take a Look Graphic De..",
        time: "08 Mins",
        locked: false,
      },
      {
        id: "4",
        title: "Working with Graphic De..",
        time: "25 Mins",
        locked: true,
      },
      {
        id: "5",
        title: "Working with Frame & Lay..",
        time: "12 Mins",
        locked: true,
      },
    ],
  },
];

export default function CourseScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Hàm lọc danh sách bài học theo từ khóa tìm kiếm
  const filteredSections = sections
    .map((section) => ({
      ...section,
      lessons: section.lessons.filter((lesson) =>
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((section) => section.lessons.length > 0); // Loại bỏ section rỗng
  return (
    <View
      style={{ flex: 1, backgroundColor: "#F8FAFC", paddingHorizontal: 20 }}
    >
      {/* Header */}
      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 20,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 15 }}>
          My Courses
        </Text>
      </View> */}

      {/* Search Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          padding: 10,
          marginTop: 20,
          borderRadius: 10,
        }}
      >
        <TextInput
          placeholder="Search for ..."
          style={{ flex: 1, fontSize: 16 }}
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity>
          <Ionicons name="search" size={20} color="blue" />
        </TouchableOpacity>
      </View>

      {/* Course Sections */}
      <FlatList
        data={filteredSections}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={{ marginTop: 20 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {item.title}
              </Text>
              <Text style={{ fontSize: 14, color: "blue" }}>
                {item.duration}
              </Text>
            </View>
            {item.lessons.map((lesson) => (
              <TouchableOpacity
                key={lesson.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "white",
                  padding: 10,
                  borderRadius: 10,
                  marginBottom: 5,
                }}
                onPress={() => router.push("/(tabs)/courses/list")}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "bold", marginRight: 10 }}
                >
                  {lesson.id.padStart(2, "0")}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={{ fontSize: 16 }}>
                    {lesson.title}
                  </Text>
                  <Text style={{ fontSize: 14, color: "gray" }}>
                    {lesson.time}
                  </Text>
                </View>
                {lesson.locked ? (
                  <Ionicons name="lock-closed" size={20} color="gray" />
                ) : (
                  <Ionicons
                    name="chevron-forward-circle-outline"
                    size={20}
                    color="blue"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      />

      {/* Continue Button */}
      {/* <View style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "blue",
            padding: 15,
            borderRadius: 30,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
              marginRight: 10,
            }}
          >
            Continue Courses
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View> */}
    </View>
  );
}
