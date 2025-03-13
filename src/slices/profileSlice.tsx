import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fullName: "",
  phone: "",
  email: "",
  avatar:
    "https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611765.jpg",
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      return { ...state, ...action.payload }; // Giữ lại các giá trị cũ
    },
  },
});

export const { updateProfile } = profileSlice.actions;
export default profileSlice.reducer;
