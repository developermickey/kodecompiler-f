import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const API_URL = "http://localhost:5000/api/auth";

/* ========================= LOGIN ========================= */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        withCredentials: true, // 🔑 httpOnly cookie
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: response.data._id,
          username: response.data.username,
          email: response.data.email,
        })
      );

      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ detail: "Network error. Please try again." });
    }
  }
);

/* ========================= REGISTER ========================= */
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, userData, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: response.data._id,
          username: response.data.username,
          email: response.data.email,
        })
      );

      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ detail: "Network error. Please try again." });
    }
  }
);

/* ========================= OTP ========================= */
export const getOTP = createAsyncThunk(
  "auth/getOTP",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/login/otp/request`, payload, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { detail: "OTP can't be sent." }
      );
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/login/otp/verify`, payload, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: res.data._id,
          username: res.data.username,
          email: res.data.email,
        })
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { detail: "OTP verification failed" }
      );
    }
  }
);

/* ========================= GOOGLE LOGIN ========================= */
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/google/login`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

/* ========================= LOGOUT (COOKIE CLEAR) ========================= */
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(
        `${API_BASE_URL}/logout`,
        {},
        { withCredentials: true } // 🔑 clears httpOnly cookie
      );
      return true;
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  }
);

/* ========================= SLICE ========================= */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,

    isLoading: false,
    error: null,
    success: false,

    otpSent: false,
    verifyingOTP: false,
  },

  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder
      /* LOGIN */
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.success = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      /* REGISTER */
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      /* OTP */
      .addCase(getOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.otpSent = true;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.verifyingOTP = true;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.verifyingOTP = false;
        state.user = action.payload;
        state.success = true;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.verifyingOTP = false;
        state.error = action.payload;
      })

      /* GOOGLE */
      .addCase(googleLogin.fulfilled, (_, action) => {
        if (action.payload?.auth_url) {
          window.location.href = action.payload.auth_url;
        }
      })

      /* LOGOUT */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.error = null;
        state.success = false;
        localStorage.removeItem("user");
      });
  },
});

export const { clearMessages } = authSlice.actions;
export default authSlice.reducer;
