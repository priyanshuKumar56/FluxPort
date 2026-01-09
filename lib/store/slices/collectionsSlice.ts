import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api/client';

interface Collection {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface CollectionsState {
  collections: Collection[];
  loading: boolean;
  error: string | null;
}

const initialState: CollectionsState = {
  collections: [],
  loading: false,
  error: null,
};

export const fetchCollections = createAsyncThunk('collections/fetchAll', async () => {
  try {
    const collections = await apiClient.getCollections();
    return collections || [];
  } catch (error) {
    console.error('Failed to fetch collections:', error);
    return [];
  }
});

export const createCollection = createAsyncThunk(
  'collections/create',
  async (name: string) => {
    return await apiClient.createCollection(name);
  }
);

export const updateCollection = createAsyncThunk(
  'collections/update',
  async ({ id, name }: { id: string; name: string }) => {
    return await apiClient.updateCollection(id, name);
  }
);

export const deleteCollection = createAsyncThunk(
  'collections/delete',
  async (id: string) => {
    await apiClient.deleteCollection(id);
    return id;
  }
);

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.collections = action.payload;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch collections';
      })
      .addCase(createCollection.fulfilled, (state, action) => {
        state.collections.push(action.payload);
      })
      .addCase(updateCollection.fulfilled, (state, action) => {
        const index = state.collections.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.collections[index] = action.payload;
        }
      })
      .addCase(deleteCollection.fulfilled, (state, action) => {
        state.collections = state.collections.filter((c) => c.id !== action.payload);
      });
  },
});

export default collectionsSlice.reducer;

