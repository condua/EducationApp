import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// --------------------------------------------------------
// 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU (INTERFACES) DỰA THEO JSON
// --------------------------------------------------------

export interface Mentor {
  name: string;
  avatar: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  _id: string;
}

export interface QuestionGroup {
  id: string;
  type: string;
  title: string;
  instructions: string;
  passage?: string; // Có thể có hoặc không tùy vào dạng bài
  group_questions: Question[];
  _id: string;
}

export interface Test {
  _id: string;
  title: string;
  description: string;
  durationInMinutes: number;
  course: string;
  questionGroups: QuestionGroup[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Cấu trúc cho một khóa học ĐẦY ĐỦ chi tiết (getCourseById)
export interface CourseDetail {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  price: string | number;
  rating: number;
  students: number;
  mentor: Mentor;
  chapters: any[]; // Bạn có thể định nghĩa cụ thể hơn nếu có cấu trúc chapters
  tests: Test[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Cấu trúc cho một khóa học TÓM TẮT trong danh sách (getAllCourses)
export interface CourseSummary {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  price: string | number;
  rating: number;
  students: number;
  mentor: Mentor;
  chapters: string[]; // Mảng chứa ID của chapters
  tests: string[] | any[]; // Mảng chứa ID của tests
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Trạng thái (State) của Slice
interface CourseState {
  courses: CourseSummary[]; // Danh sách tất cả khóa học
  currentCourse: CourseDetail | null; // Chi tiết khóa học đang xem
  loadingAll: boolean; // Trạng thái load danh sách
  loadingDetail: boolean; // Trạng thái load chi tiết
  errorAll: string | null;
  errorDetail: string | null;

  enrollLoading: boolean;
  enrollSuccess: boolean;
  enrollError: string | null;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  loadingAll: false,
  loadingDetail: false,
  errorAll: null,
  errorDetail: null,

  enrollLoading: false,
  enrollSuccess: false,
  enrollError: null,
};

// Đổi URL này theo API thực tế của bạn
const API_URL = "https://educationappbackend-4inf.onrender.com/api/course";

// --------------------------------------------------------
// 2. TẠO CÁC ASYNC THUNKS (GỌI API)
// --------------------------------------------------------

// Thunk: Lấy tất cả khóa học
export const getAllCourses = createAsyncThunk(
  "course/getAllCourses",
  async (_, { rejectWithValue }) => {
    try {
      // Lưu ý: API lấy danh sách thường dùng số nhiều (courses). Bạn kiểm tra lại BE nhé!
      const response = await fetch(`${API_URL}`); // Hoặc bỏ chữ s tùy Backend
      if (!response.ok) {
        throw new Error("Lỗi khi tải danh sách khóa học");
      }
      const data = await response.json();
      return data as CourseSummary[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Đã xảy ra lỗi không xác định");
    }
  },
);

// Thunk: Lấy chi tiết một khóa học theo ID
export const getCourseById = createAsyncThunk(
  "course/getCourseById",
  async (courseId: string, { getState, rejectWithValue }) => {
    try {
      // 1. Lấy state tổng của ứng dụng để trích xuất token
      const state = getState() as any;
      const token = state.auth.token;

      console.log(`Đang gọi API tới: ${API_URL}/${courseId}`);
      console.log("Token hiện tại:", token);

      // 2. Đính kèm token vào headers
      const response = await fetch(`${API_URL}/${courseId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}), // Thêm token nếu có
        },
      });

      if (!response.ok) {
        console.log("Lỗi response status:", response.status);
        if (response.status === 401) {
          throw new Error(
            "Phiên đăng nhập đã hết hạn hoặc bạn không có quyền xem khóa học này.",
          );
        }
        if (response.status === 403) {
          throw new Error(
            "Tài khoản của bạn không có quyền truy cập vào nội dung này.",
          );
        }
        throw new Error(`Không tìm thấy khóa học với ID: ${courseId}`);
      }

      const data = await response.json();
      console.log("Dữ liệu lấy được:", data);

      return data as CourseDetail;
    } catch (error: any) {
      console.log("Lỗi Fetch:", error.message);
      return rejectWithValue(error.message || "Đã xảy ra lỗi không xác định");
    }
  },
);

// URL API Enroll
const ENROLL_API_URL =
  "https://educationappbackend-4inf.onrender.com/api/users/enroll";

// Thunk: Đăng ký khóa học
export const enrollCourse = createAsyncThunk(
  "course/enrollCourse",
  async (courseId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      if (!token) {
        throw new Error("Bạn cần đăng nhập để đăng ký khóa học!");
      }

      const response = await fetch(ENROLL_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng ký khóa học thất bại.");
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi kết nối máy chủ");
    }
  },
);

// --------------------------------------------------------
// 3. TẠO REDUX SLICE
// --------------------------------------------------------

export const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    // Xóa dữ liệu khóa học hiện tại
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
      state.errorDetail = null;
    },
    // Reset trạng thái nút bấm sau khi đăng ký xong
    resetEnrollState: (state) => {
      state.enrollLoading = false;
      state.enrollSuccess = false;
      state.enrollError = null;
    },
  },
  extraReducers: (builder) => {
    // --- Xử lý trạng thái getAllCourses ---
    builder.addCase(getAllCourses.pending, (state) => {
      state.loadingAll = true;
      state.errorAll = null;
    });
    builder.addCase(
      getAllCourses.fulfilled,
      (state, action: PayloadAction<CourseSummary[]>) => {
        state.loadingAll = false;
        state.courses = action.payload;
      },
    );
    builder.addCase(getAllCourses.rejected, (state, action) => {
      state.loadingAll = false;
      state.errorAll = action.payload as string;
    });

    // --- Xử lý trạng thái getCourseById ---
    builder.addCase(getCourseById.pending, (state) => {
      state.loadingDetail = true;
      state.errorDetail = null;
    });
    builder.addCase(
      getCourseById.fulfilled,
      (state, action: PayloadAction<CourseDetail>) => {
        state.loadingDetail = false;
        state.currentCourse = action.payload;
      },
    );
    builder.addCase(getCourseById.rejected, (state, action) => {
      state.loadingDetail = false;
      state.errorDetail = action.payload as string;
    });

    // --- Xử lý trạng thái ENROLL ---
    builder.addCase(enrollCourse.pending, (state) => {
      state.enrollLoading = true;
      state.enrollError = null;
      state.enrollSuccess = false;
    });
    builder.addCase(enrollCourse.fulfilled, (state) => {
      state.enrollLoading = false;
      state.enrollSuccess = true;
    });
    builder.addCase(enrollCourse.rejected, (state, action) => {
      state.enrollLoading = false;
      state.enrollError = action.payload as string;
    });
  },
});

// ✅ SỬA Ở ĐÂY: Export thêm resetEnrollState
export const { clearCurrentCourse, resetEnrollState } = courseSlice.actions;

// Export reducer để gắn vào store
export default courseSlice.reducer;
