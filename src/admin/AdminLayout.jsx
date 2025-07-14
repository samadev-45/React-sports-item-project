import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { toast } from "react-toastify";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const AdminLayout = () => {
  const { admin, setAdmin } = useAdmin();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("adminId");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const navLinks = (
    <>
      <NavLink
        to="/admin/dashboard"
        className={({ isActive }) =>
          `flex items-center p-3 rounded-lg transition-all ${isActive
            ? "bg-red-600 text-white font-semibold"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
        }
      >
        🧭 Dashboard
      </NavLink>

      <NavLink
        to="/admin/users"
        className={({ isActive }) =>
          `flex items-center p-3 rounded-lg transition-all ${isActive
            ? "bg-red-600 text-white font-semibold"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
        }
      >
        👤 Users
      </NavLink>

      <NavLink
        to="/admin/products"
        className={({ isActive }) =>
          `flex items-center p-3 rounded-lg transition-all ${isActive
            ? "bg-red-600 text-white font-semibold"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
        }
      >
        📦 Products
      </NavLink>

      <NavLink
        to="/admin/orders"
        className={({ isActive }) =>
          `flex items-center p-3 rounded-lg transition-all ${isActive
            ? "bg-red-600 text-white font-semibold"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
        }
      >
        📑 Orders
      </NavLink>
    </>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-gray-900 text-white flex items-center justify-between p-4 shadow-md">
        <h2 className="text-xl font-bold">Sporty Admin</h2>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 text-white p-4 space-y-2">
          {navLinks}
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg mt-2"
          >
            🚪 Logout
          </button>
        </div>
      )}

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl p-5 flex-col">
        <div className="flex items-center mb-8">
          <div className="bg-red-500 p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2v0a2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 15v7h4v-7a2 2 0 00-2-2H6a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Sporty Admin</h2>
        </div>

        <nav className="flex-1 space-y-3">{navLinks}</nav>

        <div className="mt-auto pt-4 border-t border-gray-700">
          <div className="flex items-center mb-4">
            <div className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-3">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-white font-medium">{admin?.name || "Admin"}</p>
              <p className="text-gray-400 text-sm">Administrator</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, <span className="text-red-600">{admin?.name || "Admin"}</span>
            </h1>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
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
