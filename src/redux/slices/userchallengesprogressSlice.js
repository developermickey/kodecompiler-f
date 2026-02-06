import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../config/api";

export const fetchuserchallengeprogress = createAsyncThunk(
    "weekly-challenges/my/progress",

    async(_,{rejectWithValue})=>
    {
        try{
            const res = await fetch(`${API_BASE_URL}/weekly-challenges/my/progress`,
                {
                    method:"GET",
                    credentials:"include"
                }
            )

            if(!res.ok)
                throw new Error("Failed to load progress");

            return await res.json();
        }
        catch(error)
        {
            return rejectWithValue(error.message);
        }
    }
);


const userchallengeprogressSlice = createSlice({
    name:"userchallengeprogress",
    initialState:{
         streak: {
        current_streak: 0,
        longest_streak: 0,
        weeks_participated: 0,
        last_participation: null
    },
    progress: [],
    loading: false,
    error: null
    },
    reducers:{
        resetUserChallengeProgress: (state) =>
        {
            state.streak =
            {
                current_streak: 0,
                longest_streak: 0,
                weeks_participated: 0,
                last_participation: null
            };
            state.progress = [];
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder)=>
    {
        builder
        .addCase(fetchuserchallengeprogress.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchuserchallengeprogress.fulfilled, (state,action)=>
        {
            state.streak = action.payload.streak;
            state.progress = action.payload.progress;
            state.loading = false;
            state.error = null;
        })
        .addCase(fetchuserchallengeprogress.rejected, (state,action)=>
        {
            state.error = action.payload;
            state.loading = false;
        })
    }
})

export const userchallengeprogressReducer = userchallengeprogressSlice.reducer;
export const { resetUserChallengeProgress } = userchallengeprogressSlice.actions;

