// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import problemsReducer from "./slices/problemSlice";
import userProgressReducer from "./slices/userprogressSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    problems: problemsReducer,
    userProgress: userProgressReducer,
    // Add other reducers here
  },
});