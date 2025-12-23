// src/redux/slices/globalLeaderboardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchGlobalLeaderboard = createAsyncThunk(
  "weekly-challenges/leaderboard",
  async ({ limit = 100 } = {}, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/weekly-challenges/leaderboard?limit=${limit}`,
        {
          method: "GET",
          credentials: "include"
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch leaderboard");
      }

      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const globalLeaderboardSlice = createSlice({
  name: "globalLeaderboard",
  initialState: {
    leaderboard: [],
    myRank: null,
    totalUsers: 0,
    leaderboardLoading: false,
    leaderboardError: null
  },
  reducers: {
    resetGlobalLeaderboard: (state) => {
      state.leaderboard = [];
      state.myRank = null;
      state.totalUsers = 0;
      state.leaderboardLoading = false;
      state.leaderboardError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlobalLeaderboard.pending, (state) => {
        state.leaderboardLoading = true;
        state.leaderboardError = null;
      })
      .addCase(fetchGlobalLeaderboard.fulfilled, (state, action) => {
        state.leaderboardLoading = false;
        state.leaderboard = action.payload.leaderboard;
        state.myRank = action.payload.my_rank;
        state.totalUsers = action.payload.total;
      })
      .addCase(fetchGlobalLeaderboard.rejected, (state, action) => {
        state.leaderboardLoading = false;
        state.leaderboardError = action.payload;
      });
  }
});

export const { resetGlobalLeaderboard } = globalLeaderboardSlice.actions;
export const globalLeaderboardReducer =  globalLeaderboardSlice.reducer;
