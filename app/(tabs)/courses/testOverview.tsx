import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store"; // Sửa đường dẫn tuỳ project
import { fetchMyAttemptsForTest } from "@/src/slices/testSlice"; // Đảm bảo đường dẫn đúng

const PRIMARY_COLOR = "#4F46E5";

export default function TestOverviewScreen() {
  const router = useRouter();
  const dispatch = useDispatch<any>();

  // Nhận testId từ URL (được truyền từ trang Chi tiết Khóa học)
  const { testId } = useLocalSearchParams();

  // 1. Lấy chi tiết Khóa học từ Redux để trích xuất thông tin bài Test
  const { currentCourse } = useSelector((state: RootState) => state.course);

  // 2. Lấy dữ liệu Lịch sử làm bài từ TestSlice
  const { myAttemptsForCurrentTest, loading } = useSelector(
    (state: RootState) => state.test,
  );

  // Tìm bài test hiện tại trong mảng tests của khóa học
  const testInfo = currentCourse?.tests?.find((t: any) => t._id === testId);

  // 3. Gọi API lấy lịch sử làm bài khi vào trang
  useEffect(() => {
    if (testId) {
      dispatch(fetchMyAttemptsForTest(testId as string));
    }
  }, [testId, dispatch]);

  if (!testInfo) {
    return (
      <View style={styles.centerContainer}>
        <Text style={{ color: "red" }}>
          Không tìm thấy thông tin bài kiểm tra!
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 20 }}
        >
          <Text style={{ color: PRIMARY_COLOR }}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Tính tổng số câu hỏi
  const totalQuestions = testInfo.questionGroups?.reduce(
    (sum: number, group: any) => sum + (group.group_questions?.length || 0),
    0,
  );

  // Hàm format thời gian (từ chuỗi ISO sang định dạng dễ đọc)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")} - ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Hàm chuyển đổi giây thành Phút:Giây
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}p ${s}s`;
  };

  return (
    <View style={styles.container}>
      {/* HEADER TỰ TẠO */}

      {/* THÔNG TIN BÀI TEST */}
      <View style={styles.infoCard}>
        <View style={styles.iconWrapper}>
          <FontAwesome5 name="file-alt" size={28} color={PRIMARY_COLOR} />
        </View>
        <Text style={styles.testTitle}>{testInfo.title}</Text>
        {testInfo.description ? (
          <Text style={styles.testDesc}>{testInfo.description}</Text>
        ) : null}

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={20} color="#6B7280" />
            <Text style={styles.statText}>
              {testInfo.durationInMinutes} Phút
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="help-circle-outline" size={20} color="#6B7280" />
            <Text style={styles.statText}>{totalQuestions} Câu hỏi</Text>
          </View>
        </View>
      </View>

      {/* NÚT BẮT ĐẦU LÀM BÀI */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => {
          // Điều hướng sang trang làm bài thi và truyền toàn bộ dữ liệu test
          router.push({
            pathname: "/(tabs)/courses/takingTest", // Đảm bảo đúng file takingTest của bạn
            params: { testData: JSON.stringify(testInfo) },
          });
        }}
      >
        <Ionicons
          name="play"
          size={20}
          color="#FFF"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.startButtonText}>Bắt đầu làm bài</Text>
      </TouchableOpacity>

      {/* LỊCH SỬ LÀM BÀI */}
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Lịch sử làm bài của bạn</Text>

        {loading ? (
          <ActivityIndicator
            size="small"
            color={PRIMARY_COLOR}
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={myAttemptsForCurrentTest}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item, index }) => (
              <View style={styles.attemptCard}>
                <View style={styles.attemptHeader}>
                  <Text style={styles.attemptIndex}>
                    Lần {myAttemptsForCurrentTest.length - index}
                  </Text>
                  <Text style={styles.attemptDate}>
                    {formatDate(item.completedAt)}
                  </Text>
                </View>

                <View style={styles.attemptBody}>
                  <View style={styles.scoreBox}>
                    <Text style={styles.scoreLabel}>Điểm số</Text>
                    <Text
                      style={[
                        styles.scoreValue,
                        { color: item.score >= 50 ? "#10B981" : "#EF4444" },
                      ]}
                    >
                      {item.score}/100
                    </Text>
                  </View>

                  <View style={styles.detailBox}>
                    <Text style={styles.detailText}>
                      ✅ Số câu đúng:{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {item.correctAnswersCount}/{item.totalQuestions}
                      </Text>
                    </Text>
                    <Text style={styles.detailText}>
                      ⏱️ Thời gian:{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {formatDuration(item.timeTaken)}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Ionicons name="time-outline" size={40} color="#D1D5DB" />
                <Text style={styles.emptyText}>
                  Bạn chưa làm bài kiểm tra này lần nào.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },

  infoCard: {
    backgroundColor: "#FFF",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  testTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  testDesc: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
  },
  statsRow: { flexDirection: "row", gap: 20 },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
  },

  startButton: {
    flexDirection: "row",
    backgroundColor: PRIMARY_COLOR,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: PRIMARY_COLOR,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  startButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },

  historyContainer: {
    flex: 1,
    marginTop: 24,
    paddingHorizontal: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },

  attemptCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  attemptHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#F3F4F6",
    paddingBottom: 8,
    marginBottom: 8,
  },
  attemptIndex: { fontSize: 14, fontWeight: "bold", color: PRIMARY_COLOR },
  attemptDate: { fontSize: 13, color: "#6B7280" },

  attemptBody: { flexDirection: "row", alignItems: "center" },
  scoreBox: {
    alignItems: "center",
    paddingRight: 16,
    borderRightWidth: 1,
    borderColor: "#E5E7EB",
  },
  scoreLabel: { fontSize: 12, color: "#6B7280", marginBottom: 4 },
  scoreValue: { fontSize: 24, fontWeight: "900" },

  detailBox: { paddingLeft: 16, flex: 1, gap: 4 },
  detailText: { fontSize: 14, color: "#374151" },

  emptyBox: { alignItems: "center", marginTop: 30 },
  emptyText: { color: "#9CA3AF", marginTop: 8, fontSize: 14 },
});
