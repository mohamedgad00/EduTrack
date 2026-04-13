import api from "@/utils/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type UserRole = "student" | "teacher" | "parent";

export interface CreateUserPayload {
  role: UserRole;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  username: string;
  password: string;
  sendWelcomeEmail: boolean;
  grade?: string;
  classSection?: string;
  parentGuardian?: string;
  enrollmentDate?: string;
  specialty?: string;
  experience?: string;
  coursesAssigned?: string[];
  hireDate?: string;
  linkedStudents?: string[];
  emergencyContact?: string;
  address?: string;
}

interface UsersState {
  isCreating: boolean;
  createError: string | null;
}

const initialState: UsersState = {
  isCreating: false,
  createError: null,
};

export const createUser = createAsyncThunk(
  "users/createUser",
  async (payload: CreateUserPayload, { rejectWithValue }) => {
    try {
      const response = await api.post("users", payload);
      return response.data;
    } catch (error: unknown) {
      const fallbackMessage = "Failed to create user. Please try again.";
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: unknown } } })
          .response?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : fallbackMessage;

      return rejectWithValue(message ?? fallbackMessage);
    }
  },
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearCreateUserState: (state) => {
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.isCreating = false;
        state.createError = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isCreating = false;
        state.createError =
          (action.payload as string) ??
          "Failed to create user. Please try again.";
      });
  },
});

export const { clearCreateUserState } = usersSlice.actions;
export default usersSlice.reducer;
