// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import problemsReducer from "./slices/problemSlice";
import userProgressReducer from "./slices/userprogressSlice";
import { pastChallengesReducer, weeklyChallengesReducer, normalChallengesReducer } from './slices/challengesSlice';
import {userchallengeprogressReducer} from "./slices/userchallengesprogressSlice";
import {globalLeaderboardReducer} from "./slices/challengesGlobalLeaderboardSlice"
import {challengesCalendarReducer} from "./slices/challengesSlice";
import codeReducer from './slices/codeSlice'
import { interviewexperienceReducer } from './slices/interviewExperienceSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    problems: problemsReducer,
    userProgress: userProgressReducer,
    weeklyChallenges: weeklyChallengesReducer,
    pastChallenges: pastChallengesReducer,
    userChallengesprogress: userchallengeprogressReducer,
    normalChallenges: normalChallengesReducer,
    globalLeaderboard: globalLeaderboardReducer,
    challengesCalendar: challengesCalendarReducer,
    code: codeReducer,
    interviewExperience: interviewexperienceReducer
    // Add other reducers here
  },
});