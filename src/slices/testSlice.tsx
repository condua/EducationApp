import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// --------------------------------------------------------
// 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU (INTERFACES)
// --------------------------------------------------------

export interface UserAnswer {
  questionId: string;
  selectedAnswer: number | null;
  isCorrect?: boolean;
}

export interface TestAttempt {
  _id: string;
  user: any; // Có thể là ID string hoặc Object User khi được populate
  test: any; // Có thể là ID string hoặc Object Test khi được populate
  course: any;
  userAnswers: UserAnswer[];
  score: number;
  totalQuestions: number;
  correctAnswersCount: number;
  startedAt: string;
  completedAt: string;
  timeTaken: number;
}

// Interface dành riêng cho hàm getAttemptsForTestInCourse
export interface FormattedAttempt {
  _id: string;
  fullName: string;
  avatar: string | null;
  email: string;
  score: number;
  userAnswers: UserAnswer[];
  startedAt: string;
}

// Interface payload gửi lên khi nộp bài
export interface SubmitTestPayload {
  testId: string;
  userAnswers: { questionId: string; selectedAnswer: number }[];
  startedAt: string;
}

// Trạng thái (State) của TestSlice
interface TestState {
  history: TestAttempt[]; // Lịch sử tất cả các bài đã làm (getUserTestHistory)
  currentAttempt: TestAttempt | null; // Chi tiết 1 lượt làm bài (getSpecificAttempt)
  myAttemptsForCurrentTest: TestAttempt[]; // Các lần làm của 1 bài test cụ thể (getMyAttemptsForTest)
  courseTestAttempts: FormattedAttempt[]; // Lịch sử làm bài của mọi người trong 1 khóa học (getAttemptsForTestInCourse)

  // Trạng thái Loading & Error chung
  loading: boolean;
  error: string | null;

  // Trạng thái riêng cho Nộp bài
  submitLoading: boolean;
  submitSuccess: boolean;
  submitError: string | null;
}

const initialState: TestState = {
  history: [],
  currentAttempt: null,
  myAttemptsForCurrentTest: [],
  courseTestAttempts: [],

  loading: false,
  error: null,

  submitLoading: false,
  submitSuccess: false,
  submitError: null,
};

// LƯU Ý: Thay đổi BASE_URL này cho khớp với file router (routes) trong Backend của bạn
const API_URL = "https://educationappbackend-4inf.onrender.com/api/attempts";

// --------------------------------------------------------
// 2. TẠO CÁC ASYNC THUNKS (GỌI API)
// --------------------------------------------------------

// Thunk: Nộp bài kiểm tra (submitTest)
export const submitTest = createAsyncThunk(
  "test/submitTest",
  async (payload: SubmitTestPayload, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      // Giả sử route BE là: POST /api/test-attempts/:testId
      const response = await fetch(`${API_URL}/submit/${payload.testId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userAnswers: payload.userAnswers,
          startedAt: payload.startedAt,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Nộp bài thất bại");
      return data as TestAttempt;
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi kết nối máy chủ");
    }
  },
);

// Thunk: Lấy lịch sử làm bài của User (getUserTestHistory)
export const fetchUserTestHistory = createAsyncThunk(
  "test/fetchUserTestHistory",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      // Giả sử route BE là: GET /api/test-attempts/history
      const response = await fetch(`${API_URL}/my-history`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Không thể tải lịch sử làm bài");
      return data as TestAttempt[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi kết nối máy chủ");
    }
  },
);

// Thunk: Lấy chi tiết một lượt làm bài cụ thể (getSpecificAttempt)
export const fetchSpecificAttempt = createAsyncThunk(
  "test/fetchSpecificAttempt",
  async (attemptId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      // Giả sử route BE là: GET /api/test-attempts/attempt/:attemptId
      const response = await fetch(`${API_URL}/${attemptId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Không thể tải chi tiết bài làm");
      return data as TestAttempt;
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi kết nối máy chủ");
    }
  },
);

// Thunk: Lấy các lượt làm bài CỦA MÌNH cho 1 bài test cụ thể (getMyAttemptsForTest)
export const fetchMyAttemptsForTest = createAsyncThunk(
  "test/fetchMyAttemptsForTest",
  async (testId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      // Giả sử route BE là: GET /api/test-attempts/:testId/my-attempts
      const response = await fetch(
        `${API_URL}/my-attempts-for-test/${testId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Không thể tải lịch sử bài test");
      return data as TestAttempt[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi kết nối máy chủ");
    }
  },
);

// --------------------------------------------------------
// 3. TẠO REDUX SLICE
// --------------------------------------------------------

export const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    // Reset trạng thái nộp bài
    resetSubmitState: (state) => {
      state.submitLoading = false;
      state.submitSuccess = false;
      state.submitError = null;
    },
    // Xóa chi tiết bài test hiện tại khi rời khỏi màn hình
    clearCurrentAttempt: (state) => {
      state.currentAttempt = null;
    },
  },
  extraReducers: (builder) => {
    // --- NỘP BÀI (submitTest) ---
    builder.addCase(submitTest.pending, (state) => {
      state.submitLoading = true;
      state.submitSuccess = false;
      state.submitError = null;
    });
    builder.addCase(submitTest.fulfilled, (state, action) => {
      state.submitLoading = false;
      state.submitSuccess = true;
      // Cập nhật lượt làm bài mới nhất vào currentAttempt
      state.currentAttempt = action.payload;
    });
    builder.addCase(submitTest.rejected, (state, action) => {
      state.submitLoading = false;
      state.submitError = action.payload as string;
    });

    // --- LẤY LỊCH SỬ CHUNG (fetchUserTestHistory) ---
    builder.addCase(fetchUserTestHistory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserTestHistory.fulfilled, (state, action) => {
      state.loading = false;
      state.history = action.payload;
    });
    builder.addCase(fetchUserTestHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // --- LẤY CHI TIẾT 1 LƯỢT LÀM (fetchSpecificAttempt) ---
    builder.addCase(fetchSpecificAttempt.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSpecificAttempt.fulfilled, (state, action) => {
      state.loading = false;
      state.currentAttempt = action.payload;
    });
    builder.addCase(fetchSpecificAttempt.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // --- LẤY CÁC LƯỢT LÀM CỦA 1 TEST (fetchMyAttemptsForTest) ---
    builder.addCase(fetchMyAttemptsForTest.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMyAttemptsForTest.fulfilled, (state, action) => {
      state.loading = false;
      state.myAttemptsForCurrentTest = action.payload;
    });
    builder.addCase(fetchMyAttemptsForTest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetSubmitState, clearCurrentAttempt } = testSlice.actions;

export default testSlice.reducer;
