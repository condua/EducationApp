import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import coursesReducer from "../slices/coursesSlice";
import profileReducer from "../slices/profileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    courses: coursesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
