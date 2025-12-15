import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUserProgress = createAsyncThunk(
  "userProgress/fetchUserProgress",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/problems/user-progress",
        { credentials: "include" }
      );

      if (!res.ok) throw new Error("Failed to fetch user progress");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const userprogressSlice = createSlice({
  name: "userProgress",
  initialState: {
    solvedProblemIds: [],
    solvedCount: 0,
    acceptanceRate: 0,
    totalSubmissions: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.solvedProblemIds = action.payload.problemIds || [];
        state.solvedCount = action.payload.solvedCount;
        state.acceptanceRate = action.payload.acceptanceRate;
        state.totalSubmissions = action.payload.totalSubmissions;
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userprogressSlice.reducer;
