import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "https://localhost:7056/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // send cookies automatically
});

// --------------------
// Request interceptor
// --------------------
api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(Cookies.get("user"));
    console.log("➡️ API Request:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });

    console.log(token);
    
    if (token) {
        config.headers.Authorization = `Bearer ${token?.token}`;
    }
   
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

// --------------------
// Response interceptor automatic token refresh logic
// --------------------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    console.log(" API Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.error("❌ API Response Error:", {
      url: originalRequest?.url,
      status: error.response?.status,
      data: error.response?.data,
    });

    // 401 handling with refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        console.log(" Refreshing token...");
        await api.post("/Auth/refresh", {}, { withCredentials: true });
        console.log("✅ Token refreshed");

        processQueue(null); // retry queued requests
        return api(originalRequest);
      } catch (err) {
        console.error("❌ Token refresh failed:", err.response || err);
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
