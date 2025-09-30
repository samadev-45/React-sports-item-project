// src/context/MyContext.jsx
import { createContext, useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(Cookies.get("accessToken") || null);

  // Attach token whenever it changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // ---------------- Signup ----------------
  const register = async (values) => {
    try {
      const res = await api.post("/Auth/register", values, { withCredentials: true });

      if (res.status === 200 && res.data?.success) {
        return { success: true, message: res.data?.message || "Signup successful!" };
      }

      return { success: false, exists: res.data?.message?.includes("exists") || false, message: res.data?.message || "Registration failed" };
    } catch (err) {
      console.error("Register error:", err);
      return { success: false, message: err.response?.data?.message || "Something went wrong" };
    }
  };

  // ---------------- Login ----------------
  const login = async (email, password) => {
    try {
      // withCredentials ensures backend sets HttpOnly cookies
      const res = await api.post("/Auth/login", { email, password }, { withCredentials: true });

      if (res.data?.success) {
        const userData = res.data.data;

        // Optionally store access token in cookie (non-HttpOnly, for frontend use)
        Cookies.set("accessToken", userData.token, { expires: 1, secure: true, sameSite: "strict" });
        Cookies.set("refreshToken", userData.refreshToken, { expires: 7, secure: true, sameSite: "strict" });

        setToken(userData.token);
        setUser({
          userId: userData.userId,
          email: userData.email,
          role: userData.role,
          name: userData.name,
        });

        toast.success(res.data.message || "Login successful!");
        return { success: true, data: userData };
      } else {
        toast.error(res.data?.message || "Invalid credentials");
        return { success: false };
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Login failed");
      return { success: false };
    }
  };

  // ---------------- Logout ----------------
  const logout = async () => {
    try {
      // Revoke refresh token on backend
      await api.post("/Auth/revoke", { refreshToken: Cookies.get("refreshToken") }, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    }

    setUser(null);
    setToken(null);

    // Remove cookies
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
