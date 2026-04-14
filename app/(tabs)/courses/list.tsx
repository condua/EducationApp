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

// 1. CẤU HÌNH DANH TÍNH ỨNG DỤNG THEO CHÍNH SÁCH YOUTUBE
// Thay "vn.edu.mlpa.app" bằng đúng "package" (Android) hoặc "bundleIdentifier" (iOS) trong app.json
const APP_BUNDLE_ID = "com.condua1755.EduacationApp";
const APP_REFERER = `https://${APP_BUNDLE_ID.toLowerCase()}`;

export default function LessonScreen() {
  const router = useRouter();

  const { lesson, prevLesson, nextLesson, chapters } = useLocalSearchParams();

  const currentLesson = lesson ? JSON.parse(lesson as string) : null;
  const previous = prevLesson ? JSON.parse(prevLesson as string) : null;
  const upcoming = nextLesson ? JSON.parse(nextLesson as string) : null;

  const goToLesson = (targetLesson: any) => {
    if (!targetLesson) return;
    router.replace({
      pathname: "/(tabs)/courses/list",
      params: {
        lesson: JSON.stringify(targetLesson),
        chapters: chapters,
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

  const getYoutubeVideoId = (url: string) => {
    if (!url) return "";
    const regExp =
      /(?:youtube\.com\/(?:.*v=|.*\/|embed\/)|youtu\.be\/)([^#\&\?]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : "";
  };

  const videoId = getYoutubeVideoId(currentLesson.lectureUrl);
  console.log("Video ID:", videoId);
  // 2. TẠO HTML CỤC BỘ TUÂN THỦ CHÍNH SÁCH
  // Bắt buộc thêm tham số origin=${APP_REFERER} vào link embed
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            background-color: #000; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            overflow: hidden; 
          }
          iframe { 
            width: 100%; 
            height: 100%; 
            border: none; 
          }
        </style>
      </head>
      <body>
        <iframe 
          src="https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&modestbranding=1&rel=0&origin=${APP_REFERER}" 
          frameborder="0" 
          allow="autoplay; fullscreen; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </body>
    </html>
  `;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.lessonTitle}>{currentLesson.title}</Text>

      <Text style={styles.lessonTime}>
        <Ionicons name="time-outline" size={14} /> Thời lượng:{" "}
        {currentLesson.time} phút
      </Text>

      {/* 🎬 VIDEO PLAYER */}
      <View style={styles.videoContainer}>
        {videoId ? (
          <WebView
            style={styles.video}
            source={{
              html: htmlContent,
              baseUrl: APP_REFERER, // THIẾT LẬP HTTP Referer ĐÚNG CHUẨN
            }}
            allowsFullscreenVideo={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            originWhitelist={["*"]}
            bounces={false}
            scrollEnabled={false}
            // Đã loại bỏ hoàn toàn thuộc tính renderLoading để không vi phạm chính sách "Lớp phủ và khung hình"
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

      {/* 👨‍🏫 GIẢNG VIÊN */}
      <View style={styles.instructorContainer}>
        <Image
          source={{
            uri: "https://ui-avatars.com/api/?name=PP&background=22c55e&color=fff",
          }}
          style={styles.instructorImage}
        />
        <View>
          <Text style={styles.instructorName}>Giảng viên: Phan Hoàng Phúc</Text>
          <Text style={styles.instructorRole}>Chuyên gia Giáo dục</Text>
        </View>
      </View>

      {/* 🎯 BUTTON */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.secondaryButton}>
          <Ionicons name="document-text-outline" size={18} color="#4B5563" />
          <Text style={styles.secondaryButtonText}>Tài liệu PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton}>
          <Ionicons name="create-outline" size={18} color="#FFF" />
          <Text style={styles.primaryButtonText}>Làm bài tập</Text>
        </TouchableOpacity>
      </View>

      {/* 🔁 NAVIGATION */}
      <View style={styles.navigationBox}>
        {previous && (
          <TouchableOpacity
            style={styles.lessonItem}
            onPress={() => goToLesson(previous)}
          >
            <Ionicons name="chevron-back" size={20} color="#22c55e" />
            <Text style={styles.lessonName}>{previous.title}</Text>
          </TouchableOpacity>
        )}

        {upcoming && (
          <TouchableOpacity
            style={styles.lessonItem}
            onPress={() => goToLesson(upcoming)}
          >
            <Text style={styles.lessonName}>{upcoming.title}</Text>
            <Ionicons name="chevron-forward" size={20} color="#22c55e" />
          </TouchableOpacity>
        )}
      </View>

      <View style={{ paddingBottom: 40 }} />
    </ScrollView>
  );
}

const PRIMARY_COLOR = "#22c55e";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  lessonTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#064e3b",
    marginBottom: 6,
  },
  lessonTime: { fontSize: 14, color: "#6B7280", marginBottom: 20 },

  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    minHeight: 200, // Đảm bảo đáp ứng chính sách: kích thước hiển thị tối thiểu 200x200 pixel
    backgroundColor: "#000",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },

  video: { flex: 1, opacity: 0.99 },
  noVideoBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  instructorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  instructorImage: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  instructorName: { fontSize: 15, fontWeight: "600", color: "#111827" },
  instructorRole: { fontSize: 13, color: "#6B7280" },
  buttonContainer: { flexDirection: "row", gap: 12, marginBottom: 30 },
  secondaryButton: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    backgroundColor: "#ecfdf5",
    borderRadius: 12,
  },
  secondaryButtonText: { fontWeight: "600", color: "#065f46" },
  primaryButton: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
  },
  primaryButtonText: { color: "#FFF", fontWeight: "600" },
  navigationBox: { backgroundColor: "#ffffff", padding: 16, borderRadius: 12 },
  lessonItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  lessonName: { fontSize: 15, fontWeight: "600", color: "#1F2937" },
});
