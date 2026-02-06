// API Configuration - Centralized API URL management
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    BASE: `${API_BASE_URL}/api/auth`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    OTP_REQUEST: `${API_BASE_URL}/api/auth/login/otp/request`,
    OTP_VERIFY: `${API_BASE_URL}/api/auth/login/otp/verify`,
    GOOGLE_LOGIN: `${API_BASE_URL}/api/auth/google/login`,
  },
  
  // Problems endpoints
  PROBLEMS: {
    BASE: `${API_BASE_URL}/api/problems`,
    BY_ID: (id) => `${API_BASE_URL}/api/problems/${id}`,
    USER_PROGRESS: `${API_BASE_URL}/api/problems/user-progress`,
    SUBMISSIONS_MY: (problemId) => `${API_BASE_URL}/api/problems/submissions/my?problem_id=${problemId}`,
    RUN: `${API_BASE_URL}/api/problems/run`,
  },
  
  // Weekly challenges endpoints
  CHALLENGES: {
    WEEKLY: `${API_BASE_URL}/api/weekly-challenges/weekly`,
    PAST: (skip, limit) => `${API_BASE_URL}/api/weekly-challenges/past?skip=${skip}&limit=${limit}`,
    NORMAL: `${API_BASE_URL}/api/weekly-challenges/normal`,
    CALENDAR: `${API_BASE_URL}/api/weekly-challenges/calendar`,
    BY_ID: (id) => `${API_BASE_URL}/api/weekly-challenges/${id}`,
    LEADERBOARD_BY_ID: (id, skip = 0) => `${API_BASE_URL}/api/weekly-challenges/${id}/leaderboard?skip=${skip}`,
    GLOBAL_LEADERBOARD: (limit = 100) => `${API_BASE_URL}/api/weekly-challenges/leaderboard?limit=${limit}`,
    MY_PROGRESS: `${API_BASE_URL}/api/weekly-challenges/my/progress`,
  },
  
  // Solutions endpoints
  SOLUTIONS: {
    BY_PROBLEM_ID: (problemId) => `${API_BASE_URL}/api/solutions/problem/${problemId}`,
    VOTE: (solutionId) => `${API_BASE_URL}/api/solutions/${solutionId}/vote`,
  },
  
  // Interview experiences endpoints
  INTERVIEW: {
    BASE: `${API_BASE_URL}/api/interview-experiences`,
    BY_ID: (id) => `${API_BASE_URL}/api/interview-experiences/${id}`,
  },
  
  // Codes endpoints
  CODES: {
    BY_ID: (id) => `${API_BASE_URL}/api/codes/${id}`,
  },
};

export default API_BASE_URL;
