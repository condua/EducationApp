import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import {
  getCourseById,
  clearCurrentCourse,
  enrollCourse,
  resetEnrollState,
} from "@/src/slices/courseSlice";
import { fetchCurrentUser } from "@/src/slices/profileSlice";

export default function CourseDetailScreen() {
  const router = useRouter();
  const dispatch = useDispatch<any>();

  const { id } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  // Trạng thái để chuyển đổi giữa Bài học và Bài kiểm tra
  const [activeTab, setActiveTab] = useState<"LESSONS" | "TESTS">("LESSONS");

  const {
    currentCourse,
    loadingDetail,
    errorDetail,
    enrollLoading,
    enrollSuccess,
    enrollError,
  } = useSelector((state: RootState) => state.course);

  const { enrolledCourses } = useSelector((state: any) => state.profile);

  useEffect(() => {
    if (id) {
      dispatch(getCourseById(id as string));
    }
    dispatch(fetchCurrentUser());

    return () => {
      dispatch(clearCurrentCourse());
      dispatch(resetEnrollState());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (enrollSuccess) {
      Alert.alert(
        "Thành công 🎉",
        "Bạn đã đăng ký khóa học thành công! Các bài học và bài kiểm tra đã được mở khóa.",
      );
      dispatch(resetEnrollState());
      dispatch(fetchCurrentUser());
    }
    if (enrollError) {
      Alert.alert("Lỗi", enrollError);
      dispatch(resetEnrollState());
    }
  }, [enrollSuccess, enrollError, dispatch]);

  const handleEnroll = () => {
    if (currentCourse?._id) {
      dispatch(enrollCourse(currentCourse._id));
    }
  };

  if (loadingDetail) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={{ marginTop: 12, color: "#6B7280" }}>
          Đang tải chi tiết khóa học...
        </Text>
      </View>
    );
  }

  if (errorDetail || !currentCourse) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="warning-outline" size={48} color="#EF4444" />
        <Text
          style={{
            marginTop: 12,
            color: "#EF4444",
            fontSize: 16,
            textAlign: "center",
          }}
        >
          {errorDetail || "Không tìm thấy thông tin khóa học."}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isEnrolled =
    enrolledCourses && enrolledCourses.includes(currentCourse._id);

  // Lọc dữ liệu bài học
  const rawChapters = currentCourse.chapters || [];
  const filteredChapters = rawChapters
    .map((chapter: any) => ({
      ...chapter,
      lessons:
        chapter.lessons?.filter((lesson: any) =>
          lesson.title?.toLowerCase().includes(searchQuery.toLowerCase()),
        ) || [],
    }))
    .filter((chapter: any) => chapter.lessons.length > 0);

  // Lọc dữ liệu bài kiểm tra (nếu bạn muốn tìm kiếm cả test)
  const rawTests = currentCourse.tests || [];
  const filteredTests = rawTests.filter((test: any) =>
    test.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <FlatList
        // Nếu ở tab LESSONS thì load chapter, nếu ở tab TESTS thì load tests
        data={activeTab === "LESSONS" ? filteredChapters : filteredTests}
        keyExtractor={(item, index) => item._id || index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.courseHeader}>
              <Image
                source={{ uri: currentCourse.thumbnail }}
                style={styles.thumbnail}
              />
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.categoryText}>
                  {currentCourse.category}
                </Text>
                <Text style={styles.courseTitleText} numberOfLines={2}>
                  {currentCourse.title}
                </Text>
                <Text style={styles.mentorText}>
                  Giảng viên:{" "}
                  <Text style={{ fontWeight: "bold", color: "#374151" }}>
                    {currentCourse.mentor?.name || "Đang cập nhật"}
                  </Text>
                </Text>
              </View>
            </View>

            {/* Chuyển đổi giữa Bài học và Bài kiểm tra */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === "LESSONS" && styles.tabButtonActive,
                ]}
                onPress={() => setActiveTab("LESSONS")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "LESSONS" && styles.tabTextActive,
                  ]}
                >
                  Bài giảng (
                  {rawChapters.reduce(
                    (acc, curr) => acc + (curr.lessons?.length || 0),
                    0,
                  )}
                  )
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === "TESTS" && styles.tabButtonActive,
                ]}
                onPress={() => setActiveTab("TESTS")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "TESTS" && styles.tabTextActive,
                  ]}
                >
                  Bài tập ({rawTests.length})
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons
                name="search-outline"
                size={20}
                color="#9CA3AF"
                style={styles.searchIcon}
              />
              <TextInput
                placeholder={
                  activeTab === "LESSONS"
                    ? "Tìm kiếm bài học..."
                    : "Tìm kiếm bài kiểm tra..."
                }
                placeholderTextColor="#9CA3AF"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        )}
        renderItem={({ item, index: itemIndex }) => {
          // NẾU ĐANG Ở TAB BÀI TẬP (TESTS)
          if (activeTab === "TESTS") {
            const test = item; // lúc này item là 1 Test
            const isTestLocked = !isEnrolled;

            return (
              <TouchableOpacity
                style={[styles.lessonCard, isTestLocked && { opacity: 0.6 }]}
                onPress={() => {
                  if (isTestLocked) {
                    Alert.alert(
                      "🔒 Khóa học bị khóa",
                      "Vui lòng bấm 'Đăng ký ngay' để làm bài tập.",
                    );
                    return;
                  }
                  // Điều hướng tới trang làm bài kiểm tra (Ví dụ: /test/[id])
                  // Thay thế bằng route thực tế của bạn nếu có
                  Alert.alert(
                    "Tính năng đang phát triển",
                    `Vào làm bài: ${test.title}`,
                  );
                }}
              >
                <View style={styles.testIconWrapper}>
                  <FontAwesome5
                    name="file-alt"
                    size={20}
                    color={PRIMARY_COLOR}
                  />
                </View>

                <View style={styles.lessonInfo}>
                  <Text numberOfLines={1} style={styles.lessonTitle}>
                    {test.title}
                  </Text>
                  <Text style={styles.lessonTime}>
                    <Ionicons name="time-outline" size={12} />{" "}
                    {test.durationInMinutes} Phút
                    {" • "} {test.questionGroups?.length || 0} Nhóm câu hỏi
                  </Text>
                </View>

                {isTestLocked ? (
                  <View style={styles.lockIconBox}>
                    <Ionicons name="lock-closed" size={18} color="#9CA3AF" />
                  </View>
                ) : (
                  <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            );
          }

          // NẾU ĐANG Ở TAB BÀI HỌC (LESSONS)
          const chapter = item; // lúc này item là 1 Chapter
          const totalDuration = chapter.lessons.reduce(
            (sum: number, lesson: any) =>
              sum + (parseInt(lesson.durationInMinutes || lesson.time) || 0),
            0,
          );

          return (
            <View style={styles.chapterContainer}>
              <View style={styles.chapterHeader}>
                <Text style={styles.chapterTitle}>{chapter.title}</Text>
                <Text style={styles.chapterDuration}>{totalDuration} phút</Text>
              </View>

              {chapter.lessons.map((lesson: any, index: number) => {
                const prevLesson =
                  index > 0
                    ? chapter.lessons[index - 1]
                    : filteredChapters[itemIndex - 1]?.lessons.slice(-1)[0] ||
                      null;

                const nextLesson =
                  index < chapter.lessons.length - 1
                    ? chapter.lessons[index + 1]
                    : filteredChapters[itemIndex + 1]?.lessons[0] || null;

                const isLessonLocked = !isEnrolled;

                return (
                  <TouchableOpacity
                    key={lesson._id || index}
                    style={[
                      styles.lessonCard,
                      isLessonLocked && { opacity: 0.6 },
                    ]}
                    onPress={() => {
                      if (isLessonLocked) {
                        Alert.alert(
                          "🔒 Khóa học bị khóa",
                          "Vui lòng bấm 'Đăng ký ngay' ở bên dưới để mở khóa bài giảng.",
                        );
                        return;
                      }

                      router.push({
                        pathname: "/(tabs)/courses/list",
                        params: {
                          lesson: JSON.stringify(lesson),
                          prevLesson: prevLesson
                            ? JSON.stringify(prevLesson)
                            : "",
                          nextLesson: nextLesson
                            ? JSON.stringify(nextLesson)
                            : "",
                          chapters: JSON.stringify(filteredChapters),
                        },
                      });
                    }}
                  >
                    <Text style={styles.lessonNumber}>
                      {index >= 9 ? index + 1 : `0${index + 1}`}
                    </Text>

                    <View style={styles.lessonInfo}>
                      <Text numberOfLines={1} style={styles.lessonTitle}>
                        {lesson.title}
                      </Text>
                      <Text style={styles.lessonTime}>
                        {lesson.durationInMinutes || lesson.time || 0} Phút
                      </Text>
                    </View>

                    {isLessonLocked ? (
                      <View style={styles.lockIconBox}>
                        <Ionicons
                          name="lock-closed"
                          size={18}
                          color="#9CA3AF"
                        />
                      </View>
                    ) : (
                      <Ionicons name="play-circle" size={36} color="#4F46E5" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {activeTab === "LESSONS"
              ? "Chưa có bài học nào."
              : "Chưa có bài kiểm tra nào."}
          </Text>
        }
      />

      {/* Footer Nút Đăng Ký */}
      <View style={styles.footerContainer}>
        {isEnrolled ? (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#10B981" }]}
            onPress={() =>
              Alert.alert(
                "Thông báo",
                "Hãy chọn một bài học ở danh sách bên trên để bắt đầu nhé!",
              )
            }
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color="#FFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.actionButtonText}>Tiếp tục học</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleEnroll}
            disabled={enrollLoading}
          >
            {enrollLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.actionButtonText}>Đăng ký ngay • </Text>
                <Text style={styles.actionButtonPrice}>
                  {currentCourse.price === "Miễn Phí"
                    ? "Miễn Phí"
                    : `${currentCourse.price}`}
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const PRIMARY_COLOR = "#4F46E5";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  centerContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: "#EEF2FF",
    borderRadius: 8,
  },
  backButtonText: { color: PRIMARY_COLOR, fontWeight: "bold", fontSize: 16 },

  courseHeader: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },
  categoryText: {
    fontSize: 12,
    color: PRIMARY_COLOR,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  courseTitleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
    lineHeight: 22,
  },
  mentorText: { fontSize: 13, color: "#6B7280" },

  // Tab Switcher Bài học / Bài kiểm tra
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    padding: 4,
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
  tabText: { fontSize: 14, fontWeight: "600", color: "#6B7280" },
  tabTextActive: { color: PRIMARY_COLOR },

  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: "#111827", height: 40 },

  chapterContainer: { marginTop: 10, paddingHorizontal: 16 },
  chapterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  chapterTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  chapterDuration: { fontSize: 14, color: PRIMARY_COLOR, fontWeight: "600" },

  lessonCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    marginHorizontal: 16,
  },
  lessonNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#E5E7EB",
    marginRight: 16,
    width: 35,
  },
  testIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  lessonInfo: { flex: 1 },
  lessonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  lessonTime: { fontSize: 13, color: "#6B7280" },

  lockIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: { textAlign: "center", marginTop: 40, color: "#6B7280" },

  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },
  actionButton: {
    backgroundColor: PRIMARY_COLOR,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  actionButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  actionButtonPrice: { color: "#FFF", fontSize: 16, fontWeight: "500" },
});
