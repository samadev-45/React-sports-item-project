import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  // Fetch all orders across all users
  const fetchOrders = async () => {
    console.log("fetching....");
    
    try {
      const res = await api.get("/users");
      const allUsers = res.data;

      // flatten all orders and attach user info
      const allOrders = allUsers.flatMap((user) =>
        (user.orders || []).map((order) => ({
          ...order,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
        }))
      );

      setOrders(allOrders);
    } catch (err) {
  console.error("Fetch Error:", err.message, err.code, err.response);
  toast.error("Failed to fetch products");
}
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update status to Delivered
  const markAsDelivered = async (orderId, userId) => {
    try {
      const res = await api.get(`/users/${userId}`);
      const user = res.data;

      // update the order status inside the user object
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">All Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow rounded p-4 border border-gray-200"
            >
              <div className="mb-2">
                <strong>Order ID:</strong> {order.id}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <strong>User:</strong> {order.userName} ({order.userEmail})
              </div>
              <div className="text-sm mb-2">
                <strong>Address:</strong> {order.address}
              </div>
              <div className="text-sm mb-2">
                <strong>Time:</strong> {order.time}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border p-3 rounded">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-green-600 font-bold">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
                </span>
                {order.status !== "Delivered" && (
                  <button
                    onClick={() => markAsDelivered(order.id, order.userId)}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                  >
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
