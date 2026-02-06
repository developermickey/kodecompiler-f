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

const folderSlice = createSlice({
  name: "folder",
  initialState: {
    isLoading: false,
    folders: [],
    error1: null,
    isCreating: false,
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
      })
      .addCase(createFolder.rejected, (state,action) => {
        state.isCreating = false;
        state.error1 = action.payload || "Folder creation failed";
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.isCreating = false;
        state.folders.push(action.payload);
      });
  },
});

export default folderSlice.reducer;
