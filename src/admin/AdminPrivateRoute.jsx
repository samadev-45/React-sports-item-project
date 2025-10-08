import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/MyContext";

const AdminPrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

   if (user === undefined) return null; // or a loader

  // check if logged in and role is admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminPrivateRoute;
