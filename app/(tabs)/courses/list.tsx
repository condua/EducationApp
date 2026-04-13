import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";

export default function LessonScreen() {
  const router = useRouter();

  // Lấy dữ liệu từ URL params
  const { lesson, prevLesson, nextLesson, chapters } = useLocalSearchParams();

  // Parse JSON an toàn
  const currentLesson = lesson ? JSON.parse(lesson as string) : null;
  const previous = prevLesson ? JSON.parse(prevLesson as string) : null;
  const upcoming = nextLesson ? JSON.parse(nextLesson as string) : null;

  // Hàm xử lý chuyển bài học
  const goToLesson = (targetLesson: any, isNext: boolean) => {
    if (!targetLesson) return;

    // Ghi chú: Để thuật toán Prev/Next hoạt động liên tục ở các bài tiếp theo,
    // lý tưởng nhất là bạn nên truyền `chapterIndex` và `lessonIndex` qua params
    // và tính toán lại `prevLesson`/`nextLesson` ngay tại màn hình này.
    // Tạm thời mình dùng lại logic có sẵn của bạn.
    router.replace({
      pathname: "/(tabs)/courses/list",
      params: {
        lesson: JSON.stringify(targetLesson),
        chapters: chapters, // Giữ nguyên chapters
        // (Bạn sẽ cần logic tìm lại prev/next của targetLesson ở đây để truyền đúng)
      },
    });
  };

  if (!currentLesson) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Không thể tải bài học.</Text>
      </View>
    );
  }

  // Tách Youtube ID để nhúng (Nếu youtubeUrl là link đầy đủ)
  // Ví dụ: https://www.youtube.com/watch?v=dQw4w9WgXcQ -> dQw4w9WgXcQ
  const getYoutubeVideoId = (url: string) => {
    if (!url) return "";
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : url;
  };

  const videoId = getYoutubeVideoId(currentLesson.youtubeUrl);
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0`
    : "";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.lessonTitle}>{currentLesson.title}</Text>
      <Text style={styles.lessonTime}>
        <Ionicons name="time-outline" size={14} /> Thời lượng:{" "}
        {currentLesson.time} phút
      </Text>

      {/* Video Player */}
      <View style={styles.videoContainer}>
        {embedUrl ? (
          <WebView
            style={styles.video}
            source={{ uri: embedUrl }}
            allowsFullscreenVideo
            javaScriptEnabled
            domStorageEnabled
          />
        ) : (
          <View style={styles.noVideoBox}>
            <Ionicons name="videocam-off-outline" size={40} color="#9CA3AF" />
            <Text style={{ color: "#9CA3AF", marginTop: 10 }}>
              Video chưa được cập nhật
            </Text>
          </View>
        )}
      </View>

      {/* Thông tin giảng viên */}
      <View style={styles.instructorContainer}>
        <Image
          source={{
            uri: "https://ui-avatars.com/api/?name=Instructor&background=E5E7EB&color=374151",
          }}
          style={styles.instructorImage}
        />
        <View>
          <Text style={styles.instructorName}>Giảng viên: Phan Hoàng Phúc</Text>
          <Text style={styles.instructorRole}>Chuyên gia Giáo dục</Text>
        </View>
      </View>

      {/* Nút thao tác */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.secondaryButton}>
          <Ionicons
            name="document-text-outline"
            size={18}
            color="#4B5563"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.secondaryButtonText}>Tài liệu PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton}>
          <Ionicons
            name="create-outline"
            size={18}
            color="#FFF"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.primaryButtonText}>Làm bài tập</Text>
        </TouchableOpacity>
      </View>

      {/* Điều hướng Bài học */}
      <View style={styles.navigationBox}>
        {previous && (
          <View style={styles.navSection}>
            <Text style={styles.sectionTitle}>Bài trước</Text>
            <TouchableOpacity
              style={styles.lessonItem}
              onPress={() => goToLesson(previous, false)}
            >
              <View style={styles.navIconBox}>
                <Ionicons name="chevron-back" size={20} color="#4F46E5" />
              </View>
              <Text style={styles.lessonName} numberOfLines={1}>
                {previous.title}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {upcoming && (
          <View style={[styles.navSection, { marginTop: previous ? 20 : 0 }]}>
            <Text style={styles.sectionTitle}>Bài tiếp theo</Text>
            <TouchableOpacity
              style={styles.lessonItem}
              onPress={() => goToLesson(upcoming, true)}
            >
              <Text
                style={[styles.lessonName, { textAlign: "right" }]}
                numberOfLines={1}
              >
                {upcoming.title}
              </Text>
              <View style={styles.navIconBox}>
                <Ionicons name="chevron-forward" size={20} color="#4F46E5" />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={{ paddingBottom: 40 }} />
    </ScrollView>
  );
}

const PRIMARY_COLOR = "#4F46E5";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  lessonTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  lessonTime: { fontSize: 14, color: "#6B7280", marginBottom: 20 },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9, // Tỉ lệ chuẩn của video YouTube
    backgroundColor: "#000",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  video: { flex: 1 },
  noVideoBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  instructorContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F3F4F6",
    marginBottom: 20,
  },
  instructorImage: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  instructorName: { fontSize: 15, fontWeight: "600", color: "#111827" },
  instructorRole: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
  },
  secondaryButtonText: { fontSize: 15, fontWeight: "600", color: "#4B5563" },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: { color: "#FFF", fontSize: 15, fontWeight: "600" },
  navigationBox: {
    backgroundColor: "#F9FAFB",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  navSection: {},
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  lessonItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lessonName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    flex: 1,
    marginHorizontal: 12,
  },
  navIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
});
