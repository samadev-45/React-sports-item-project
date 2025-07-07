import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/MyContext";
import { FaHeart, FaUser, FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { wishlist } = useContext(WishlistContext);
  const { cart } = useContext(CartContext);

  const handleLogout = () => {
    logout();
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
            <Link to="/wishlist" className="relative hover:text-red-500">
              <FaHeart size={20} />
              {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
              {wishlist.length}
              </span>
              )}
              </Link>
            <Link to="/cart" className="relative hover:text-red-500">
            <FaShoppingCart size={20} />
            {cart.reduce((acc, item) => acc + item.quantity, 0) > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
            {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
            )}
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