import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../config/api";

export const fetchinterviewExperience = createAsyncThunk(
  "interviewExperiences/fetchAll",
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
        `${API_BASE_URL}/interview-experiences?${params.toString()}`,
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

export const fetchinterviewbyid = createAsyncThunk(
   "interviewExperiences/fetchById",
  async(id,{ rejectWithValue })=>
  {
    try
    {
       const res = await fetch(`${API_BASE_URL}/interview-experiences/${id}`,
        {
          method: "GET",
          credentials: "include", 
        }
       );


       if(!res.ok)
       {
        throw new Error("Unable to fetch Experience");

       }

       return await res.json();

    }
    catch(error)
    {
      return rejectWithValue(error.message);
    }
  }
  
)


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


const experienceSlice = createSlice({
  name:"experiencedata",
  initialState:{
    experience:null,
    experienceloading:false,
    experienceerror:null
  },
  reducers:{
    resetexperience: (state)=>
    {
      state.experience = null,
      state.experienceloading = false,
      state.experienceerror = null
    }
  },
  extraReducers: (builder)=>{
    builder.
    addCase(fetchinterviewbyid.pending, (state)=>{
      state.experienceloading = true,
      state.experienceerror = null
    })
    .addCase(fetchinterviewbyid.fulfilled ,(state,action)=>{
      state.experience = action.payload,
      state.experienceloading = false,
      state.experienceerror = null
    })
    .addCase(fetchinterviewbyid.rejected, (state,action)=>{
      state.experienceloading = false,
      state.experienceerror = action.payload
    })
  }

})


export const { resetinterviewexperience } = interviewexperienceSlice.actions;
export const interviewexperienceReducer =  interviewexperienceSlice.reducer;

export const {resetexperience} = experienceSlice.actions;
export const experienceReducer = experienceSlice.reducer;