import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Tyre } from '../../../types/tyre';
import { fetchTyresFromAPI } from '../../../api/api';

interface MyTyresState {
  myTyres: Tyre[];
  loading: boolean;
  error: string | null;
}

const initialState: MyTyresState = {
  myTyres: [],
  loading: false,
  error: null,
};

export const fetchMyTyres = createAsyncThunk<Tyre[], void, { rejectValue: string }>(
  'myTyres/fetchMyTyres',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchTyresFromAPI('/api/tyres/my');
      return response.tyres;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Помилка завантаження моїх шин');
    }
  },
);

const myTyresSlice = createSlice({
  name: 'myTyres',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyTyres.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTyres.fulfilled, (state, action) => {
        state.myTyres = action.payload;
        state.loading = false;
      })
      .addCase(fetchMyTyres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Помилка завантаження моїх шин';
      });
  },
});

export default myTyresSlice.reducer;
