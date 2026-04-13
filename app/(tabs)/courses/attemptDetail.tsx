import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import {
  fetchSpecificAttempt,
  clearCurrentAttempt,
} from "@/src/slices/testSlice";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_COLOR = "#4F46E5";

export default function AttemptDetailScreen() {
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const { attemptId } = useLocalSearchParams();

  const { currentAttempt, loading, error } = useSelector(
    (state: RootState) => state.test,
  );

  useEffect(() => {
    if (attemptId) {
      dispatch(fetchSpecificAttempt(attemptId as string));
    }
    return () => {
      dispatch(clearCurrentAttempt());
    };
  }, [attemptId, dispatch]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={{ marginTop: 10 }}>Đang tải kết quả chi tiết...</Text>
      </View>
    );
  }

  if (error || !currentAttempt) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={50} color="#EF4444" />
        <Text style={styles.errorText}>
          {error || "Không tìm thấy dữ liệu bài làm."}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={{ color: "#FFF", fontWeight: "bold" }}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const {
    test,
    score,
    correctAnswersCount,
    totalQuestions,
    timeTaken,
    userAnswers,
  } = currentAttempt;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* TÓM TẮT ĐIỂM SỐ */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Điểm số của bạn</Text>
          <Text
            style={[
              styles.scoreText,
              { color: score >= 50 ? "#10B981" : "#EF4444" },
            ]}
          >
            {score}/100
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>
                {correctAnswersCount}/{totalQuestions}
              </Text>
              <Text style={styles.statLab}>Câu đúng</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>
                {Math.floor(timeTaken / 60)}p {timeTaken % 60}s
              </Text>
              <Text style={styles.statLab}>Thời gian</Text>
            </View>
          </View>
        </View>

        {/* DANH SÁCH CÂU HỎI & ĐÁP ÁN */}
        <Text style={styles.sectionTitle}>Chi tiết bài làm</Text>

        {test?.questionGroups?.map((group: any, gIndex: number) => (
          <View key={group._id || gIndex} style={styles.groupContainer}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            {group.passage && (
              <View style={styles.passageBox}>
                <Text style={styles.passageText}>{group.passage}</Text>
              </View>
            )}

            {group.group_questions.map((q: any, qIndex: number) => {
              // Tìm câu trả lời của user cho câu hỏi này
              const qId = q.id || q._id;
              const userAnsObj = userAnswers.find(
                (ua) => ua.questionId === qId,
              );
              const isCorrect = userAnsObj?.isCorrect;
              const selectedIdx = userAnsObj?.selectedAnswer;

              return (
                <View
                  key={qId}
                  style={[
                    styles.questionBox,
                    isCorrect ? styles.borderCorrect : styles.borderWrong,
                  ]}
                >
                  <View style={styles.questionHeader}>
                    <Text style={styles.questionText}>
                      <Text style={{ fontWeight: "bold" }}>
                        Câu {qIndex + 1}:{" "}
                      </Text>
                      {q.question}
                    </Text>
                    <Ionicons
                      name={isCorrect ? "checkmark-circle" : "close-circle"}
                      size={24}
                      color={isCorrect ? "#10B981" : "#EF4444"}
                    />
                  </View>

                  {q.options.map((option: string, optIndex: number) => {
                    const isUserSelected = selectedIdx === optIndex;
                    const isRightAnswer = q.correctAnswer === optIndex;

                    let optionStyle = styles.optionItem;
                    if (isUserSelected)
                      optionStyle = isCorrect
                        ? styles.optionCorrect
                        : styles.optionWrong;
                    if (isRightAnswer && !isCorrect)
                      optionStyle = styles.optionCorrect; // Hiện đáp án đúng nếu user chọn sai

                    return (
                      <View key={optIndex} style={optionStyle}>
                        <Text
                          style={[
                            styles.optionText,
                            (isUserSelected || isRightAnswer) &&
                              styles.whiteText,
                          ]}
                        >
                          {option}
                        </Text>
                        {isRightAnswer && (
                          <Ionicons name="checkmark" size={18} color="#FFF" />
                        )}
                        {isUserSelected && !isCorrect && (
                          <Ionicons name="close" size={18} color="#FFF" />
                        )}
                      </View>
                    );
                  })}

                  {/* GIẢI THÍCH (Nếu có) */}
                  {q.explanation && (
                    <View style={styles.explanationBox}>
                      <Text style={styles.explanationTitle}>
                        💡 Giải thích:
                      </Text>
                      <Text style={styles.explanationText}>
                        {q.explanation}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9FAFB" },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
  },
  container: { padding: 16 },
  summaryCard: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 24,
    elevation: 2,
  },
  summaryLabel: { fontSize: 14, color: "#6B7280", marginBottom: 8 },
  scoreText: { fontSize: 48, fontWeight: "900", marginBottom: 16 },
  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#F3F4F6",
    paddingTop: 16,
    width: "100%",
  },
  statItem: { flex: 1, alignItems: "center" },
  statVal: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  statLab: { fontSize: 12, color: "#6B7280" },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  groupContainer: { marginBottom: 24 },
  groupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginBottom: 8,
  },
  passageBox: {
    backgroundColor: "#EEF2FF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  passageText: { fontSize: 15, lineHeight: 22, color: "#374151" },
  questionBox: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
  },
  borderCorrect: { borderColor: "#10B981" },
  borderWrong: { borderColor: "#EF4444" },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  questionText: { fontSize: 16, color: "#111827", flex: 1, marginRight: 10 },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    marginBottom: 8,
  },
  optionCorrect: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#10B981",
    marginBottom: 8,
  },
  optionWrong: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#EF4444",
    marginBottom: 8,
  },
  optionText: { fontSize: 14, color: "#374151", flex: 1 },
  whiteText: { color: "#FFF", fontWeight: "bold" },
  explanationBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#FFFBEB",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  explanationTitle: { fontWeight: "bold", color: "#B45309", marginBottom: 4 },
  explanationText: { fontSize: 14, color: "#92400E", lineHeight: 20 },
  errorText: { marginTop: 10, color: "#EF4444", textAlign: "center" },
  backButton: {
    marginTop: 20,
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});
