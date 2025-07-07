import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/MyContext";
import { FaHeart, FaUser, FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/login");
  };
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className="flex flex-wrap items-center justify-between px-4 py-3 shadow-md bg-white">
      <Link to="/" className="text-2xl font-bold text-black">
        SportsStore
      </Link>

      <div className="hidden md:flex flex-1 justify-center gap-6 font-medium text-black">
        <Link to="/" className="hover:text-red-500 transition">Home</Link>
        <Link to="/products" className="hover:text-red-500 transition">Products</Link>
        <Link to="/cart" className="hover:text-red-500 transition">Cart</Link>
      </div>

      <div className="hidden md:block mx-4 w-full max-w-xs">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Search"
          className="w-full px-4 py-2 border rounded-md bg-gray-100 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
      </div>

      <div className="flex items-center gap-3 text-black">
        {user ? (
          <>
            <span className="hidden sm:block text-sm text-gray-700">Hi, {user.name}</span>
            <Link to="/wishlist" className="hover:text-red-500">
              <FaHeart size={20} />
            </Link>
            <Link to="/cart" className="hover:text-red-500">
              <FaShoppingCart size={20} />
            </Link>
            <Link to="/profile" className="hover:text-red-500">
              <FaUser size={20} />
            </Link>
            <button
              onClick={handleLogout}
              className="px-2 py-1 bg-black text-white text-sm rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-red-500 text-sm">Login</Link>
            <Link to="/signup" className="hover:text-red-500 text-sm">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
