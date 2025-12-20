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

export const fetchnormalchallenges = createAsyncThunk(
    "weekly-challenges/normal",
    async(_,{rejectWithValue}) =>{

        try{

            const res = await fetch("http://localhost:5000/api/weekly-challenges/normal",
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
                throw new Error("Failed to fetch Normal Challenges")
            }

            return await res.json();


        }
        catch(error)
        {
            return rejectWithValue(error.message);
        }

    }
)

const weeklychallengeslice = createSlice({
    name:"weeklychallenges",
    initialState:{
        weeklycontests:[],
        loading:false,
        error:null

    },
    reducers:{
        resetWeeklyChallenges: (state) =>
        {
            state.weeklycontests = [];
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
            state.weeklycontests = action.payload.contests;
            

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

       pastchallenges: [],
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
            state.pastchallenges = [];
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
            state.pastchallenges = action.payload.challenges;
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

const normalchallengesslice = createSlice({
  name: "normalchallenges",
  initialState: {
    normalContests: [],
    normalContestsLoading: false,
    normalContestsError: null
  },
  reducers: {
    resetNormalChallenges: (state) => {
      state.normalContests = [];
      state.normalContestsLoading = false;
      state.normalContestsError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchnormalchallenges.pending, (state) => {
        state.normalContestsLoading = true;
        state.normalContestsError = null;
      })
      .addCase(fetchnormalchallenges.fulfilled, (state, action) => {
        state.normalContestsLoading = false;
        state.normalContestsError = null;
        state.normalContests = action.payload.contests;
      })
      .addCase(fetchnormalchallenges.rejected, (state, action) => {
        state.normalContestsLoading = false;
        state.normalContestsError = action.payload;
      });
  }
});

export const weeklyChallengesReducer = weeklychallengeslice.reducer;
export const { resetWeeklyChallenges } = weeklychallengeslice.actions;

export const pastChallengesReducer = pastchallengeslice.reducer;
export const { resetPastChallenges } = pastchallengeslice.actions;

export const normalChallengesReducer = normalchallengesslice.reducer;
export const { resetNormalChallenges } = normalchallengesslice.actions;
