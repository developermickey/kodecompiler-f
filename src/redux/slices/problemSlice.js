import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProblems = createAsyncThunk(
  "problems/fetchProblems",
  async () => {
    const res = await fetch("http://localhost:5000/api/problems");
    return res.json();
  }
);

const problemsSlice = createSlice({
  name: "problems",
  initialState: {
    list: [],
    stats: { total: 0, easy: 0, medium: 0, hard: 0 },
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProblems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProblems.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.problems;
        state.stats = {
          total: action.payload.total,
          easy: action.payload.easy,
          medium: action.payload.medium,
          hard: action.payload.hard,
        };
      })
      .addCase(fetchProblems.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default problemsSlice.reducer;
