import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "../context/MyContext";

const AdminLayout = () => {
  const { admin, setAdmin } = useAdmin();
  const navigate = useNavigate();
  
  const logout = () => {
    setAdmin(null);
    navigate("/login")
    localStorage.removeItem("adminId");
    toast.success("Logged out successfully!");
  }; 

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl p-5 flex flex-col">
        <div className="flex items-center mb-8">
          <div className="bg-red-500 p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2v0a2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 15v7h4v-7a2 2 0 00-2-2H6a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Sporty Admin</h2>
        </div>
        
        <nav className="flex-1 space-y-3">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-all ${isActive
                ? "bg-red-600 text-white font-semibold"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard
          </NavLink>
          
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-all ${isActive
                ? "bg-red-600 text-white font-semibold"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Users
          </NavLink>
          
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-all ${isActive
                ? "bg-red-600 text-white font-semibold"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Products
          </NavLink>
          
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-all ${isActive
                ? "bg-red-600 text-white font-semibold"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Orders
          </NavLink>
        </nav>

            {/* admin section  */}
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
            className="flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, <span className="text-red-600">{admin?.name || "Admin"}</span>
            </h1>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;