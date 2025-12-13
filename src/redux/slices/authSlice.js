// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Important for httpOnly cookies
      });
       
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify({
        _id: response.data._id,
        username: response.data.username,
        email: response.data.email
      }));
      
      return response.data;
    } catch (error) {
      // Return custom error message from backend if available
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ detail: 'Network error. Please try again.' });
    }
  }
);

// Async thunk for register
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData, {
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
        }
      });

      // Save user in localStorage
      localStorage.setItem("user", JSON.stringify({
        _id: response.data._id,
        username: response.data.username,
        email: response.data.email
      }));

      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ detail: "Network Error. Please try again." });
    }
  }
);


// Async thunk for Google login
export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/google/login`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    isLoading: false,
    error: null,
    success: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.success = false;
      localStorage.removeItem('user');
    },
    clearMessages: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Google login cases
      .addCase(googleLogin.fulfilled, (state, action) => {
        if (action.payload.auth_url) {
          window.location.href = action.payload.auth_url;
        }
      })
      // Register cases
builder
  .addCase(registerUser.pending, (state) => {
    state.isLoading = true;
    state.error = null;
    state.success = false;
  })
  .addCase(registerUser.fulfilled, (state, action) => {
    state.isLoading = false;
    state.user = action.payload;
    state.success = true;
  })
  .addCase(registerUser.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
    state.success = false;
  });

  },
});

export const { logout, clearMessages } = authSlice.actions;
export default authSlice.reducer;