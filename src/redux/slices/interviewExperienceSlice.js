import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchinterviewExperience = createAsyncThunk(
  "interviewExperience/fetch",
  async (
    {
      company,
      difficulty,
      experience_level,
      job_role,
      sort_by = "recent",
      skip = 0,
      limit = 60,
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();

      if (company) params.append("company", company);
      if (difficulty) params.append("difficulty", difficulty);
      if (experience_level)
        params.append("experience_level", experience_level);
      if (job_role) params.append("job_role", job_role);
      if (sort_by) params.append("sort_by", sort_by);
      params.append("skip", skip);
      params.append("limit", limit);

      const res = await fetch(
        `http://localhost:5000/api/interview-experiences?${params.toString()}`,
        {
          method: "GET",
          credentials: "include", 
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch interview experiences");
      }

      return await res.json(); 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const interviewexperienceSlice = createSlice({
    name:"interviewexperience",
    initialState:{
        data:[],
        interviewexperienceloading:false,
        interviewexperienceerror:null
    },
    reducers:{
        resetinterviewexperience: (state)=>{
            state.data = [],
            state.interviewexperienceloading = false,
            state.interviewexperienceerror = null

        }
    },
    extraReducers:(builder)=>{
        builder.
        addCase(fetchinterviewExperience.pending, (state)=>{
            state.interviewexperienceerror = null,
            state.interviewexperienceloading = true
        })
        .addCase(fetchinterviewExperience.fulfilled, (state,action)=>{
            state.data = action.payload,
            state.interviewexperienceerror = null,
            state.interviewexperienceloading = false
        })
       .addCase(fetchinterviewExperience.rejected, (state,action)=>
        {
            state.interviewexperienceerror=action.payload,
            state.interviewexperienceloading = false;
        })
        }
})


export const { resetinterviewexperience } = interviewexperienceSlice.actions;
export const interviewexperienceReducer =  interviewexperienceSlice.reducer;
