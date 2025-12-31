import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchContestDetails = createAsyncThunk(
  "contest/fetchContestDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/weekly-challenges/${id}`,
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
