import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/MyContext";
import api from "../services/api";

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      try {
        const res = await api.get(`/users/${user.id}`);
        setOrders(res.data.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    fetchOrders();
  }, [user]);

  if (orders.length === 0) {
    return <div className="p-6 text-center">You have no orders yet.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">My Orders</h2>

      <div className="space-y-6">
        {orders.map((order, index) => (
          <div key={order.id || index} className="border rounded-lg shadow p-4">
            <div className="mb-2 text-sm text-gray-500">
              <strong>Order ID:</strong> {order.id} |{" "}
              <strong>Placed on:</strong> {order.time}
            </div>
            <div className="mb-2 text-sm">
              <strong>Shipping Address:</strong> {order.address}
            </div>

            <div className="divide-y">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded border"
                    />
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} | ₹{item.price} each
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      ₹{item.quantity * item.price}
                    </div>
                    <span className="text-xs text-green-600">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
