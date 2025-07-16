import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

let debounceTimeout;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchOrders = async () => {
    try {
      const res = await api.get("/users");
      const allUsers = res.data;

      const allOrders = allUsers.flatMap((user) =>
        (user.orders || []).map((order) => ({
          ...order,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
        }))
      );

      const sortedOrders = allOrders.sort(
        (a, b) => new Date(b.time) - new Date(a.time)
      );
      setOrders(sortedOrders);
    } catch (err) {
      console.error("Fetch Error:", err.message);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(debounceTimeout);
  }, [search]);

  const markAsDelivered = async (orderId, userId) => {
    try {
      const res = await api.get(`/users/${userId}`);
      const user = res.data;

      const updatedOrders = user.orders.map((order) =>
        order.id === orderId ? { ...order, status: "Delivered" } : order
      );

      await api.patch(`/users/${userId}`, { orders: updatedOrders });
      toast.success("Order marked as delivered");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update order");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      order.userName.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">All Orders</h2>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Order ID or User Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/4"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {filteredOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border rounded-lg p-4 shadow-sm"
            >
              <div className="text-red-600 font-bold text-sm mb-2">
                Order ID: {order.id}
              </div>
              <p className="text-sm"><strong>User:</strong> {order.userName}</p>
              <p className="text-xs text-gray-500">{order.userEmail}</p>
              <p className="text-sm"><strong>Address:</strong> {order.address}</p>
              <p className="text-sm"><strong>Time:</strong> {order.time}</p>
              <p className="text-sm">
                <strong>Status:</strong>{" "}
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
                </span>
              </p>
              <div className="mt-2">
                {order.items.map((item) => (
                  <div key={item.id} className="text-xs mb-1">
                    {item.name} - ₹{item.price} × {item.quantity}
                  </div>
                ))}
              </div>
              {order.status !== "Delivered" && (
                <button
                  onClick={() => markAsDelivered(order.id, order.userId)}
                  className="mt-3 bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700"
                >
                  Mark Delivered
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        {filteredOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="min-w-full text-xs sm:text-sm text-left border border-gray-200 rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <tr>
                <th className="px-4 py-3 border">Order ID</th>
                <th className="px-4 py-3 border">User</th>
                <th className="px-4 py-3 border">Items</th>
                <th className="px-4 py-3 border">Address</th>
                <th className="px-4 py-3 border">Time</th>
                <th className="px-4 py-3 border">Status</th>
                <th className="px-4 py-3 border">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 border font-mono text-xs text-gray-600">
                    {order.id}
                  </td>
                  <td className="px-4 py-3 border">
                    <div className="font-medium text-gray-800">
                      {order.userName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.userEmail}
                    </div>
                  </td>
                  <td className="px-4 py-3 border">
                    {order.items.map((item) => (
                      <div key={item.id} className="mb-2">
                        <div className="font-medium text-gray-800">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ₹{item.price} × {item.quantity}
                        </div>
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-3 border text-gray-700">
                    {order.address}
                  </td>
                  <td className="px-4 py-3 border text-gray-500 text-sm">
                    {order.time}
                  </td>
                  <td className="px-4 py-3 border">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border">
                    {order.status !== "Delivered" && (
                      <button
                        onClick={() => markAsDelivered(order.id, order.userId)}
                        className="bg-blue-600 text-white px-3 py-1 text-xs rounded shadow hover:bg-blue-700"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;

