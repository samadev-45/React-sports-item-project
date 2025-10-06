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
        const res = await api.get("/Order/user"); // backend endpoint
        setOrders(res.data.data || []);
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
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg shadow p-4">
            <div className="mb-2 text-sm text-gray-500">
              <strong>Order ID:</strong> {order.id} |{" "}
              <strong>Placed on:</strong> {new Date(order.orderDate).toLocaleString()} |{" "}
              <strong>Payment:</strong> {order.paymentMethod === 0 ? "Cash on Delivery" : "Online Payment"}
            </div>
            <div className="mb-2 text-sm">
              <strong>Shipping Address:</strong> {order.address}
            </div>
            <div className="mb-2 text-sm">
              <strong>Status:</strong>{" "}
              <span
                className={`font-semibold ${
                  order.status === "Delivered"
                    ? "text-green-600"
                    : order.status === "Shipped"
                    ? "text-orange-600"
                    : order.status === "Pending"
                    ? "text-yellow-600"
                    : order.status === "PaymentInitiated"
                    ? "text-blue-600"
                    : "text-red-600"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="divide-y">
              {(order.orderItems || []).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image || "https://via.placeholder.com/150"}
                      alt={item.productName}
                      className="w-16 h-16 object-contain rounded border"
                    />
                    <div>
                      <h4 className="font-semibold">{item.productName}</h4>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} | ₹{item.price} each
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-semibold">
                    ₹{item.quantity * item.price}
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
