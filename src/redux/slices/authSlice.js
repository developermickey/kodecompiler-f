// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth';

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


export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_URL}/login/otp/verify`,
        payload,
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
          withCredentials: true, // 🔑 allows httpOnly cookie
        }
      );

      // Store ONLY non-sensitive user info
      localStorage.setItem(
        'user',
        JSON.stringify({
          _id: res.data._id,
          username: res.data.username,
          email: res.data.email,
        })
      );

      return res.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ detail: 'OTP verification failed' });
    }
  }
);


export const getOTP = createAsyncThunk('auth/getOTP', async (payload, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/login/otp/request`, payload, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials: true, // 🔑 allows httpOnly cookie
    })
    return res.data
  } catch (error) {
    if (error.response?.data) {
      return rejectWithValue(error.response.data); // ✅ preserve backend message
    }

    return rejectWithValue({
      detail: "OTP can't be sent. Please try again.",
    });

  }
})



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

    // global
    isLoading: false,
    error: null,
    success: false,

    // OTP specific
    otpSent: false,
    verifyingOTP: false,
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
      /* ================= LOGIN ================= */
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

      /* ================= GOOGLE LOGIN ================= */
      .addCase(googleLogin.fulfilled, (state, action) => {
        if (action.payload.auth_url) {
          window.location.href = action.payload.auth_url;
        }
      })

      /* ================= REGISTER ================= */
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
      })

      /* ================= GET OTP ================= */
      .addCase(getOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.otpSent = false;
      })
      .addCase(getOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.otpSent = true; // 🔑 OTP sent successfully
      })
      .addCase(getOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.otpSent = false;
      })

      /* ================= VERIFY OTP ================= */
      .addCase(verifyOTP.pending, (state) => {
        state.verifyingOTP = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.verifyingOTP = false;
        state.user = action.payload; // logged in
        state.success = true;
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.verifyingOTP = false;
        state.error = action.payload;
        state.success = false;
      });
  },

});

export const { logout, clearMessages } = authSlice.actions;
export default authSlice.reducer;