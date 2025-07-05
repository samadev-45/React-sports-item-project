import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/MyContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Checkout = () => {
  const { cart, setCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [address, setAddress] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = async () => {
    if (!user?.id || !address.trim()) {
      toast.warning("Please enter your address");
      return;
    }

    try {
      const res = await api.get(`/users/${user.id}`);
      const userData = res.data;

      const newOrder = {
        id: `order_${Date.now()}`,
        items: cart.map((item) => ({
          ...item,
          status: "Delivered",
          time: new Date().toLocaleString(),
          address: address.trim(),
        })),
        address: address.trim(),
        status: "Delivered",
        time: new Date().toLocaleString(),
      };

      const updatedOrders = [...(userData.orders || []), newOrder];

      await api.patch(`/users/${user.id}`, {
        orders: updatedOrders,
        cart: [],
      });

      setCart([]);
      setOrderSuccess(true);
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Something went wrong!");
    }
  };

  if (orderSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <img
          src="https://cdn.dribbble.com/userupload/25727579/file/original-9c6d8b3d1984842c178e2f0c9904912e.gif"
          alt="Success"
          className="w-64 mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
        <p className="mb-4 text-gray-600">Thank you for shopping with us!</p>
        <button
          onClick={() => navigate("/orders")}
          className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          View Orders
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return <div className="p-6 text-center">Cart is empty. Nothing to checkout.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Checkout Summary</h2>

     
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Shipping Address</label>
        <textarea
          className="w-full border px-3 py-2 rounded"
          rows="3"
          placeholder="Enter your full address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

     
      <div className="bg-white rounded shadow p-4 mb-6">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between border-b py-2">
            <div>{item.name} × {item.quantity}</div>
            <div>₹{item.price * item.quantity}</div>
          </div>
        ))}

        <div className="flex justify-between font-bold text-lg pt-4">
          <div>Total</div>
          <div>₹{total}</div>
        </div>
      </div>

      <button
        onClick={placeOrder}
        className="w-full py-3 bg-red-500 text-white font-bold rounded hover:bg-red-600"
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
