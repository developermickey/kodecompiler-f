// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import codeReducer from './slices/codeSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    code: codeReducer
    // Add other reducers here
  },
});