import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "react-toastify";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, summary, removeFromCart, updateQuantity, clearCart } =
    useContext(CartContext);
  const [showModal, setShowModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(0); // 0 = COD, 1 = Online
  const [address, setAddress] = useState(""); // <-- New state for delivery address
  const navigate = useNavigate();

  const handleRemove = (id) => {
    setItemToRemove(id);
    setShowModal(true);
  };

  const confirmRemove = () => {
    removeFromCart(itemToRemove);
    setShowModal(false);
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error("Please enter a delivery address!");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/Order/user/create", {
        address: address.trim(), // <-- send the user-entered address
        paymentMethod,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("✅ Order placed successfully!");
        clearCart();
        navigate("/Orders"); // Redirect to Orders page
      } else {
        toast.error("❌ Failed to place order. Try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Server error while placing order");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <h1 className="text-center text-2xl font-semibold text-gray-700 mt-10">
        🛒 Your cart is empty.
      </h1>
    );
  }

  return (
    <div className="p-6 grid md:grid-cols-3 gap-6">
      {/* CART ITEMS */}
      <div className="md:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">YOUR BAG</h2>
          <button className="text-red-500 hover:underline" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
        <p className="mb-4 text-gray-600">
          TOTAL ({summary.totalQuantity} item{summary.totalQuantity > 1 ? "s" : ""}) ₹
          {summary.totalPrice.toFixed(2)}
        </p>

        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-t py-4">
            <div className="flex items-center gap-4">
              <img
                src={item.imageUrl || "/placeholder.png"}
                alt={item.productName}
                className="w-24 h-24 object-contain"
              />
              <div>
                <p className="font-semibold">{item.productName}</p>
                <p className="text-gray-600 text-sm">₹{item.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    className="px-2 bg-gray-200 rounded text-xl font-bold"
                  >
                    -
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    className="px-2 bg-gray-200 rounded text-xl font-bold"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm font-semibold mt-1">
                  Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleRemove(item.productId)}
              className="text-red-500 hover:underline"
            >
              Remove ❌
            </button>
          </div>
        ))}
      </div>

      {/* ORDER SUMMARY */}
      <div className="border p-6 rounded shadow h-fit">
        <h3 className="text-xl font-bold mb-4">ORDER SUMMARY</h3>

        {/* Address Input */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Delivery Address:</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your delivery address"
            className="w-full border rounded px-3 py-2"
            rows={3}
          />
        </div>

        <div className="flex justify-between text-sm mb-2">
          <span>{summary.totalQuantity} item(s)</span>
          <span>₹{summary.totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span>Delivery</span>
          <span className="text-green-600 font-semibold">Free</span>
        </div>
        <hr className="my-3" />
        <div className="flex justify-between font-bold text-lg mb-4">
          <span>Total</span>
          <span>₹{summary.totalPrice.toFixed(2)}</span>
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <p className="font-semibold mb-2">Payment Method:</p>
          <div className="flex flex-col gap-2">
            <label>
              <input
                type="radio"
                value={0}
                checked={paymentMethod === 0}
                onChange={() => setPaymentMethod(0)}
              />{" "}
              Cash on Delivery
            </label>
            <label>
              <input
                type="radio"
                value={1}
                checked={paymentMethod === 1}
                onChange={() => setPaymentMethod(1)}
              />{" "}
              Online Payment
            </label>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full bg-black text-white py-3 text-center rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Placing Order..." : "PLACE ORDER →"}
        </button>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmRemove}
        message="Are you sure you want to remove this item from your cart?"
      />
    </div>
  );
};

export default Cart;
