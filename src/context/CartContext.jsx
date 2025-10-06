import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { AuthContext } from "./MyContext";
import { useNavigate } from "react-router-dom";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [summary, setSummary] = useState({ totalQuantity: 0, totalPrice: 0 });
  

  // ---------------- Update Summary ----------------
  const updateSummary = (cartItems) => {
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setSummary({ totalQuantity, totalPrice });
  };

  // ---------------- Fetch Cart ----------------
  const fetchCart = async () => {
    if (!user?.userId) {
      console.warn("⚠️ Skipping fetchCart: user missing", { user });
      return;
    }

    try {
      console.log("➡️ Fetching cart...");
      const res = await api.get("/Cart/user");
      console.log("✅ Cart response:", res.data);
      const cartItems = res.data.data || [];
      setCart(cartItems);
      updateSummary(cartItems);
    } catch (err) {
      console.error("❌ Failed to fetch cart:", err);
    }
    
  };

  // Fetch cart when user logs in
  useEffect(() => {
    fetchCart();
  }, [user]);

  // ---------------- Add to Cart ----------------
  const addToCart = async (productId, quantity = 1) => {
    try {
      
      console.log(`➡️ Adding product ${productId} to cart...`);
      const res = await api.post(`/Cart/user/add/${productId}?quantity=${quantity}`);
      console.log("✅ Add to cart response:", res.data);

      const newItem = res.data.data;
      setCart((prev) => {
        const exists = prev.find((item) => item.productId === newItem.productId);
        const updatedCart = exists
          ? prev.map((item) => (item.productId === newItem.productId ? newItem : item))
          : [...prev, newItem];

        updateSummary(updatedCart);
        return updatedCart;
      });
    } catch (err) {
      console.error("❌ Failed to add to cart:", err);
    }
  };

  // ---------------- Remove from Cart ----------------
  const removeFromCart = async (productId) => {
    try {
      console.log(`➡️ Removing product ${productId} from cart...`);
      await api.delete(`/Cart/user/remove/${productId}`);
      setCart((prev) => {
        const updatedCart = prev.filter((item) => item.productId !== productId);
        updateSummary(updatedCart);
        return updatedCart;
      });
    } catch (err) {
      console.error("❌ Failed to remove item:", err);
    }
  };

  // ---------------- Update Quantity ----------------
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      console.log(`➡️ Updating quantity for product ${productId} to ${quantity}...`);
      const res = await api.put(`/Cart/user/update/${productId}?quantity=${quantity}`);
      console.log("✅ Update quantity response:", res.data);

      const updatedItem = res.data.data;
      setCart((prev) =>
        prev.map((item) => (item.productId === updatedItem.productId ? updatedItem : item))
      );
      updateSummary(cart);
    } catch (err) {
      console.error("❌ Failed to update quantity:", err);
    }
  };

  // ---------------- Clear Cart ----------------
  const clearCart = async () => {
    try {
      console.log("➡️ Clearing cart...");
      await api.delete("/Cart/user/clear");
      setCart([]);
      setSummary({ totalQuantity: 0, totalPrice: 0 });
    } catch (err) {
      console.error("❌ Failed to clear cart:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{ user, cart, summary, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
