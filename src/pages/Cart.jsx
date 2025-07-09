import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

const Cart = () => {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useContext(CartContext);

  const [showModal, setShowModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemove = (id) => {
    setItemToRemove(id);
    setShowModal(true);
  };

  const confirmRemove = () => {
    removeFromCart(itemToRemove);
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
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-4">YOUR BAG</h2>
        <p className="mb-4 text-gray-600">
          TOTAL ({cart.length} item{cart.length > 1 ? "s" : ""}) ₹
          {total.toFixed(2)}
        </p>

        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-t py-4">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-contain" />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-600 text-sm">₹{item.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="px-2 bg-gray-200 rounded text-xl font-bold"
                  >
                    -
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="px-2 bg-gray-200 rounded text-xl font-bold"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm font-semibold mt-1">
                  Subtotal: ₹{item.price * item.quantity}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleRemove(item.id)}
              className="text-red-500 hover:underline"
            >
              Remove ❌
            </button>
          </div>
        ))}
      </div>

      <div className="border p-6 rounded shadow h-fit">
        <h3 className="text-xl font-bold mb-4">ORDER SUMMARY</h3>
        <div className="flex justify-between text-sm mb-2">
          <span>{cart.length} item(s)</span>
          <span>₹{total}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span>Delivery</span>
          <span className="text-green-600 font-semibold">Free</span>
        </div>
        <hr className="my-3" />
        <div className="flex justify-between font-bold text-lg mb-4">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
        <Link
          to="/checkout"
          className="w-full block bg-black text-white py-3 text-center rounded hover:bg-gray-800"
        >
          CHECKOUT →
        </Link>
      </div>

      {/* Modal */}
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
