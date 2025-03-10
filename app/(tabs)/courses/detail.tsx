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
import { useLocalSearchParams } from "expo-router";

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
  const { id, title, category, price, rating, students, thumbnail, chapters } =
    useLocalSearchParams();
  console.log(chapters);
  // ✅ Hàm lọc danh sách bài học theo từ khóa tìm kiếm
  // ✅ Chuyển `chapters` từ JSON string thành mảng
  const parsedChapters = chapters ? JSON.parse(chapters) : [];

  // ✅ Hàm lọc danh sách bài học theo từ khóa tìm kiếm
  const filteredChapters = parsedChapters
    .map((chapter) => ({
      ...chapter,
      lessons: chapter.lessons.filter((lesson) =>
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((chapter) => chapter.lessons.length > 0); // Loại bỏ chapters rỗng

  console.log(filteredChapters); // Kiểm tra kết quả sau khi lọc
  return (
    <View
      style={{ flex: 1, backgroundColor: "#F8FAFC", paddingHorizontal: 20 }}
    >
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
        data={filteredChapters}
        keyExtractor={(item) => item.title}
        showsVerticalScrollIndicator={false} // Ẩn thanh kéo dọc
        renderItem={({ item, index: chapterIndex }) => (
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
                {item.lessons.reduce((sum, lesson) => sum + lesson.time, 0)}{" "}
                mins
              </Text>
            </View>
            {item.lessons.map((lesson, index) => {
              const prevLesson =
                index > 0
                  ? item.lessons[index - 1]
                  : filteredChapters[chapterIndex - 1]?.lessons.slice(-1)[0] ||
                    null;

              const nextLesson =
                index < item.lessons.length - 1
                  ? item.lessons[index + 1]
                  : filteredChapters[chapterIndex + 1]?.lessons[0] || null;

              const prevprevLesson =
                index > 1
                  ? item.lessons[index - 2]
                  : index === 1
                  ? filteredChapters[chapterIndex - 1]?.lessons.slice(-1)[0] ||
                    null
                  : filteredChapters[chapterIndex - 1]?.lessons.slice(
                      -2,
                      -1
                    )[0] || null;

              const nextNextLesson =
                index < item.lessons.length - 2
                  ? item.lessons[index + 2]
                  : index === item.lessons.length - 2
                  ? filteredChapters[chapterIndex + 1]?.lessons[0] || null
                  : filteredChapters[chapterIndex + 1]?.lessons[1] || null;

              return (
                <TouchableOpacity
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "white",
                    padding: 10,
                    borderRadius: 10,
                    marginBottom: 5,
                  }}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/courses/list",
                      params: {
                        lesson: JSON.stringify(lesson),
                        prevLesson: prevLesson
                          ? JSON.stringify(prevLesson)
                          : null,
                        nextLesson: nextLesson
                          ? JSON.stringify(nextLesson)
                          : null,
                        prevprevLesson: prevprevLesson
                          ? JSON.stringify(prevprevLesson)
                          : null,
                        nextNextLesson: nextNextLesson
                          ? JSON.stringify(nextNextLesson)
                          : null,
                        chapters: chapters,
                      },
                    })
                  }
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      marginRight: 10,
                    }}
                  >
                    {index >= 9 ? index + 1 : "0" + (index + 1)}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={{ fontSize: 16 }}>
                      {lesson.title}
                    </Text>
                    <Text style={{ fontSize: 14, color: "gray" }}>
                      {lesson.time} Mins
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
              );
            })}
          </View>
        )}
      />
    </View>
  );
}
