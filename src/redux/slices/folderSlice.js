import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../api/axios";

export const fetchFolders = createAsyncThunk(
  "folder/getFolder",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/api/folders/");
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Execution failed" },
      );
    }
  },
);

export const createFolder = createAsyncThunk(
  "folder/createFolder",
  async (path, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/api/folders/", {path});
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Creation failed." },
      );
    }
  },
);

// New: Delete folder by ID
export const deleteFolder = createAsyncThunk(
  "folder/deleteFolder",
  async (folderId, { rejectWithValue }) => {
    try {
      const res = await apiClient.delete(`/api/folders/${folderId}`);
      return { folderId, ...res.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Deletion failed." },
      );
    }
  },
);

// New: Update folder (rename)
export const updateFolder = createAsyncThunk(
  "folder/updateFolder",
  async ({ folderId, updates }, { rejectWithValue }) => {
    try {
      const res = await apiClient.put(`/api/folders/${folderId}`, updates);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Update failed." },
      );
    }
  },
);

const folderSlice = createSlice({
  name: "folder",
  initialState: {
    isLoading: false,
    folders: [],
    error1: null,
    isCreating: false,
    isDeleting: false,
    isUpdating: false,
  },

  reducers: {
    clearFolderError: (state) => {
      state.error1 = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchFolders.pending, (state) => {
        state.isLoading = true;
        state.error1 = null;
      })
      .addCase(fetchFolders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.folders = action.payload;
      })
      .addCase(fetchFolders.rejected, (state, action) => {
        state.isLoading = false;
        state.folders = [];
        state.error1 = action.payload || "Something went wrong";
      })
      .addCase(createFolder.pending, (state) => {
        state.isCreating = true;
        state.error1 = null;
      })
      .addCase(createFolder.rejected, (state,action) => {
        state.isCreating = false;
        state.error1 = action.payload || "Folder creation failed";
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.isCreating = false;
        state.folders.push(action.payload);
      })
      // New: Delete folder cases
      .addCase(deleteFolder.pending, (state) => {
        state.isDeleting = true;
        state.error1 = null;
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.isDeleting = false;
        // Remove deleted folder from state
        state.folders = state.folders.filter(
          (folder) => folder._id !== action.payload.folderId
        );
      })
      .addCase(deleteFolder.rejected, (state, action) => {
        state.isDeleting = false;
        state.error1 = action.payload || "Folder deletion failed";
      })
      // New: Update folder cases
      .addCase(updateFolder.pending, (state) => {
        state.isUpdating = true;
        state.error1 = null;
      })
      .addCase(updateFolder.fulfilled, (state, action) => {
        state.isUpdating = false;
        // Update the folder in state
        const index = state.folders.findIndex(
          (folder) => folder._id === action.payload._id
        );
        if (index !== -1) {
          state.folders[index] = action.payload;
        }
      })
      .addCase(updateFolder.rejected, (state, action) => {
        state.isUpdating = false;
        state.error1 = action.payload || "Folder update failed";
      });
  },
});

export const { clearFolderError } = folderSlice.actions;
export default folderSlice.reducer;