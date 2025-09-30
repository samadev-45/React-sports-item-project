// src/context/MyContext.jsx
import { createContext, useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Set Authorization header whenever token changes
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
    const res = await api.post("/Auth/register", values);

    // Assuming backend now returns proper status & message
    if (res.status === 200 && res.data?.success) {
      return {
        success: true,
        message: res.data?.message || "Signup successful!",
      };
    }

    // Backend can send 400 for existing email
    return {
      success: false,
      exists: res.data?.message?.includes("exists") || false,
      message: res.data?.message || "Registration failed",
    };
  } catch (err) {
    console.error("Register error:", err);
    return {
      success: false,
      message: err.response?.data?.message || "Something went wrong",
    };
  }
};


  // ---------------- Login ----------------
  const login = async (email, password) => {
    try {
      const res = await api.post("/Auth/login", { email, password });
      if (res.data?.data?.token) {
        const jwtToken = res.data.data.token;
        setToken(jwtToken);
        localStorage.setItem("token", jwtToken);
        toast.success(res.data.message || "Login successful!");
        return true;
      } else {
        toast.error(res.data?.message || "Invalid credentials");
        return false;
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
      return false;
    }
  };

  // ---------------- Logout ----------------
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
