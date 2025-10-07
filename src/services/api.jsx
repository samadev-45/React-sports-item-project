import axios from "axios";
import Cookies from "js-cookie";

// --------------------
// Axios instance
// --------------------
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
    const userCookie = Cookies.get("user");
    let token = null;

    if (userCookie) {
      try {
        token = JSON.parse(userCookie);
      } catch (err) {
        console.error("❌ Failed to parse user cookie:", err);
        Cookies.remove("user"); // clear invalid cookie
      }
    }

    if (token?.token) {
      config.headers.Authorization = `Bearer ${token.token}`;
    }

    console.log("➡️ API Request:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });

    return config;
  },
  (error) => Promise.reject(error)
);

// --------------------
// Response interceptor with auto-refresh
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
    // Optional: log all responses
    console.log("✅ API Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        console.log("🔄 Refreshing token...");
        // Use axios directly to avoid interceptor recursion
        const refreshRes = await axios.post(
          "https://localhost:7056/api/Auth/refresh",
          {},
          { withCredentials: true }
        );

        const data = refreshRes.data?.data;
        if (!data?.accessToken) throw new Error("No access token in refresh response");

        // Save new token
        const userCookie = Cookies.get("user");
        let userData = userCookie ? JSON.parse(userCookie) : {};
        userData.token = data.accessToken;

        Cookies.set("user", JSON.stringify(userData));
        api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        processQueue(null, data.accessToken);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        Cookies.remove("user");
        Cookies.remove("accessToken");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
