import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { API, deleteTyre, fetchTyres, removeFromActiveTyres, renewTyre } from '../../../api/api';
import { Tyre, SortOption, Filters } from '../../../types/tyre';
import { TyreFilterField } from '../../../constants/tyreOptions';
import { RootState } from '../../store';
import { clearFiltersFromStorage, loadFiltersFromStorage, saveFiltersToStorage } from '../../../utils/localStorage';

const persistedFilters = loadFiltersFromStorage();
const PAGE_SIZE = 6;

interface TyresState {
  tyres: Tyre[];
  total: number;
  page: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  sortBy: SortOption;
  filters: Record<TyreFilterField, string>;
}

const initialState: TyresState = {
  tyres: [],
  total: 0,
  page: 1,
  hasMore: true,
  loading: false,
  error: null,
  sortBy: SortOption.Newest,
  filters: persistedFilters ?? {
    width: '',
    height: '',
    radius: '',
    title: '',
    season: '',
    vehicle: '',
    condition: '',
  },
};

export const fetchTyresList = createAsyncThunk('tyres/load', async (_, { getState }) => {
  const state = getState() as { tyres: TyresState };
  const { filters, page, sortBy } = state.tyres;

  const mappedFilters: Filters = { ...filters };

  const response = await fetchTyres(mappedFilters, page, PAGE_SIZE, sortBy);

  return response;
});

export const activateTyre = createAsyncThunk(
  'tyres/activate',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await API.patch(`/api/tyres/${id}/activate`);
      return id;
    } catch (error) {
      return rejectWithValue('Не вдалося активувати оголошення');
    }
  },
);

export const renewTyreThunk = createAsyncThunk(
  'tyres/renew',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await renewTyre(id);
      return { id, ...res };
    } catch (error) {
      return rejectWithValue('Не вдалося оновити оголошення');
    }
  },
);

export const removeTyreFromActive = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string }
>('tyres/removeFromActive', async (id, { rejectWithValue }) => {
  try {
    const res = await removeFromActiveTyres(id);

    if (res && typeof res !== 'string' && 'status' in res && res.status === 200) {
      return { id };
    } else {
      return rejectWithValue('Не вдалося деактивувати оголошення');
    }
  } catch (error) {
    return rejectWithValue('Сталася помилка при видаленні');
  }
});

export const removeTyre = createAsyncThunk<{ id: string }, string, { rejectValue: string }>(
  'tyres/delete',
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteTyre(id);

      if (res && typeof res !== 'string' && 'status' in res && res.status === 200) {
        return { id };
      } else {
        return rejectWithValue('Не вдалося видалити оголошення');
      }
    } catch (error) {
      return rejectWithValue('Сталася помилка при видаленні');
    }
  },
);

const tyresSlice = createSlice({
  name: 'tyres',
  initialState,
  reducers: {
    setSortBy(state, action: PayloadAction<SortOption>) {
      state.sortBy = action.payload;
      state.page = 1;
      state.tyres = [];
      state.hasMore = true;
    },
    setFilters(state, action: PayloadAction<{ field: TyreFilterField; value: string }>) {
      const { field, value } = action.payload;

      if (state.filters[field] !== value) {
        state.filters[field] = value;
        state.page = 1;
        state.tyres = [];
        state.hasMore = true;
        saveFiltersToStorage(state.filters);
      }
    },
    resetFilters(state) {
      state.filters = { ...initialState.filters };
      state.sortBy = SortOption.Newest;
      state.page = 1;
      state.tyres = [];
      state.hasMore = true;
      clearFiltersFromStorage();
    },
    incrementPage(state) {
      state.page += 1;
    },
    resetTyresState: (state) => {
      state.tyres = [];
      state.page = 1;
      state.hasMore = true;
      state.total = 0;
      state.loading = false;
    },
    clearTyresError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTyresList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTyresList.fulfilled, (state, action) => {
        const { tyres, total } = action.payload;

        state.tyres =
          state.page === 1
            ? tyres
            : [
                ...state.tyres,
                ...tyres.filter((t) => !state.tyres.some((existing) => existing._id === t._id)),
              ];
        state.total = total;
        state.hasMore = state.page * PAGE_SIZE < total;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchTyresList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Сервер недоступний. Спробуйте пізніше';
      })
      .addCase(removeTyreFromActive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTyreFromActive.fulfilled, (state, action) => {
        state.loading = false;
        const tyre = state.tyres.find((t) => t._id === action.payload.id);

        if (tyre) {
          tyre.isDeleted = true;
        }
      })
      .addCase(removeTyreFromActive.rejected, (state) => {
        state.loading = false;
        state.error = 'Помилка при видаленні оголошення';
      })
      .addCase(removeTyre.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTyre.fulfilled, (state, action) => {
        state.tyres = state.tyres.filter((t) => t._id !== action.payload.id);
        state.loading = false;
      })
      .addCase(removeTyre.rejected, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(activateTyre.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activateTyre.fulfilled, (state, action) => {
        const tyre = state.tyres.find((t) => t._id === action.payload);

        if (tyre) {
          tyre.isActive = true;
          tyre.isDeleted = false;
        }
        state.loading = false;
      })
      .addCase(activateTyre.rejected, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(renewTyreThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(renewTyreThunk.fulfilled, (state, action) => {
        const tyre = state.tyres.find((t) => t._id === action.payload.id);
        if (tyre) {
          tyre.expiresAt = action.payload.updatedExpiresAt;
          tyre.willBeDeletedAt = action.payload.updatedWillBeDeletedAt;
          tyre.isActive = true;
          tyre.isDeleted = false;
          tyre.isExpired = false;
        }
        state.loading = false;
      })
      .addCase(renewTyreThunk.rejected, (state) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export const {
  setSortBy,
  setFilters,
  resetFilters,
  incrementPage,
  resetTyresState,
  clearTyresError,
} = tyresSlice.actions;

export const selectTyres = (state: RootState) => state.tyres.tyres;
export const selectTyresLoading = (state: RootState) => state.tyres.loading;
export const selectTyresFilters = (state: RootState) => state.tyres.filters;
export const selectHasMore = (state: RootState) => state.tyres.hasMore;
export const selectTotalTyres = (state: RootState) => state.tyres.total;

export default tyresSlice.reducer;
