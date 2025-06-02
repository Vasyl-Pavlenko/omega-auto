import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Tyre } from '../../../types/tyre';
import {
  fetchTyreById,
  removeFromFavorite,
  addToFavorite,
  getFavorites,
  fetchTyresByIds,
} from '../../../api/api';

interface TyreState {
  favorites: Tyre[];
  tyresById: Record<string, Tyre>;
  favoritesIds: string[];
  loading: boolean;
  error: string | null;
  favoriteLoading: boolean;
  favoriteLoaded: boolean;
}

const initialState: TyreState = {
  favorites: [],
  tyresById: {},
  favoritesIds: [],
  loading: false,
  error: null,
  favoriteLoading: false,
  favoriteLoaded: false,
};

export const fetchFavorites = createAsyncThunk<Tyre[], void, { rejectValue: string }>(
  'favorites/fetchFavorites',
  async (_, thunkAPI) => {
    try {
      const ids = await getFavorites(); // отримуємо масив id
      if (!ids.length) return [];
      const { tyres } = await fetchTyresByIds(ids); // отримуємо деталі шин по id
      return tyres;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.message || 'Помилка завантаження улюблених');
    }
  },
);

export const loadTyreById = createAsyncThunk<Tyre, string, { rejectValue: string }>(
  'tyre/loadById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetchTyreById(id);

      if (!response || typeof response !== 'object' || !('data' in response)) {
        return rejectWithValue('Помилка завантаження шини');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Помилка завантаження шини');
    }
  },
);

export const toggleTyreFavorite = createAsyncThunk<
  { id: string; isFavorite: boolean },
  { id: string; currentFavorite: boolean },
  { rejectValue: string }
>('tyre/toggleFavorite', async ({ id, currentFavorite }, { rejectWithValue }) => {
  try {
    if (currentFavorite) {
      await removeFromFavorite(id);
    } else {
      await addToFavorite(id);
    }
    return { id, isFavorite: !currentFavorite };
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Помилка при оновленні обраного');
  }
});

const tyreSlice = createSlice({
  name: 'tyre',
  initialState,
  reducers: {
    clearTyre: (state) => {
      state.tyresById = {};
      state.favoritesIds = [];
      state.favorites = [];
      state.loading = false;
      state.error = null;
      state.favoriteLoading = false;
      state.favoriteLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchFavorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favoriteLoaded = true;
        state.favorites = action.payload;
        state.favoritesIds = action.payload.map((tyre) => tyre._id);

        // Оновлюємо tyresById, додаємо прапорець isFavorite = true для улюблених
        action.payload.forEach((tyre) => {
          state.tyresById[tyre._id] = { ...tyre, isFavorite: true };
        });
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.favoriteLoaded = false;
        state.error = action.payload || 'Помилка завантаження улюблених';
      })

      // loadTyreById
      .addCase(loadTyreById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTyreById.fulfilled, (state, action) => {
        state.loading = false;
        const tyre = action.payload;

        const isFavorite = state.favoritesIds.includes(tyre._id);
        state.tyresById[tyre._id] = { ...tyre, isFavorite };
      })
      .addCase(loadTyreById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Не вдалося завантажити шину. Спробуйте ще раз.';
      })

      // toggleTyreFavorite
      .addCase(toggleTyreFavorite.pending, (state) => {
        state.favoriteLoading = true;
      })
      .addCase(toggleTyreFavorite.fulfilled, (state, action) => {
        state.favoriteLoading = false;
        const { id, isFavorite } = action.payload;
      
        const tyre = state.tyresById[id];
        if (!tyre) return;
      
        // Оновлюємо tyresById
        state.tyresById[id] = { ...tyre, isFavorite };
      
        // Оновлюємо favoritesIds
        state.favoritesIds = isFavorite
          ? [...state.favoritesIds, id].filter((v, i, a) => a.indexOf(v) === i)
          : state.favoritesIds.filter((favId) => favId !== id);
      
        // Оновлюємо favorites
        state.favorites = isFavorite
          ? [...state.favorites, { ...tyre, isFavorite }].filter(
              (v, i, a) => a.findIndex((t) => t._id === v._id) === i
            )
          : state.favorites.filter((tyre) => tyre._id !== id);
      })
      .addCase(toggleTyreFavorite.rejected, (state) => {
        state.favoriteLoading = false;
      });
  },
});

export const { clearTyre } = tyreSlice.actions;
export default tyreSlice.reducer;
