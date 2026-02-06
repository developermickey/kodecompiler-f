import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

export const fetchContestDetails = createAsyncThunk(
  "contest/fetchContestDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/weekly-challenges/${id}`,
        {withCredentials: true}
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const contestSlice = createSlice({
  name: "contest",
  initialState: {
    contest: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContestDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContestDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.contest = action.payload;
      })
      .addCase(fetchContestDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default contestSlice.reducer;
