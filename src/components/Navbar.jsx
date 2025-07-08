import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/MyContext";
import {
  FaHeart,
  FaUser,
  FaShoppingCart,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { wishlist } = useContext(WishlistContext);
  const { cart } = useContext(CartContext);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <nav className="flex justify-between items-center px-4 py-3 shadow-md bg-white relative z-10">
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={toggleDrawer}>
            <FaBars size={24} />
          </button>
          <Link to="/" className="text-2xl font-bold text-black">
            SportsStore
          </Link>
        </div>

        <div className="hidden md:flex flex-1 justify-center gap-6 font-medium text-black">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-red-500 font-semibold transition"
                : "hover:text-red-500 transition"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? "text-red-500 font-semibold transition"
                : "hover:text-red-500 transition"
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              isActive
                ? "text-red-500 font-semibold transition"
                : "hover:text-red-500 transition"
            }
          >
            Orders
          </NavLink>
        </div>

        <div className="flex items-center gap-3 text-black">
          {user ? (
            <>
              <span className="hidden md:inline">Hi {user.name}</span>
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
              <Link to="/cart" className="relative hover:text-red-500">
                <FaShoppingCart size={25} />
                {cart.reduce((acc, item) => acc + item.quantity, 0) > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </Link>
              <Link to="/login" className="hover:text-red-500 text-sm">
                Login
              </Link>
              <Link to="/signup" className="hover:text-red-500 text-sm">
                Signup
              </Link>
            </>
          )}
        </div>
      </nav>

      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={toggleDrawer}
        >
          <div
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-md z-50 p-5 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Menu</h2>
              <button onClick={toggleDrawer}>
                <FaTimes size={20} />
              </button>
            </div>

            <Link to="/" onClick={toggleDrawer} className="hover:text-red-500">
              Home
            </Link>
            <Link
              to="/products"
              onClick={toggleDrawer}
              className="hover:text-red-500"
            >
              Products
            </Link>
            <Link
              to="/orders"
              onClick={toggleDrawer}
              className="hover:text-red-500"
            >
              Orders
            </Link>

            <hr />

            {user ? (
              <>
                <p className="text-sm">Hi {user.name}</p>
                <Link
                  to="/wishlist"
                  onClick={toggleDrawer}
                  className="hover:text-red-500"
                >
                  Wishlist
                </Link>
                <Link
                  to="/cart"
                  onClick={toggleDrawer}
                  className="hover:text-red-500"
                >
                  Cart
                </Link>
                <Link
                  to="/profile"
                  onClick={toggleDrawer}
                  className="hover:text-red-500"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    toggleDrawer();
                    handleLogout();
                  }}
                  className="text-left text-sm mt-2 text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={toggleDrawer}
                  className="hover:text-red-500"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={toggleDrawer}
                  className="hover:text-red-500"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
