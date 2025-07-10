import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/MyContext";
import {
  FaHeart,
  FaUser,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaSearch,
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
  const [showSearch, setShowSearch] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

  const handleLogout = () => {
    logout();
    navigate("/login");
    
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
      setShowSearch(false);
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <nav className="bg-gray-900 text-white shadow-lg relative z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                className="md:hidden text-white focus:outline-none"
                onClick={toggleDrawer}
              >
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
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
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
                  <Link
                    to="/wishlist"
                    className="relative p-2 hover:text-red-400 transition-colors"
                  >
                    <FaHeart size={20} />
                    {wishlist.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/cart"
                    className="relative p-2 hover:text-red-400 transition-colors"
                  >
                    <FaShoppingCart size={20} />
                    {cart.reduce((acc, item) => acc + item.quantity, 0) > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                        {cart.reduce((acc, item) => acc + item.quantity, 0)}
                      </span>
                    )}
                  </Link>

                  {/* DROPDOWN - Click based */}
                  <div className="hidden md:block relative">
                    <button
                      onClick={() => setIsDropdownOpen((prev) => !prev)}
                      className="flex items-center space-x-1 focus:outline-none"
                    >
                      <span className="text-sm font-medium">
                        {user.name.split(" ")[0]}
                      </span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
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

                  {/* Mobile User Icon */}
                  <Link
                    to="/profile"
                    className="md:hidden p-2 hover:text-red-400 transition-colors"
                  >
                    <FaUser size={20} />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/cart"
                    className="relative p-2 hover:text-red-400 transition-colors"
                  >
                    <FaShoppingCart size={20} />
                    {cart.reduce((acc, item) => acc + item.quantity, 0) > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                        {cart.reduce((acc, item) => acc + item.quantity, 0)}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/login"
                    className="hidden md:inline-block px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="hidden md:inline-block px-4 py-2 text-sm font-medium text-red-600 bg-white rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {showSearch && (
            <div className="mt-3 md:hidden">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full py-2 px-4 pr-8 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleSearch}
                />
                <FaSearch
                  className="absolute right-3 top-2.5 text-gray-500"
                  size={16}
                />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div
            className="fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full p-4">
              <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  SportsStore
                </h2>
                <button
                  onClick={toggleDrawer}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="flex-1 flex flex-col space-y-4">
                {["/", "/products", "/orders"].map((path, index) => {
                  const labels = ["Home", "Products", "Orders"];
                  return (
                    <NavLink
                      key={path}
                      to={path}
                      onClick={toggleDrawer}
                      className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
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

                <div className="border-t border-gray-700 pt-4 mt-4">
                  {user ? (
                    <>
                      <div className="px-3 py-2 text-sm text-gray-400">
                        Welcome back, {user.name.split(" ")[0]}
                      </div>
                      <Link
                        to="/wishlist"
                        onClick={toggleDrawer}
                        className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-md"
                      >
                        <FaHeart className="mr-2" size={16} />
                        Wishlist
                        {wishlist.length > 0 && (
                          <span className="ml-auto bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                            {wishlist.length}
                          </span>
                        )}
                      </Link>
                      <Link
                        to="/cart"
                        onClick={toggleDrawer}
                        className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-md"
                      >
                        <FaShoppingCart className="mr-2" size={16} />
                        Cart
                        {cart.reduce((acc, item) => acc + item.quantity, 0) > 0 && (
                          <span className="ml-auto bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                            {cart.reduce((acc, item) => acc + item.quantity, 0)}
                          </span>
                        )}
                      </Link>
                      <Link
                        to="/profile"
                        onClick={toggleDrawer}
                        className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-md"
                      >
                        <FaUser className="mr-2" size={16} />
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          toggleDrawer();
                          handleLogout();
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-800 rounded-md mt-2"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={toggleDrawer}
                        className="block px-3 py-2 text-center text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 mb-2"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        onClick={toggleDrawer}
                        className="block px-3 py-2 text-center text-sm font-medium text-red-600 bg-white rounded-md hover:bg-gray-100"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
