import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateProfile } from "../slices/profileSlice";

// Interface cho trạng thái auth
interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

// Trạng thái ban đầu
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
  isInitialized: false,
};

// URL API
const API_URL = "https://educationappbackend-4inf.onrender.com/api/auth";

// Thunk: Khôi phục đăng nhập
export const restoreLogin = createAsyncThunk(
  "auth/restoreLogin",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userDataStr = await AsyncStorage.getItem("userData");

      if (token && userDataStr) {
        const user = JSON.parse(userDataStr);
        dispatch(updateProfile(user));
        return { token, user };
      }
      return rejectWithValue("No token found");
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// Thunk: Đăng nhập
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { email: string; password: string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      await AsyncStorage.setItem("userToken", data.token);
      await AsyncStorage.setItem("userData", JSON.stringify(data.user));

      dispatch(updateProfile(data.user));

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// 🟢 THÊM MỚI: Thunk Đăng nhập bằng Google
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (idToken: string, { dispatch, rejectWithValue }) => {
    try {
      // Đổi đuôi endpoint thành api backend của bạn xử lý google login
      const response = await fetch(`${API_URL}/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }), // Gửi idToken với tên trường 'token'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Đăng nhập Google thất bại",
        );
      }

      // Backend Google Login trả về 'accessToken' thay vì 'token', nên cần lấy đúng trường
      const tokenToSave = data.accessToken || data.token;

      if (tokenToSave) {
        await AsyncStorage.setItem("userToken", tokenToSave);
        await AsyncStorage.setItem("userData", JSON.stringify(data.user));
      }

      dispatch(updateProfile(data.user));

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);
// Thunk: Đăng ký
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    userData: { fullName: string; email: string; password: string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      if (data.token) {
        await AsyncStorage.setItem("userToken", data.token);
        await AsyncStorage.setItem("userData", JSON.stringify(data.user));
      }

      dispatch(updateProfile(data.user));

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// 🟢 THÊM MỚI: Thunk Gửi Email Quên Mật Khẩu (Lấy OTP)
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gửi email thất bại");
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// 🟢 THÊM MỚI: Thunk Đổi Mật Khẩu với OTP
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    resetData: { email: string; code: string; newPassword: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resetData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đổi mật khẩu thất bại");
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// Slice của Redux
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      AsyncStorage.removeItem("userToken");
      AsyncStorage.removeItem("userData");
    },
    // (Tuỳ chọn) Helper để reset error khi chuyển trang
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---------------- TRẠNG THÁI KHÔI PHỤC ĐĂNG NHẬP ----------------
      .addCase(restoreLogin.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isInitialized = true;
      })
      .addCase(restoreLogin.rejected, (state) => {
        state.isAuthenticated = false;
        state.isInitialized = true;
      })

      // ---------------- TRẠNG THÁI ĐĂNG NHẬP ----------------
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ---------------- 🟢 TRẠNG THÁI ĐĂNG NHẬP BẰNG GOOGLE ----------------
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        // Sử dụng accessToken hoặc token tùy theo backend trả về
        state.token = action.payload.accessToken || action.payload.token;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // ---------------- TRẠNG THÁI ĐĂNG KÝ ----------------
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ---------------- 🟢 TRẠNG THÁI QUÊN MẬT KHẨU ----------------
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        // Không thay đổi user/token, chỉ báo thành công (Component UI sẽ dùng .unwrap() để chuyển màn hình)
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ---------------- 🟢 TRẠNG THÁI ĐẶT LẠI MẬT KHẨU ----------------
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        // Tương tự, UI Component dùng .unwrap() để chuyển hướng về Login
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
