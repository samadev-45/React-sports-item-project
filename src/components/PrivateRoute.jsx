import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/MyContext";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;
  if (user.isBlock) {
    toast.error("You are blocked by admin");
    localStorage.removeItem("userId");
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
