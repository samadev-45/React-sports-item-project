import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders for current user
  const fetchOrders = async () => {
    try {
      const response = await api.get("/Order/user");
      console.log("🧩 Orders API response:", response.data);
      const sortedOrders = response.data.data.sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );

      setOrders(sortedOrders); // Make sure backend sends OrderItems, TotalPrice, and Address
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch your orders");
    } finally {
      setLoading(false);
    }
  };

  // Cancel order
  const handleCancelOrder = async (orderId) => {
    try {
      await api.put(`/Order/cancel/${orderId}`);
      toast.success("Order cancelled successfully");
      fetchOrders(); // Refresh after cancel
    } catch (error) {
      toast.error("Unable to cancel order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg font-semibold text-gray-600">
        Loading your orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center mt-10 text-lg font-semibold text-gray-600">
        🛍️ You have no orders yet.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          className="border rounded-lg p-4 mb-5 shadow-sm bg-white"
        >
          {/* Order header */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-semibold">
                Order ID: <span className="text-gray-600">{order.id}</span>
              </p>
              <p className="text-sm text-gray-500">
                Placed on: {new Date(order.orderDate).toLocaleDateString("en-IN")}
              </p>
              {/* Show Address */}
              {order.address && (
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Delivery Address: </span>
                  {order.address}
                </p>
              )}
            </div>
            <div>
              <span
                className={`px-3 py-1 text-sm rounded font-semibold ${
                  order.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "Shipped"
                    ? "bg-blue-100 text-blue-700"
                    : order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Cancelled"
                    ? "bg-red-100 text-red-700"
                    : order.status === "PaymentInitiated"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>

          {/* Order items */}
          <div className="border-t pt-3">
            {order.orderItems?.length > 0 ? (
              order.orderItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between items-center py-2"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        item.imagesBase64 && item.imagesBase64.length > 0
                          ? `data:image/png;base64,${item.imagesBase64[0]}`
                          : "/placeholder.png"
                      }
                      alt={item.productName}
                      className="w-16 h-16 object-contain"
                    />
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 py-2">No items in this order.</p>
            )}
          </div>

          {/* Order footer */}
          <div className="border-t mt-3 pt-3 flex justify-between items-center">
            <p className="font-bold text-lg">
              Total: ₹{(order.totalPrice ?? 0).toFixed(2)}
            </p>
            {order.status === "Pending" && (
              <button
                onClick={() => handleCancelOrder(order.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
