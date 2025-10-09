import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Menu, X } from "lucide-react";
import { AuthContext } from "../context/MyContext";
import {
  AiOutlineDashboard,
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineOrderedList,
} from "react-icons/ai";

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleLogout = () => logout();

  const navLinks = [
    {
      to: "/admin/dashboard",
      icon: <AiOutlineDashboard size={20} />,
      label: "Dashboard",
    },
    { to: "/admin/users", icon: <AiOutlineUser size={20} />, label: "Users" },
    {
      to: "/admin/products",
      icon: <AiOutlineShoppingCart size={20} />,
      label: "Products",
    },
    {
      to: "/admin/orders",
      icon: <AiOutlineOrderedList size={20} />,
      label: "Orders",
    },
  ];

  const renderNavLink = ({ to, icon, label }) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        `flex items-center p-3 rounded-lg transition-all ${
          isActive
            ? "bg-red-600 text-white font-semibold shadow-md"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`
      }
    >
      <span className="mr-3">{icon}</span> {label}
    </NavLink>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden bg-gray-900 text-white flex items-center justify-between p-4 shadow-md">
        <h2 className="text-xl font-bold tracking-wide">Sporty Admin</h2>
        <button
          className="focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Slide-in Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity">
          <div className="absolute left-0 top-0 w-64 bg-gray-900 h-full p-6 space-y-4 shadow-lg transform transition-transform duration-300">
            {navLinks.map(renderNavLink)}
            <button
              onClick={logout}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg mt-4"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl p-6 flex-col">
        <div className="flex items-center mb-10">
          <div className="bg-red-500 p-3 rounded-lg mr-3 shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2v0a2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 15v7h4v-7a2 2 0 00-2-2H6a2 2 0 00-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Sporty Admin
          </h2>
        </div>

        <nav className="flex-1 space-y-3">{navLinks.map(renderNavLink)}</nav>

        <div className="mt-auto pt-6 border-t border-gray-700">
          <div className="flex items-center mb-4">
            <div className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-3 shadow">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div>
              <p className="text-white font-semibold">
                {user?.name || "Admin"}
              </p>
              <p className="text-gray-400 text-sm">Administrator</p>
            </div>
          </div>
          <button
            onClick={() => {
              handleLogout();
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back,{" "}
              <span className="text-red-600">{user?.name || "Admin"}</span>
            </h1>
            <div className="text-sm text-gray-500 font-medium">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
