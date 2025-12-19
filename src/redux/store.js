// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import problemsReducer from "./slices/problemSlice";
import userProgressReducer from "./slices/userprogressSlice";
import { pastChallengesReducer, weeklyChallengesReducer } from './slices/challengesSlice';
import {userchallengeprogressReducer} from "./slices/userchallengesprogressSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    problems: problemsReducer,
    userProgress: userProgressReducer,
    weeklychallenges: weeklyChallengesReducer,
    pastchallenges: pastChallengesReducer,
    userchallengesprogress : userchallengeprogressReducer,
    // Add other reducers here
  },
});