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
  isInitialized: boolean; // SỬA LẠI: Kiểu dữ liệu là boolean, không phải false
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

// Thunk: Dùng để khôi phục đăng nhập khi mở app
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
      // SỬA LẠI: Dùng rejectWithValue thay vì throw Error để tránh crash app
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

      // THÊM MỚI: Lưu token và thông tin user vào bộ nhớ máy tính
      await AsyncStorage.setItem("userToken", data.token);
      await AsyncStorage.setItem("userData", JSON.stringify(data.user));

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

      // THÊM MỚI: Nếu backend tự động login sau khi đăng ký, lưu bộ nhớ luôn
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

// Slice của Redux
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      // Khi logout thì xóa sạch token trong máy
      AsyncStorage.removeItem("userToken");
      AsyncStorage.removeItem("userData");
    },
  },
  extraReducers: (builder) => {
    builder
      // ---------------- TRẠNG THÁI KHÔI PHỤC ĐĂNG NHẬP (QUAN TRỌNG) ----------------
      .addCase(restoreLogin.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isInitialized = true; // Báo hiệu app đã check token xong
      })
      .addCase(restoreLogin.rejected, (state) => {
        state.isAuthenticated = false;
        state.isInitialized = true; // Báo hiệu app đã check token xong (nhưng thất bại)
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
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
