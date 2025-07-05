import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/MyContext";
import { FaHeart, FaUser, FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";

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
    <nav className="flex flex-wrap items-center justify-between px-6 py-4 shadow-md bg-white">
      
      <Link to="/" className="text-2xl font-bold text-black">
        SportsStore
      </Link>

      
      <div className="flex flex-1 justify-center gap-6 font-medium hidden md:flex text-black">
        <Link to="/" className="hover:text-red-500 transition">Home</Link>
        <Link to="/products" className="hover:text-red-500 transition">Products</Link>
        <Link to="/cart" className="hover:text-red-500 transition">Cart</Link>
      </div>

      <div className="hidden md:block mx-6 flex-1 max-w-sm">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-4 py-2 border rounded bg-gray-100 text-black placeholder-gray-600"
        />
      </div>

      
      <div className="flex items-center gap-4 text-black">
        {user ? (
          <>
            <span className="text-sm text-gray-700">Hi, {user.name}</span>
            <Link to="/wishlist" className="hover:text-red-500">
              <FaHeart size={20} />
            </Link>
            <Link to="/cart" className="hover:text-red-500">
              <FaShoppingCart size={20} />
            </Link>
            <Link to="/cart" className="hover:text-red-500">
              <FaUser size={20} />
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-black text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-red-500">Login</Link>
            <Link to="/signup" className="hover:text-red-500">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
