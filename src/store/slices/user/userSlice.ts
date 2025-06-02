import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API } from '../../../api/api';
import { LoginResponse } from '../../../types/tyre';

interface User {
  token: string;
  userId: string;
  name: string;
  email: string;
}

interface AuthPayload {
  email: string;
  password: string;
}

export interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  pendingEmail: string | null;
}

const initialState: UserState = {
  user: {
    token: localStorage.getItem('token') || '',
    userId: localStorage.getItem('userId') || '',
    name: '',
    email: '',
  },
  loading: false,
  error: null,
  pendingEmail: null,
};

// AsyncThunk для логіну
export const loginUser = createAsyncThunk<
  LoginResponse,
  AuthPayload,
  { rejectValue: { message: string } }
>('user/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const res = await API.post('/api/auth/login', credentials);
    return res.data as LoginResponse;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || 'Помилка входу',
    });
  }
});

// AsyncThunk для реєстрації (повторимо для повноти)
export const registerUser = createAsyncThunk<
  string,
  { name: string; email: string; password: string },
  { rejectValue: { message: string } }
>('user/register', async (formData, { rejectWithValue }) => {
  try {
    const res = await API.post('/api/auth/register', formData);
    return res.data.message;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || 'Помилка реєстрації',
    });
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.pendingEmail = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    },
    clearError: (state) => {
      state.error = null;
    },
    setPendingEmail: (state, action: PayloadAction<string>) => {
      state.pendingEmail = action.payload;
    },
    clearPendingEmail: (state) => {
      state.pendingEmail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          token: action.payload.token,
          userId: action.payload.userId,
          name: action.payload.name,
          email: action.payload.email,
        };
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('userId', action.payload.userId);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Помилка логіну';
      })

      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Помилка реєстрації';
      });
  },
});

export const { logout, clearError, setPendingEmail, clearPendingEmail } = userSlice.actions;
export default userSlice.reducer;
