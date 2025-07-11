import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true); //  add this for checking admin is login or not

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");
    if (adminId) {
      api
        .get(`/users/${adminId}`)
        .then((res) => setAdmin(res.data))
        .catch((err) => {
          console.error("Failed to fetch admin by ID", err);
          localStorage.removeItem("adminId");
        })
        .finally(() => setLoading(false)); //  finish loading
    } else {
      setLoading(false); //  no admin stored
    }
  }, []);

  const loginAdmin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem("adminId", adminData.id);
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem("adminId");
  };

  return (
    <AdminContext.Provider value={{ admin, loginAdmin, logoutAdmin, setAdmin, loading }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
