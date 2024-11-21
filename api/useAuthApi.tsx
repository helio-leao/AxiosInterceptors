import axios from "axios";
import { useSession } from "@/contexts/session";

export default function useAuthApi() {
  const { session, signIn, signOut } = useSession();

  const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
  });

  api.interceptors.request.use(
    async (config) => {
      const accessToken = session?.accessToken;

      if (accessToken && !config._retry) {
        config.headers.Authorization = `Bearer ${accessToken}`;
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
      const refreshToken = session?.refreshToken;

      if (
        error.response?.status !== 401 ||
        originalRequest._retry ||
        !refreshToken
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true; // Prevent infinite loops

      try {
        const { data } = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/token`,
          {
            refreshToken,
          }
        );
        signIn(data.accessToken, refreshToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        await signOut();
        return Promise.reject(refreshError);
      }
    }
  );

  return api;
}
