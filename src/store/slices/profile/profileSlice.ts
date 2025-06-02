import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../../api/api';

export interface Profile {
  id: string;
  name: string;
  email: string;
  city?: string;
  phone?: string;
  phoneVerified?: boolean;
  phoneTokenAttempts?: number;
  favorites?: string[];
  isVerified?: boolean;
  isEmailConfirmed?: boolean;
  isAdmin?: boolean;
}

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  success: false,
};

// Отримання профілю користувача
export const fetchUserProfile = createAsyncThunk<
  Profile,
  void,
  { rejectValue: { message: string } }
>('profile/fetchUserProfile', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/api/user/profile');

    const mappedProfile: Profile = {
      id: data._id,
      name: data.name,
      email: data.email,
      city: data.city,
      phone: data.phone,
      phoneVerified: data.phoneVerified,
      phoneTokenAttempts: data.phoneTokenAttempts,
      favorites: data.favorites,
      isVerified: data.isVerified,
      isEmailConfirmed: data.isEmailConfirmed,
      isAdmin: data.isAdmin,
    };

    return mappedProfile;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || 'Не вдалося завантажити профіль',
    });
  }
});

// Оновлення профілю користувача
export const updateUserProfile = createAsyncThunk<
  Profile,
  Partial<Profile>,
  { rejectValue: { message: string } }
>('profile/updateUserProfile', async (updatedData, { rejectWithValue }) => {
  try {
    const res = await API.put('/api/user/profile', updatedData);
    return res.data;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || 'Не вдалося оновити профіль',
    });
  }
});

export const changePassword = createAsyncThunk(
  'profile/updatePassword',
  async (payload: ChangePasswordPayload, { rejectWithValue }) => {
    try {
      const response = await API.put('/api/user/updatePassword', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Password change failed');
    }
  },
);

export const sendPhoneVerificationCode = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: { message: string } }
>('profile/sendPhoneCode', async (phone, { rejectWithValue }) => {
  try {
    const res = await API.post('/api/phone/send', { phone });
    return res.data;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || 'Не вдалося надіслати код',
    });
  }
});

export const verifyPhone = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: { message: string } }
>('profile/verifyPhone', async (code, { rejectWithValue }) => {
  try {
    const res = await API.post('/api/phone/verify', { code });
    return res.data;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || 'Невірний код підтвердження',
    });
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetProfileState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUserProfile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Помилка завантаження профілю';
      })

      // updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.success = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Помилка оновлення профілю';
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendPhoneVerificationCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendPhoneVerificationCode.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendPhoneVerificationCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Помилка надсилання коду';
      })
      .addCase(verifyPhone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPhone.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyPhone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Помилка підтвердження телефону';
      });
  },
});

export const { resetProfileState } = profileSlice.actions;
export default profileSlice.reducer;
