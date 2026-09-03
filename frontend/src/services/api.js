import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",

  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jobtrack_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (!error.response) {
      console.error("Network Error:", error.message);

      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      localStorage.removeItem("jobtrack_token");

      const path = window.location.pathname;

      if (path !== "/login" && path !== "/register") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
