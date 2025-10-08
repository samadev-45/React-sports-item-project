// // src/context/AdminContext.jsx
// import { createContext, useState, useEffect } from "react";
// import api from "../services/api";
// import { toast } from "react-toastify";
// import Cookies from "js-cookie";

// export const AdminContext = createContext();

// export const AdminProvider = ({ children }) => {
//   const [admin, setAdmin] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Load admin from cookies on mount
//   useEffect(() => {
//     const savedAdmin = Cookies.get("admin");
//     if (savedAdmin) {
//       try {
//         setAdmin(JSON.parse(savedAdmin));
//       } catch (err) {
//         console.error("Invalid admin data in cookies", err);
//         Cookies.remove("admin");
//       }
//     }
//     setLoading(false);
//   }, []);

//   // ---------------- Admin login ----------------
//   const loginAdmin = async (email, password) => {
//     try {
//       const res = await api.post("/admin/login", { email, password });

//       if (res.data?.success) {
//         const adminData = res.data.data;

//         // Store in cookies
//         Cookies.set(
//           "admin",
//           JSON.stringify({
//             id: adminData.id,
//             email: adminData.email,
//             name: adminData.name,
//             token: adminData.token,
//             role: adminData.role,
//           })
//         );

//         setAdmin(adminData);
//         toast.success(res.data.message || "Admin login successful!");
//         return { success: true, data: adminData };
//       } else {
//         toast.error(res.data?.message || "Invalid credentials");
//         return { success: false };
//       }
//     } catch (err) {
//       console.error("Admin login error:", err);
//       toast.error(err.response?.data?.message || "Login failed");
//       return { success: false };
//     }
//   };

//   // ---------------- Admin logout ----------------
//   const logoutAdmin = async () => {
//     try {
//       await api.post("/admin/revoke", {}, { withCredentials: true });
//     } catch (err) {
//       console.error("Admin logout error:", err);
//     }
//     setAdmin(null);
//     Cookies.remove("admin");
//     toast.success("Logged out successfully!");
//   };

//   return (
//     <AdminContext.Provider value={{ admin, setAdmin, loginAdmin, logoutAdmin, loading }}>
//       {children}
//     </AdminContext.Provider>
//   );
// };

// export const useAdmin = () => {
//   return useState(AdminContext);
// };
