import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api"; // required to fetch admin by ID

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  // ✅ On initial mount, load admin by ID
  useEffect(() => {
    const adminId = localStorage.getItem("adminId");
    if (adminId) {
      api
        .get(`/users/${adminId}`)
        .then((res) => {
          setAdmin(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch admin by ID", err);
        });
    }
  }, []);

  // ✅ Login admin and store ID only
  const loginAdmin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem("adminId", adminData.id); // only store ID
  };

  // ✅ Logout logic
  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem("adminId");
  };

  return (
    <AdminContext.Provider value={{ admin, loginAdmin, logoutAdmin,setAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
