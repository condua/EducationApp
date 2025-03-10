import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Mentor {
  _id: string;
  name: string;
  email: string;
}

interface Chapter {
  _id: string;
  title: string;
  lessons: number;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  mentor: Mentor;
  chapters: Chapter[];
}

interface CoursesState {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

const initialState: CoursesState = {
  courses: [],
  loading: false,
  error: null,
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    fetchCoursesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCoursesSuccess(state, action: PayloadAction<Course[]>) {
      state.courses = action.payload;
      state.loading = false;
    },
    fetchCoursesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchCoursesStart, fetchCoursesSuccess, fetchCoursesFailure } =
  coursesSlice.actions;
export default coursesSlice.reducer;
