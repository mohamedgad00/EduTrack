import axios from "axios";
import Cookies from "js-cookie";

const ACCESS_TOKEN_COOKIE = "token";
const ADMIN_SESSION_COOKIE = "admin_auth";
const REFRESH_ENDPOINT = "/auth/refresh";

type RefreshResponse = {
  success?: boolean;
  message?: string;
  data?: {
    accessToken?: string;
  };
};

function clearAuthCookies() {
  Cookies.remove(ACCESS_TOKEN_COOKIE, { path: "/" });
  Cookies.remove(ADMIN_SESSION_COOKIE, { path: "/" });
}

const refreshClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000, // 10 seconds
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(ACCESS_TOKEN_COOKIE);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse =
          await refreshClient.post<RefreshResponse>(REFRESH_ENDPOINT);
        const nextAccessToken = refreshResponse.data?.data?.accessToken;

        if (!nextAccessToken) {
          throw new Error("Refresh response did not include an access token.");
        }

        Cookies.set(ACCESS_TOKEN_COOKIE, nextAccessToken, {
          expires: 7,
          path: "/",
        });

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;

        return api.request(originalRequest);
      } catch (refreshError) {
        clearAuthCookies();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
