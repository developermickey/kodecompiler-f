import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const fetchweeklychallenges = createAsyncThunk(
    "weekly-challenges/weekly",
    async (_,{rejectWithValue})=>
        {
            try
            {
            const res = await fetch("http://localhost:5000/api/weekly-challenges/weekly",
                {
                    method:"GET",
                    credentials:"include",
                    headers:
                    {
                        "Content-Type": "application/json"
                    }
                }
            );

            if(!res.ok)
            {
                throw new Error("Unauthorized or failed request");

            }
            return await res.json();
            }
            catch(e)
            {
                return rejectWithValue(e.message);
            }
        } 
);


export const fetchpastchallenges = createAsyncThunk(
    "weekly-challenges/past",
    async ({skip = 0, limit = 10},{rejectWithValue})=>
    {
        try
        {
            const res = await fetch(`http://localhost:5000/api/weekly-challenges/past?skip=${skip}&limit=${limit}`,
                {
                    method:"GET",
                    credentials:"include"
                   

                }
            )

            if(!res.ok)
                throw new Error("Failed TO Fetch");


            return await res.json();

        }catch(error)
        {
            return rejectWithValue(error.message)
        }

    }
);

const weeklychallengeslice = createSlice({
    name:"weeklychallenges",
    initialState:{
        contests:[],
        loading:false,
        error:null

    },
    reducers:{
        resetWeeklyChallenges: (state) =>
        {
            state.contests = [];
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) =>
    {
        builder
        .addCase(fetchweeklychallenges.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchweeklychallenges.fulfilled, (state,action)=>
        {
            state.loading = false;
            state.contests = action.payload.contests;
            

        })
        .addCase(fetchweeklychallenges.rejected, (state,action)=>
        {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

const pastchallengeslice = createSlice({
    name:"pastchallenges",
    initialState:{

       challenges: [],
        total: 0,
        skip: 0,
        limit: 10,
        loading: false,
        error: null
    },
    reducers:
    {
        resetPastChallenges: (state) =>
        {
            state.challenges = [];
            state.total = 0;
            state.skip = 0;
            state.limit = 10;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder)=>
    {
        builder
        .addCase(fetchpastchallenges.pending, (state)=>
        {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchpastchallenges.fulfilled, (state,action)=>
        {
            state.challenges = action.payload.challenges;
            state.total = action.payload.total;
            state.skip = action.payload.skip;
            state.limit = action.payload.limit;
            state.loading = false;
            state.error = null;

        })
        .addCase(fetchpastchallenges.rejected, (state,action)=>
        {
            state.error = action.payload;
            state.loading = false;
        })

    }
    
})
export const weeklyChallengesReducer = weeklychallengeslice.reducer;
export const { resetWeeklyChallenges } = weeklychallengeslice.actions;

export const pastChallengesReducer = pastchallengeslice.reducer;
export const { resetPastChallenges } = pastchallengeslice.actions;

