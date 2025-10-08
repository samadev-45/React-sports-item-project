import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        // Fetch user
        const userRes = await api.get(`/Admin/users/${id}`);
        setUser(userRes.data.data);

        // Fetch user's orders
        const ordersRes = await api.get(`/Admin/users/${id}/orders`);
        setOrders(ordersRes.data.data || []);
      } catch (error) {
        console.error("Error loading user or orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, [id]);

  if (loading) return <div className="p-6">Loading user...</div>;
  if (!user) return <div className="p-6 text-red-600">User not found</div>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-2">{user.name}'s Details</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Status:</strong> {user.isBlocked ? "Blocked" : "Active"}</p>

      <h3 className="text-lg font-semibold mt-4">Orders:</h3>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found for this user.</p>
      ) : (
        <table className="min-w-full border border-gray-200 rounded-lg mt-2">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="py-2 px-4 text-left">Order ID</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{order.id}</td>
                <td className="py-2 px-4">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 capitalize">{order.status}</td>
                <td className="py-2 px-4 text-right">
                  ₹{order.totalPrice?.toFixed(2) ?? "0.00"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserDetails;
