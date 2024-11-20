import axios from "axios";
import localStorage from "@react-native-async-storage/async-storage";
import {
  STORAGE_ACCESS_TOKEN_KEY,
  STORAGE_REFRESH_TOKEN_KEY,
} from "@/constants/storageKeys";
import { logout } from "@/utils/auth";

const api = axios.create({
  baseURL: "http://192.168.1.2:3000",
});

api.interceptors.request.use(
  async (config) => {
    const token = await localStorage.getItem(STORAGE_ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors and refresh the token
api.interceptors.response.use(
  (response) => response, // Pass through if the response is successful

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite loops
      try {
        const refreshToken = await localStorage.getItem(
          STORAGE_REFRESH_TOKEN_KEY
        );
        const { data } = await api.post("/token", {
          refreshToken,
        });
        await localStorage.setItem(STORAGE_ACCESS_TOKEN_KEY, data.accessToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (e.g., log out the user)
        await logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
