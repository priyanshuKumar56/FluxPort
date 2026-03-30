import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/client";

interface Collection {
  id: string;
  name: string;
  description?: string;
  workspace_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  folder_count?: number;
  request_count?: number;
}

interface Folder {
  id: string;
  name: string;
  collection_id: string;
  parent_folder_id?: string;
  requests: SavedRequest[];
}

interface SavedRequest {
  id: string;
  name: string;
  method: string;
  url: string;
  collection_id: string;
  folder_id?: string;
  headers?: any;
  body?: string;
  query_params?: any;
  auth_type?: string;
  auth_config?: any;
}

interface CollectionsState {
  collections: Collection[];
  currentCollection:
    | (Collection & { folders: Folder[]; requests: SavedRequest[] })
    | null;
  loading: boolean;
  error: string | null;
}

const initialState: CollectionsState = {
  collections: [],
  currentCollection: null,
  loading: false,
  error: null,
};

export const fetchCollections = createAsyncThunk(
  "collections/fetchAll",
  async (workspaceId: string) => {
    try {
      const collections = await apiClient.getCollections(workspaceId);
      return collections || [];
    } catch (error) {
      console.error("Failed to fetch collections:", error);
      return [];
    }
  },
);

export const fetchCollectionTree = createAsyncThunk(
  "collections/fetchTree",
  async (collectionId: string) => {
    try {
      const collection = await apiClient.getCollectionTree(collectionId);
      return collection;
    } catch (error) {
      console.error("Failed to fetch collection tree:", error);
      return null;
    }
  },
);

export const createCollection = createAsyncThunk(
  "collections/create",
  async ({
    workspaceId,
    name,
    description,
  }: {
    workspaceId: string;
    name: string;
    description?: string;
  }) => {
    return await apiClient.createCollection(workspaceId, name, description);
  },
);

export const updateCollection = createAsyncThunk(
  "collections/update",
  async ({
    id,
    name,
    description,
  }: {
    id: string;
    name?: string;
    description?: string;
  }) => {
    return await apiClient.updateCollection(id, name, description);
  },
);

export const deleteCollection = createAsyncThunk(
  "collections/delete",
  async (id: string) => {
    await apiClient.deleteCollection(id);
    return id;
  },
);

export const createFolder = createAsyncThunk(
  "collections/createFolder",
  async ({
    collectionId,
    name,
    description,
    parent_folder_id,
  }: {
    collectionId: string;
    name: string;
    description?: string;
    parent_folder_id?: string;
  }) => {
    return await apiClient.createFolder(
      collectionId,
      name,
      description,
      parent_folder_id,
    );
  },
);

export const createSavedRequest = createAsyncThunk(
  "collections/createRequest",
  async ({
    collectionId,
    folderId,
    data,
  }: {
    collectionId: string;
    folderId?: string;
    data: any;
  }) => {
    return await apiClient.createSavedRequest(collectionId, folderId, data);
  },
);

const collectionsSlice = createSlice({
  name: "collections",
  initialState,
  reducers: {
    clearCurrentCollection: (state) => {
      state.currentCollection = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch collections
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
        state.error = action.error.message || "Failed to fetch collections";
      })
      // Fetch collection tree
      .addCase(fetchCollectionTree.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCollectionTree.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCollection = action.payload;
      })
      .addCase(fetchCollectionTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch collection tree";
      })
      // Create collection
      .addCase(createCollection.fulfilled, (state, action) => {
        state.collections.push(action.payload);
      })
      // Update collection
      .addCase(updateCollection.fulfilled, (state, action) => {
        const index = state.collections.findIndex(
          (c) => c.id === action.payload.id,
        );
        if (index !== -1) {
          state.collections[index] = action.payload;
        }
        if (state.currentCollection?.id === action.payload.id) {
          state.currentCollection = {
            ...state.currentCollection,
            ...action.payload,
          };
        }
      })
      // Delete collection
      .addCase(deleteCollection.fulfilled, (state, action) => {
        state.collections = state.collections.filter(
          (c) => c.id !== action.payload,
        );
        if (state.currentCollection?.id === action.payload) {
          state.currentCollection = null;
        }
      })
      // Create folder
      .addCase(createFolder.fulfilled, (state, action) => {
        if (state.currentCollection) {
          state.currentCollection.folders.push({
            ...action.payload,
            requests: [],
          });
        }
      })
      // Create saved request
      .addCase(createSavedRequest.fulfilled, (state, action) => {
        if (state.currentCollection) {
          const folderId = action.payload.folder_id;
          if (folderId) {
            const folder = state.currentCollection.folders.find(
              (f) => f.id === folderId,
            );
            if (folder) {
              folder.requests.push(action.payload);
            }
          } else {
            state.currentCollection.requests.push(action.payload);
          }
        }
      });
  },
});

export const { clearCurrentCollection } = collectionsSlice.actions;

export default collectionsSlice.reducer;
