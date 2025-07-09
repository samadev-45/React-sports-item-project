import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { toast } from "react-toastify";

const AdminLayout = () => {
  const { admin, setAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAdmin(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      <aside className="w-64 bg-white shadow-md p-5">
        <h2 className="text-xl font-bold text-red-600 mb-8"> Sporty Admin</h2>
        <nav className="block space-y-4">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive
                ? "text-red-600 font-semibold"
                : "text-gray-700 hover:text-red-600"
            }
          >
             Dashboard
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive
                ? "text-red-600 font-semibold"
                : "text-gray-700 hover:text-red-600"
            }
          >
             Users
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              isActive
                ? "text-red-600 font-semibold"
                : "text-gray-700 hover:text-red-600"
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              isActive
                ? "text-red-600 font-semibold"
                : "text-gray-700 hover:text-red-600"
            }
          >
             Orders
          </NavLink>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 text-white bg-black hover:bg-red-700 px-4 py-2 rounded w-full"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">
          Hello, {admin?.name || "Admin"} 
        </h1>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
