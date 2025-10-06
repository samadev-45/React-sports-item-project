import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/MyContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { FaHeart, FaUser, FaShoppingCart, FaBars } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => logout();
  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  // Total quantity in cart
  const totalCartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <nav className="bg-gray-900 text-white shadow-lg relative z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button className="md:hidden" onClick={toggleDrawer}>
              <FaBars size={24} />
            </button>
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent"
            >
              SportsStore
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {["/", "/products", "/orders"].map((path, index) => {
              const labels = ["Home", "Products", "Orders"];
              return (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? "bg-red-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  {labels[index]}
                </NavLink>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Wishlist Icon */}
                <Link to="/wishlist" className="relative p-2 hover:text-red-400">
                  <FaHeart size={20} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                {/* Cart Icon */}
                <Link to="/cart" className="relative p-2 hover:text-red-400">
                  <FaShoppingCart size={20} />
                  {totalCartQuantity > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                      {totalCartQuantity}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="flex items-center space-x-1 focus:outline-none"
                  >
                    <span className="text-sm font-medium">{user.name.split(" ")[0]}</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/cart" className="relative p-2 hover:text-red-400">
                  <FaShoppingCart size={20} />
                  {totalCartQuantity > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                      {totalCartQuantity}
                    </span>
                  )}
                </Link>
                <Link
                  to="/login"
                  className="hidden md:inline-block px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="hidden md:inline-block px-4 py-2 text-sm font-medium text-red-600 bg-white rounded-md hover:bg-gray-100"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div
            className="fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer content (links and icons) */}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
