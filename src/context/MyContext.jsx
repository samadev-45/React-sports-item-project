import { createContext, useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Load user on mount
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      api.get(`/users/${userId}`)
        .then((res) => {
          const userData = res.data;
          if (userData.isBlock) {
            // ✅ Immediately block access
            toast.error("You are blocked by admin");
            localStorage.removeItem("userId");
            setUser(null);
          } else {
            setUser(userData);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch user", err);
          localStorage.removeItem("userId");
        });
    }
  }, []);

  // ✅ Login
  const login = async (email, password) => {
  try {
    const res = await api.get(`/users?email=${email}&password=${password}`);
    if (res.data.length > 0) {
      const userData = res.data[0];

      if (userData.isBlock) {
        toast.error("You are blocked by admin");
        localStorage.removeItem("userId");
        setUser(null);
        return { success: false, blocked: true };
      }

      setUser(userData);
      localStorage.setItem("userId", userData.id);
      toast.success("Login successful!");
      return { success: true };
    } else {
      toast.error("Invalid credentials!");
      return { success: false };
    }
  } catch (err) {
    console.error(err);
    toast.error("Login failed. Please try again.");
    return { success: false };
  }
};


  // ✅ Register
  const register = async (newUser) => {
    try {
      const res = await api.get(`/users?email=${newUser.email}`);
      if (res.data.length > 0) {
        toast.warning("Email already exists!");
        return false;
      }

      const userData = {
        ...newUser,
        role: "user",
        isBlock: false,
        cart: [],
        wishlist: [],
        orders: [],
      };

      const postRes = await api.post("/users", userData);
      setUser(postRes.data);
      localStorage.setItem("userId", postRes.data.id);
      toast.success("Signup successful!");
      return true;
    } catch (err) {
      toast.error("Signup failed. Please try again.");
      return false;
    }
  };

  // ✅ Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userId");
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
