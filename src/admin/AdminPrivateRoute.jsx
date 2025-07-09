import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

const AdminPrivateRoute = ({ children }) => {
  const { admin } = useAdmin();

  return admin ? children : <Navigate to="/login" />;
};

export default AdminPrivateRoute;
