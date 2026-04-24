import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Course } from "@/types/course";

interface CoursesState {
  courses: Course[];
  selectedCourse: Course | null;
  loading: boolean;
  error: string | null;
}

const initialState: CoursesState = {
  courses: [],
  selectedCourse: null,
  loading: false,
  error: null,
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    // Set courses
    setCoursesLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setCoursesSuccess: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
      state.loading = false;
    },
    setCoursesError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create course
    createCourseStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createCourseSuccess: (state, action: PayloadAction<Course>) => {
      state.courses.push(action.payload);
      state.loading = false;
    },
    createCourseError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update course
    updateCourseStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateCourseSuccess: (state, action: PayloadAction<Course>) => {
      const index = state.courses.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
      state.loading = false;
    },
    updateCourseError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete course
    deleteCourseStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteCourseSuccess: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter((c) => c.id !== action.payload);
      state.loading = false;
    },
    deleteCourseError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Select course
    selectCourse: (state, action: PayloadAction<Course | null>) => {
      state.selectedCourse = action.payload;
    },

    // Clear state
    clearCourseState: (state) => {
      state.selectedCourse = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setCoursesLoading,
  setCoursesSuccess,
  setCoursesError,
  createCourseStart,
  createCourseSuccess,
  createCourseError,
  updateCourseStart,
  updateCourseSuccess,
  updateCourseError,
  deleteCourseStart,
  deleteCourseSuccess,
  deleteCourseError,
  selectCourse,
  clearCourseState,
} = coursesSlice.actions;

export default coursesSlice.reducer;
