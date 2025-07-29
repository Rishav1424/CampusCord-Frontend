import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    toast.error("Request setup failed");
    return Promise.reject(error);
  }
);

// ⚠️ Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "Something went wrong";

    // Show error toast
    toast.error(message);

    // Auto-logout on 401
    if (status === 401) {
      localStorage.removeItem("token");
      toast.warning("Session expired. Please log in again.");
      setTimeout(() => {
        window.location.href = "/auth";
      }, 1500);
    }

    return Promise.reject(error);
  }
);

export default api;
