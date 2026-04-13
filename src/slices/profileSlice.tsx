import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// 1. Định nghĩa Interface cho dữ liệu Profile
export interface ProfileState {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  avatar: string;
  role: string;
  enrolledCourses: string[]; // Mảng chứa ID các khóa học đã đăng ký
  loading: boolean;
  error: string | null;
}

// 2. Khởi tạo State mặc định
const initialState: ProfileState = {
  _id: "",
  fullName: "",
  phone: "",
  email: "",
  avatar:
    "https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611765.jpg",
  role: "user",
  enrolledCourses: [],
  loading: false,
  error: null,
};

const API_URL_ME = "https://educationappbackend-4inf.onrender.com/api/users/me";

// 3. Thunk: Lấy thông tin cá nhân của người dùng hiện tại
export const fetchCurrentUser = createAsyncThunk(
  "profile/fetchCurrentUser", // Đổi tên prefix thành 'profile' cho chuẩn với tên slice
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token; // Đảm bảo lấy đúng đường dẫn token từ authSlice

      if (!token) {
        throw new Error("Không có token xác thực.");
      }

      const response = await fetch(API_URL_ME, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Gửi token lên để xác thực
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Lấy thông tin người dùng thất bại.");
      }

      return data; // Dữ liệu này sẽ được chuyển xuống 'fulfilled' trong extraReducers
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi kết nối máy chủ");
    }
  },
);

// 4. Tạo Slice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // Cập nhật thông tin thủ công (ví dụ: khi người dùng vừa chỉnh sửa form Profile)
    updateProfile: (state, action: PayloadAction<Partial<ProfileState>>) => {
      return { ...state, ...action.payload };
    },
    // Reset Profile khi Đăng xuất (Gọi hàm này cùng lúc với hàm logout của authSlice)
    clearProfile: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Trạng thái đang gọi API
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Trạng thái gọi API thành công -> Cập nhật State
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        // Trải dữ liệu trả về từ API đè lên state hiện tại
        Object.assign(state, action.payload);

        // Hoặc bạn có thể gán từng trường một cách thủ công nếu muốn an toàn hơn:
        // state._id = action.payload._id;
        // state.fullName = action.payload.fullName;
        // state.email = action.payload.email;
        // state.avatar = action.payload.avatar || state.avatar;
        // state.enrolledCourses = action.payload.enrolledCourses || [];
      })
      // Trạng thái gọi API thất bại
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
