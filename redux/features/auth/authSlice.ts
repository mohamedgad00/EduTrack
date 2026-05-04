import api from '@/utils/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "student" | "teacher" | "parent" | "admin";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  gradeLevel?: string;
  classId?: number;
  studentId?: number;
}


interface AuthState {
	user: User | null;
	token: string | null;
	isLoading: boolean;
	error: string | null;
	isInitialized: boolean;
}

const initialState: AuthState = {
	user: null,
	token: Cookies.get('token') || null,
	isLoading: false,
	error: null,
	isInitialized: false,
};

interface LoginResponse {
	user: User;
	access_token: string;
}

export const loginUser = createAsyncThunk(
  '/auth/login',
  async (
    { email, password, role }: { email: string; password: string; role: User['role'] },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post<LoginResponse>('auth/login', {
        email,
        password,
        role,
      });

      const { user, access_token } = response.data;
      Cookies.set('token', access_token, { expires: 7 });
      return { user, token: access_token };
    } catch (error) {
      console.log('Login error:', error);
      return rejectWithValue('Login failed. Please check your credentials.');
    }
  }
);

export const logoutUser = createAsyncThunk(
	'auth/logout',
	async (_, { rejectWithValue }) => {
		try {
			Cookies.remove('token');
		} catch (error) {
      console.log('Logout error:', error);
			return rejectWithValue('Logout failed.');
		}
	},
);

export const getMe = createAsyncThunk(
	'auth/getMe',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.get<{ user: User }>('/me');
			return response.data;
		} catch (error) {
      console.log('GetMe error:', error);
			return rejectWithValue('Failed to fetch user information.');
		}
	},
);

interface UpdateProfileData {
	firstName?: string;
	lastName?: string;
	password?: string;
}

export const updateProfile = createAsyncThunk(
	'auth/updateProfile',
	async (profileData: UpdateProfileData, { rejectWithValue }) => {
		try {
			const response = await api.put<{ user: User }>(
				'/auth/update-profile',
				profileData,
			);
			return response.data.user;
		} catch (error) {
			console.log('Update profile error:', error);
			return rejectWithValue('Failed to update profile. Please try again.');
		}
	},
);

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(loginUser.pending, state => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(
				loginUser.fulfilled,
				(state, action: PayloadAction<{ user: User; token: string }>) => {
					state.isLoading = false;
					state.user = action.payload.user;
					state.token = action.payload.token;
					state.error = null;
				},
			)
			.addCase(loginUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})
			.addCase(logoutUser.pending, state => {
				state.isLoading = true;
			})
			.addCase(logoutUser.fulfilled, state => {
				state.user = null;
				state.token = null;
				state.isLoading = false;
				state.error = null;
			})
			.addCase(logoutUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})
			.addCase(getMe.pending, state => {
				state.isLoading = true;
			})
			.addCase(
				getMe.fulfilled,
				(state, action: PayloadAction<{ user: User }>) => {
					state.isLoading = false;
					state.user = action.payload.user;
					state.error = null;
				},
			)
			.addCase(getMe.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})
			.addCase(updateProfile.pending, state => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(
				updateProfile.fulfilled,
				(state, action: PayloadAction<User>) => {
					state.isLoading = false;
					state.user = action.payload;
					state.error = null;
				},
			)
			.addCase(updateProfile.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			});
	},
});

export default authSlice.reducer;
