import { createContext, useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  //  auto log
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      api.get(`/users/${userId}`)
        .then(res => setUser(res.data))
        .catch(err => {
          console.error("Failed to fetch user", err);
          localStorage.removeItem("userId");
        });
    }
  }, []);

  //  Save only userId in localStorage
  const login = async (email, password) => {
    try {
      const res = await api.get(`/users?email=${email}&password=${password}`);
      if (res.data.length > 0) {
        const userData = res.data[0];
        if(userData.isBlock) throw new Error("user is blocked");
        
        setUser(userData);
        localStorage.setItem("userId", userData.id);
        toast.success("Login successful!");
        return true;
      } else {
        toast.error("Invalid credentials!");
        return false;
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed. Please try again.");
      return false;
    }
  };

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
