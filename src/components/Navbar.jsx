import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/MyContext";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-md bg-white">
      
      <Link to="/" className="text-2xl font-bold text-red-600">
        SportsStore
      </Link>

    
      <ul className="flex gap-6 font-medium">
        <Link to="/" className="hover:text-red-500">Home</Link>
        <Link to="/products" className="hover:text-red-500">Products</Link>
        <Link to="/cart" className="hover:text-red-500">Cart</Link>
      </ul>

     
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Hi, {user.name}</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link to="/login" className="text-gray-700 hover:text-red-500">Login</Link>
          <Link to="/signup" className="text-gray-700 hover:text-red-500">Signup</Link>
        </div>
      )}
    </nav>
  );
};
export default Navbar
 