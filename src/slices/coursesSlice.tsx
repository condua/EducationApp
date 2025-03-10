import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sampleCourses, Course } from "./courses";

interface CoursesState {
  courses: Course[];
}

const initialState: CoursesState = {
  courses: sampleCourses,
};
const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    addCourse: (state, action: PayloadAction<Course>) => {
      state.courses.push(action.payload);
    },
    removeCourse: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter(
        (course) => course._id !== action.payload
      );
    },
    updateCourse: (state, action: PayloadAction<Course>) => {
      const index = state.courses.findIndex(
        (course) => course._id === action.payload._id
      );
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
    },
  },
});

export const { addCourse, removeCourse, updateCourse } = coursesSlice.actions;
export default coursesSlice.reducer;
