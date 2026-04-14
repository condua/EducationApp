import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// 1. Định nghĩa Interface cho dữ liệu Profile
export interface ProfileState {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  avatar: string;
  role: string;
  enrolledCourses: string[];
  loading: boolean;
  updateLoading: boolean; // Mới: Trạng thái loading riêng khi đang cập nhật profile
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
  updateLoading: false,
  error: null,
};

const API_BASE_URL = "https://educationappbackend-4inf.onrender.com/api/users";

// --- THUNK 1: Lấy thông tin user ---
export const fetchCurrentUser = createAsyncThunk(
  "profile/fetchCurrentUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      if (!token) throw new Error("Không có token xác thực.");

      const response = await fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Lấy thông tin thất bại.");

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi kết nối máy chủ");
    }
  },
);

// --- THUNK 2 (MỚI): Cập nhật thông tin user lên Database ---
// Truyền vào các trường cần update: fullName, phone, avatar...
export const updateUserProfileOnServer = createAsyncThunk(
  "profile/updateUserProfileOnServer",
  async (updateData: Partial<ProfileState>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;
      const userId = state.profile._id; // Lấy ID của user hiện tại

      if (!token || !userId) {
        throw new Error("Không đủ thông tin xác thực để cập nhật.");
      }

      // Gọi API PUT /api/users/:id mà bạn đã định nghĩa ở backend
      const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Cập nhật thông tin thất bại.");
      }

      return data; // Backend thường sẽ trả về object User đã được update
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
    // Giữ lại cái này phòng khi cần update UI ngay lập tức không qua API
    updateProfile: (state, action: PayloadAction<Partial<ProfileState>>) => {
      return { ...state, ...action.payload };
    },
    clearProfile: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Xử lý Fetch User ---
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Xử lý Update User ---
      .addCase(updateUserProfileOnServer.pending, (state) => {
        state.updateLoading = true; // Đang lưu lên DB
        state.error = null;
      })
      .addCase(updateUserProfileOnServer.fulfilled, (state, action) => {
        state.updateLoading = false;
        // Ghi đè thông tin mới được Backend trả về vào State hiện tại
        Object.assign(state, action.payload);
      })
      .addCase(updateUserProfileOnServer.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
