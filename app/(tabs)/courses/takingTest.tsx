import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_COLOR = "#4F46E5";

export default function TakingTestScreen() {
  const router = useRouter();

  // Lấy dữ liệu bài test truyền từ màn hình trước
  const { testData } = useLocalSearchParams();
  const test = testData ? JSON.parse(testData as string) : null;

  // States
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false); // Trạng thái sẵn sàng render UI
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Key để lưu AsyncStorage (Dựa vào ID bài test để không bị nhầm lẫn)
  const STORAGE_KEY = `@test_progress_${test?._id}`;
  const END_TIME_KEY = `@test_endtime_${test?._id}`;

  // 1. KHỞI TẠO BÀI TEST & PHỤC HỒI DỮ LIỆU
  useEffect(() => {
    if (!test) return;

    const loadTestProgress = async () => {
      try {
        // Lấy dữ liệu cũ từ bộ nhớ
        const savedAnswers = await AsyncStorage.getItem(STORAGE_KEY);
        const savedEndTime = await AsyncStorage.getItem(END_TIME_KEY);

        if (savedAnswers) {
          setAnswers(JSON.parse(savedAnswers));
        }

        if (savedEndTime) {
          // Đã từng làm -> Tính lại thời gian còn lại
          const endTime = parseInt(savedEndTime, 10);
          const now = Date.now();
          const remaining = Math.floor((endTime - now) / 1000);

          if (remaining <= 0) {
            handleTimeUp();
          } else {
            setTimeLeft(remaining);
          }
        } else {
          // Mới làm lần đầu -> Tạo EndTime mới
          const durationInSeconds = test.durationInMinutes * 60;
          const endTime = Date.now() + durationInSeconds * 1000;
          await AsyncStorage.setItem(END_TIME_KEY, endTime.toString());
          setTimeLeft(durationInSeconds);
        }
        setIsReady(true);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu bài test:", error);
      }
    };

    loadTestProgress();
  }, []);

  // 2. CHẠY ĐỒNG HỒ ĐẾM NGƯỢC
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev && prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  // Hàm fomat thời gian ra dạng MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // 3. XỬ LÝ CHỌN ĐÁP ÁN
  const handleSelectAnswer = async (
    questionId: string,
    optionIndex: number,
  ) => {
    const newAnswers = { ...answers, [questionId]: optionIndex };
    setAnswers(newAnswers);

    // Lưu ngay lập tức xuống máy, để out app không bị mất
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newAnswers));
  };

  // 4. XỬ LÝ KHI HẾT GIỜ HOẶC NỘP BÀI
  const handleTimeUp = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    Alert.alert("Hết giờ!", "Hệ thống đã tự động nộp bài của bạn.", [
      { text: "Xem kết quả", onPress: calculateAndFinish },
    ]);
  };

  const confirmSubmit = () => {
    Alert.alert(
      "Nộp bài",
      "Bạn có chắc chắn muốn nộp bài không? Bạn không thể thay đổi sau khi nộp.",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Nộp bài", onPress: calculateAndFinish },
      ],
    );
  };

  const calculateAndFinish = async () => {
    setIsSubmitted(true);

    let score = 0;
    let totalQuestions = 0;

    // Chấm điểm
    test.questionGroups.forEach((group: any) => {
      group.group_questions.forEach((q: any) => {
        totalQuestions++;
        if (answers[q._id] === q.correctAnswer) {
          score++;
        }
      });
    });

    // Xóa dữ liệu tạm thời
    await AsyncStorage.removeItem(STORAGE_KEY);
    await AsyncStorage.removeItem(END_TIME_KEY);

    // TODO: Bắn API nộp bài lên Server ở đây nếu có

    Alert.alert(
      "Kết quả",
      `Bạn đã đúng ${score}/${totalQuestions} câu!\n\nNhấn OK để quay về trang chi tiết.`,
      [{ text: "OK", onPress: () => router.back() }],
    );
  };

  // Nếu chưa lấy xong AsyncStorage thì hiện loading
  if (!isReady || !test) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={{ marginTop: 10 }}>Đang chuẩn bị đề thi...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER: Tiêu đề & Đồng hồ cố định ở trên cùng */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {test.title}
          </Text>
        </View>
        <View style={styles.timerBox}>
          <Ionicons name="time-outline" size={18} color="#EF4444" />
          <Text style={styles.timerText}>
            {timeLeft !== null ? formatTime(timeLeft) : "00:00"}
          </Text>
        </View>
      </View>

      {/* BODY: Danh sách câu hỏi */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {test.description && (
          <Text style={styles.testDescription}>{test.description}</Text>
        )}

        {test.questionGroups.map((group: any, gIndex: number) => (
          <View key={group._id || gIndex} style={styles.groupContainer}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            {group.instructions && (
              <Text style={styles.groupInstruction}>{group.instructions}</Text>
            )}

            {/* Nếu có đoạn văn đọc hiểu */}
            {group.passage && (
              <View style={styles.passageBox}>
                <Text style={styles.passageText}>{group.passage}</Text>
              </View>
            )}

            {/* Các câu hỏi trong nhóm */}
            {group.group_questions.map((q: any, qIndex: number) => (
              <View key={q._id || qIndex} style={styles.questionBox}>
                <Text style={styles.questionText}>
                  <Text style={{ fontWeight: "bold" }}>Câu {qIndex + 1}: </Text>
                  {q.question}
                </Text>

                {q.options.map((option: string, optIndex: number) => {
                  const isSelected = answers[q._id] === optIndex;

                  return (
                    <TouchableOpacity
                      key={optIndex}
                      style={[
                        styles.optionButton,
                        isSelected && styles.optionButtonSelected,
                      ]}
                      onPress={() => handleSelectAnswer(q._id, optIndex)}
                      disabled={isSubmitted}
                    >
                      <View
                        style={[
                          styles.radioCircle,
                          isSelected && styles.radioCircleSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* FOOTER: Nút nộp bài */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitted && { backgroundColor: "gray" },
          ]}
          onPress={confirmSubmit}
          disabled={isSubmitted}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitted ? "Đã nộp bài" : "Nộp bài"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9FAFB" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  timerBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#EF4444",
    marginLeft: 4,
  },

  container: { padding: 16 },
  testDescription: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 16,
    fontStyle: "italic",
  },

  groupContainer: { marginBottom: 24 },
  groupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginBottom: 4,
  },
  groupInstruction: { fontSize: 14, color: "#6B7280", marginBottom: 12 },
  passageBox: {
    backgroundColor: "#EEF2FF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  passageText: { fontSize: 15, lineHeight: 24, color: "#374151" },

  questionBox: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  questionText: {
    fontSize: 16,
    color: "#111827",
    lineHeight: 24,
    marginBottom: 12,
  },

  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginBottom: 8,
    backgroundColor: "#FFF",
  },
  optionButtonSelected: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: "#EEF2FF",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioCircleSelected: { borderColor: PRIMARY_COLOR },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: PRIMARY_COLOR,
  },
  optionText: { fontSize: 15, color: "#374151", flex: 1 },
  optionTextSelected: { color: PRIMARY_COLOR, fontWeight: "600" },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },
  submitButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
