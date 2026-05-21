import userApi from "@/utils/userApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  UserResponseDto,
  CreateUserDto,
  UpdateUserDto,
  UserRole,
  PaginatedUsersResponse,
} from "@/types/user";

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  dailyActiveUsers: number;
}

interface UsersState {
  // User list state
  users: UserResponseDto[];
  totalUsers: number;
  currentPage: number;
  pageSize: number;

  // Loading and error states for list operations
  isLoadingUsers: boolean;
  usersError: string | null;

  // Create user state
  isCreating: boolean;
  createError: string | null;

  // Update user state
  isUpdating: boolean;
  updateError: string | null;
  updatingUserId: string | null;

  // Delete user state
  isDeleting: boolean;
  deleteError: string | null;
  deletingUserId: string | null;

  // Get single user state
  selectedUser: UserResponseDto | null;
  isLoadingUser: boolean;
  getUserError: string | null;

  // Dashboard stats
  isLoadingStats: boolean;
  statsLoaded: boolean;
  statsError: string | null;
  dashboardStats: DashboardStats;
}

const initialState: UsersState = {
  users: [],
  totalUsers: 0,
  currentPage: 1,
  pageSize: 10,

  isLoadingUsers: false,
  usersError: null,

  isCreating: false,
  createError: null,

  isUpdating: false,
  updateError: null,
  updatingUserId: null,

  isDeleting: false,
  deleteError: null,
  deletingUserId: null,

  selectedUser: null,
  isLoadingUser: false,
  getUserError: null,

  isLoadingStats: false,
  statsLoaded: false,
  statsError: null,
  dashboardStats: {
    totalStudents: 0,
    totalTeachers: 0,
    totalParents: 0,
    dailyActiveUsers: 0,
  },
};

// Async thunks for CRUD operations

/**
 * Fetch users with optional filtering and pagination
 */
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (
    params: {
      role?: UserRole;
      search?: string;
      page?: number;
      limit?: number;
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const response = await userApi.getUsers(
        params.role,
        params.search,
        params.page || 1,
        params.limit || 10,
      );
      return {
        users: response.data,
        total: response.meta?.total || 0,
        page: response.meta?.page || 1,
        limit: response.meta?.limit || 10,
      };
    } catch (error: unknown) {
      const fallbackMessage = "Failed to fetch users. Please try again.";
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

/**
 * Get a single user by ID
 */
export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await userApi.getUserById(id);
      return response.data;
    } catch (error: unknown) {
      const fallbackMessage = "Failed to fetch user. Please try again.";
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

/**
 * Create a new user
 */
export const createUser = createAsyncThunk(
  "users/createUser",
  async (payload: CreateUserDto, { rejectWithValue }) => {
    try {
      const response = await userApi.createUser(payload);
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

/**
 * Update an existing user
 */
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (payload: { id: string; data: UpdateUserDto }, { rejectWithValue }) => {
    try {
      const response = await userApi.updateUser(payload.id, payload.data);
      return {
        id: payload.id,
        user: response.data,
      };
    } catch (error: unknown) {
      const fallbackMessage = "Failed to update user. Please try again.";
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

/**
 * Delete a user
 */
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: string, { rejectWithValue }) => {
    try {
      await userApi.deleteUser(id);
      return id;
    } catch (error: unknown) {
      const fallbackMessage = "Failed to delete user. Please try again.";
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

/**
 * Fetch dashboard statistics
 */
export const fetchDashboardStats = createAsyncThunk(
  "users/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const [studentsResponse, teachersResponse, parentsResponse] =
        await Promise.all([
          userApi.getStudents("", 1, 1000),
          userApi.getTeachers("", 1, 1000),
          userApi.getParents("", 1, 1000),
        ]);

      return {
        totalStudents:
          studentsResponse.meta?.total || studentsResponse.data?.length || 0,
        totalTeachers:
          teachersResponse.meta?.total || teachersResponse.data?.length || 0,
        totalParents:
          parentsResponse.meta?.total || parentsResponse.data?.length || 0,
        dailyActiveUsers:
          (studentsResponse.meta?.total || studentsResponse.data?.length || 0) +
          (teachersResponse.meta?.total || teachersResponse.data?.length || 0) +
          (parentsResponse.meta?.total || parentsResponse.data?.length || 0),
      } satisfies DashboardStats;
    } catch (error: unknown) {
      const fallbackMessage =
        "Failed to load dashboard stats. Please try again.";
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
    clearCreateUserError: (state) => {
      state.createError = null;
    },
    clearUpdateUserError: (state) => {
      state.updateError = null;
      state.updatingUserId = null;
    },
    clearDeleteUserError: (state) => {
      state.deleteError = null;
      state.deletingUserId = null;
    },
    clearGetUserError: (state) => {
      state.getUserError = null;
    },
    clearUsersError: (state) => {
      state.usersError = null;
    },
    resetSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoadingUsers = true;
        state.usersError = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoadingUsers = false;
        state.usersError = null;
        state.users = action.payload.users;
        state.totalUsers = action.payload.total;
        state.currentPage = action.payload.page;
        state.pageSize = action.payload.limit;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoadingUsers = false;
        state.usersError =
          (action.payload as string) ??
          "Failed to fetch users. Please try again.";
      });

    // Fetch user by ID
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.isLoadingUser = true;
        state.getUserError = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoadingUser = false;
        state.getUserError = null;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoadingUser = false;
        state.getUserError =
          (action.payload as string) ??
          "Failed to fetch user. Please try again.";
      });

    // Create user
    builder
      .addCase(createUser.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isCreating = false;
        state.createError = null;
        // Add new user to the list
        state.users.unshift(action.payload);
        state.totalUsers += 1;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isCreating = false;
        state.createError =
          (action.payload as string) ??
          "Failed to create user. Please try again.";
      });

    // Update user
    builder
      .addCase(updateUser.pending, (state, action) => {
        state.isUpdating = true;
        state.updateError = null;
        state.updatingUserId = action.meta.arg.id;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.updateError = null;
        state.updatingUserId = null;

        // Update user in the list
        const userIndex = state.users.findIndex(
          (user) => user.id === action.payload.id,
        );
        if (userIndex !== -1) {
          state.users[userIndex] = action.payload.user;
        }

        // Update selected user if it's the same user
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload.user;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError =
          (action.payload as string) ??
          "Failed to update user. Please try again.";
        state.updatingUserId = null;
      });

    // Delete user
    builder
      .addCase(deleteUser.pending, (state, action) => {
        state.isDeleting = true;
        state.deleteError = null;
        state.deletingUserId = action.meta.arg;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.deleteError = null;
        state.deletingUserId = null;

        // Remove user from list
        state.users = state.users.filter((user) => user.id !== action.payload);
        state.totalUsers = Math.max(0, state.totalUsers - 1);

        // Reset selected user if deleted
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isDeleting = false;
        state.deleteError =
          (action.payload as string) ??
          "Failed to delete user. Please try again.";
        state.deletingUserId = null;
      });

    // Fetch dashboard stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoadingStats = true;
        state.statsError = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoadingStats = false;
        state.statsLoaded = true;
        state.statsError = null;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoadingStats = false;
        state.statsLoaded = true;
        state.statsError =
          (action.payload as string) ??
          "Failed to load dashboard stats. Please try again.";
      });
  },
});

export const {
  clearCreateUserError,
  clearUpdateUserError,
  clearDeleteUserError,
  clearGetUserError,
  clearUsersError,
  resetSelectedUser,
} = usersSlice.actions;
export default usersSlice.reducer;
