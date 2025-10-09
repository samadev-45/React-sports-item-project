// src/context/MyContext.jsx
// import { createContext, useState,useEffect } from "react";
// import api from "../services/api";
// import { toast } from "react-toastify";
// import Cookies from "js-cookie";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(undefined);
//     useEffect(() => {
//     const savedUser = Cookies.get("user");
//     if (savedUser) {
//       try {
//         setUser(JSON.parse(savedUser));
//       } catch (error) {
//         console.error("Invalid user data in cookies", error);
//         Cookies.remove("user");
//       }
//     }
//   }, []);
//   // ---------------- Login ----------------
//   const login = async (email, password) => {
//     try {
//       const res = await api.post(
//         "/Auth/login",
//         { email, password }
//         // important: send cookies automatically
//       );

//       if (res.data?.success) {
//         const userData = res.data.data;
//         console.log(userData);

//         // Set user in context (no need to manually store tokens)

//         Cookies.set(
//           "user",
//           JSON.stringify({
//             userId: userData.userId,
//             email: userData.email,
//             role: userData.role,
//             name: userData.name,
//             token: userData.token
//           })
//         );
//         setUser(userData);
//         // toast.success(res.data.message || "Login successful!");
//         return { success: true, data: userData };
//       } else {
//         toast.error(res.data?.message || "Invalid credentials");
//         return { success: false };
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       toast.error(err.response?.data?.message || "Login failed");
//       return { success: false };
//     }
//   };
// //   const login = async (email, password) => {
// //   const existingUser = Cookies.get("user");

// //   if (existingUser) {
// //     const parsedUser = JSON.parse(existingUser);
// //     // If the email is different, block login
// //     if (parsedUser.email.toLowerCase() !== email.toLowerCase()) {
// //       toast.error("Another user is already logged in. Please logout first.");
// //       return { success: false };
// //     }
// //   }

// //   try {
// //     const res = await api.post("/Auth/login", { email, password });

// //     if (res.data?.success) {
// //       const userData = res.data.data;

// //       Cookies.set(
// //         "user",
// //         JSON.stringify({
// //           userId: userData.userId,
// //           email: userData.email,
// //           role: userData.role,
// //           name: userData.name,
// //           token: userData.token,
// //         })
// //       );
// //       setUser(userData);
// //       return { success: true, data: userData };
// //     } else {
// //       toast.error(res.data?.message || "Invalid credentials");
// //       return { success: false };
// //     }
// //   } catch (err) {
// //     console.error("Login error:", err);
// //     toast.error(err.response?.data?.message || "Login failed");
// //     return { success: false };
// //   }
// // };


//   // ---------------- Logout ----------------
//   const logout = async () => {
//     try {
//       await api.post("/Auth/revoke", {}, { withCredentials: true });
//     } catch (err) {
//       console.error("Logout error:", err);
//     }
//     Cookies.remove("user");
    

//     setUser(null);
//     toast.success("Logged out successfully!");
//   };

//   // ---------------- Register ----------------
// const register = async (values) => {
//   try {
//     const res = await api.post("/Auth/register", values, {
//       withCredentials: true,
//     });

//     // ✅ Success: 200 OK
//     if (res.status === 200 && res.data?.success) {
//       return {
//         success: true,
//         message: res.data?.message || "Signup successful!",
//       };
//     }

//     return {
//       success: false,
//       message: res.data?.message || "Registration failed",
//     };
//   } catch (err) {
//     console.error("Register error:", err);

//     // ✅ Check for duplicate email (409 Conflict)
//     if (err.response?.status === 409) {
//       return {
//         exists: true,
//         message: err.response?.data?.message || "Email already exists",
//       };
//     }

//     return {
//       success: false,
//       message: err.response?.data?.message || "Something went wrong",
//     };
//   }
// };


//   return (
//     <AuthContext.Provider value={{ user, setUser, login, logout, register }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// src/context/MyContext.jsx
import { createContext, useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);

  // ---------------- Load user on app start ----------------
  useEffect(() => {
    const savedUser = Cookies.get("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);

        if (parsedUser.role === "Admin") {
          // Remove admin from cookies and context on app restart
          Cookies.remove("user");
          setUser(null);
        } else {
          // Keep normal user session
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Invalid user data in cookies", error);
        Cookies.remove("user");
        setUser(null);
      }
    }
  }, []);

  // ---------------- Login ----------------
  const login = async (email, password) => {
    try {
      const res = await api.post("/Auth/login", { email, password });

      if (res.data?.success) {
        const userData = res.data.data;

        // Save user in cookies only for non-admin users
        Cookies.set(
          "user",
          JSON.stringify({
            userId: userData.userId,
            email: userData.email,
            role: userData.role,
            name: userData.name,
            token: userData.token,
          })
        );

        setUser(userData);
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
      await api.post("/Auth/revoke", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    }

    Cookies.remove("user");
    setUser(null);
    
    toast.success("Logged out successfully!");
  };

  // ---------------- Register ----------------
  const register = async (values) => {
    try {
      const res = await api.post("/Auth/register", values, {
        withCredentials: true,
      });

      if (res.status === 200 && res.data?.success) {
        return {
          success: true,
          message: res.data?.message || "Signup successful!",
        };
      }

      return {
        success: false,
        message: res.data?.message || "Registration failed",
      };
    } catch (err) {
      console.error("Register error:", err);
      if (err.response?.status === 409) {
        return {
          exists: true,
          message: err.response?.data?.message || "Email already exists",
        };
      }
      return {
        success: false,
        message: err.response?.data?.message || "Something went wrong",
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

