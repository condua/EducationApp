import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { WebView } from "react-native-webview";

const LessonScreen = () => {
  const router = useRouter();
  const { lesson, prevLesson, nextLesson, chapters } = useLocalSearchParams();

  const parsedChapters = chapters ? JSON.parse(chapters) : [];
  const currentLesson = lesson ? JSON.parse(lesson) : null;

  // Tìm vị trí của currentLesson trong chapters
  let currentChapterIndex = -1;
  let currentLessonIndex = -1;

  for (let i = 0; i < parsedChapters.length; i++) {
    const lessonIndex = parsedChapters[i].lessons.findIndex(
      (l) => l._id === currentLesson?._id
    );
    if (lessonIndex !== -1) {
      currentChapterIndex = i;
      currentLessonIndex = lessonIndex;
      break;
    }
  }

  // Xác định prevLesson và nextLesson mới
  let previousLesson = null;
  let upcomingLesson = null;

  if (currentChapterIndex !== -1 && currentLessonIndex !== -1) {
    if (currentLessonIndex > 0) {
      // Lùi lại 1 bài trong cùng chương
      previousLesson =
        parsedChapters[currentChapterIndex].lessons[currentLessonIndex - 1];
    } else if (currentChapterIndex > 0) {
      // Nếu là bài đầu tiên của chương, lấy bài cuối của chương trước
      const prevChapter = parsedChapters[currentChapterIndex - 1];
      previousLesson = prevChapter.lessons[prevChapter.lessons.length - 1];
    }

    if (
      currentLessonIndex <
      parsedChapters[currentChapterIndex].lessons.length - 1
    ) {
      // Tiến lên 1 bài trong cùng chương
      upcomingLesson =
        parsedChapters[currentChapterIndex].lessons[currentLessonIndex + 1];
    } else if (currentChapterIndex < parsedChapters.length - 1) {
      // Nếu là bài cuối của chương, lấy bài đầu của chương tiếp theo
      const nextChapter = parsedChapters[currentChapterIndex + 1];
      upcomingLesson = nextChapter.lessons[0];
    }
  }

  // Xử lý điều hướng khi nhấn vào bài học trước hoặc sau
  const goToLesson = (selectedLesson) => {
    router.push({
      pathname: "/(tabs)/courses/list",
      params: {
        lesson: JSON.stringify(selectedLesson),
        prevLesson: JSON.stringify(previousLesson),
        nextLesson: JSON.stringify(upcomingLesson),
        chapters: JSON.stringify(parsedChapters),
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.progressContainer}>
        <Text style={styles.progressText}>My progress</Text>
        <Text style={styles.score}>Score: 96.3%</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: "96%" }]} />
        </View>
      </View> */}

      {/* <Text style={styles.sectionTitle}>Current lesson</Text> */}
      <Text style={styles.lessonTitle}>{currentLesson?.title}</Text>

      <View style={styles.videoContainer}>
        <WebView
          style={styles.video}
          source={{ uri: currentLesson?.youtubeUrl }}
          allowsFullscreenVideo
          javaScriptEnabled
          domStorageEnabled
        />
      </View>

      <View style={styles.instructorContainer}>
        <Image
          source={{ uri: "https://via.placeholder.com/40" }}
          style={styles.instructorImage}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>📎 PDF lesson material</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Home tasks</Text>
        </TouchableOpacity>
      </View>

      {/* Bài giảng trước đó */}
      {previousLesson && (
        <>
          <Text style={styles.sectionTitle}>Previous lesson</Text>
          <TouchableOpacity
            style={styles.lessonItem}
            onPress={() => goToLesson(previousLesson)}
          >
            <Text style={styles.lessonName}>{previousLesson.title}</Text>
            <Text style={styles.lessonTime}>{previousLesson.time} min ←</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Bài giảng tiếp theo */}
      {upcomingLesson && (
        <>
          <Text style={styles.sectionTitle}>Next lesson</Text>
          <TouchableOpacity
            style={styles.lessonItem}
            onPress={() => goToLesson(upcomingLesson)}
          >
            <Text style={styles.lessonName}>{upcomingLesson.title}</Text>
            <Text style={styles.lessonTime}>{upcomingLesson.time} min →</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={{ paddingBottom: 30 }}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFF",
    padding: 16,
    overflow: "hidden",
  },
  progressContainer: {
    backgroundColor: "#E8F0FF",
    padding: 10,
    borderRadius: 10,
  },
  progressText: { fontSize: 14, color: "#555" },
  score: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
  progressBar: {
    height: 8,
    backgroundColor: "#D0E2FF",
    borderRadius: 5,
    marginTop: 5,
  },
  progressFill: { height: "100%", backgroundColor: "#357AFF", borderRadius: 5 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 20 },
  lessonTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  videoContainer: {
    height: 200,
    backgroundColor: "#000",
    borderRadius: 10,
    overflow: "hidden",
  },
  video: { flex: 1 },
  instructorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  instructorImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  secondaryButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#000",
  },
  secondaryButtonText: { fontSize: 14 },
  primaryButton: { backgroundColor: "#357AFF", padding: 10, borderRadius: 10 },
  primaryButtonText: { color: "#FFF", fontSize: 14 },
  lessonItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  lessonName: { fontSize: 16 },
  lessonTime: { fontSize: 14, color: "#777" },
});

export default LessonScreen;
