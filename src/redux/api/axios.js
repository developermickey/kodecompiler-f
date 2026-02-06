// src/utils/apiClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ Applied globally
});

// Optional: Add interceptors for global error handling (e.g., 401 redirects)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject({ ...error, message }); // Standardized error object
  }
);

export default apiClient;
