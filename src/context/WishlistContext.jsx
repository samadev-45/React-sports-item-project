import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import { AuthContext } from "./MyContext";
import { CartContext } from "./CartContext";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------- Fetch Wishlist ----------------
  const fetchWishlist = async () => {
    if (!user?.userId) {
      console.warn("⚠️ Skipping fetchWishlist: user missing", { user });
      return;
    }

    setLoading(true);
    try {
      console.log("➡️ Fetching wishlist...");
      const res = await api.get("/Wishlist/user");
      console.log("✅ Wishlist response:", res.data.data);
      setWishlist(res.data.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch wishlist:", err);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Toggle Wishlist ----------------
  const toggleWishlist = async (productId) => {
    if (!user?.userId) {
      console.warn("⚠️ Skipping toggleWishlist: user missing", { user });
      return;
    }

    try {
      console.log(`➡️ Toggling wishlist for product ${productId}...`);
      const res = await api.post(`/Wishlist/user/toggle/${productId}`);
      console.log("✅ Toggle response:", res.data);

      const isAdded = res.data.message?.toLowerCase().includes("added");

      setWishlist((prev) =>
        isAdded ? [...prev, res.data.data] : prev.filter((w) => w.productId !== productId)
      );

      toast[isAdded ? "success" : "info"](isAdded ? "Added to wishlist" : "Removed from wishlist");
      console.log(`${isAdded ? "❤️ Added" : "💔 Removed"} product ${productId} in wishlist`);
    } catch (err) {
      console.error("❌ Failed to update wishlist:", err);
      toast.error("Failed to update wishlist");
    }
  };

  // ---------------- Move to Cart ----------------
  const moveToCart = async (productId, quantity = 1) => {
    if (!user?.userId) {
      console.warn("⚠️ Skipping moveToCart: user missing", { user });
      return;
    }

    try {
  console.log(`➡️ Moving product ${productId} to cart...`);

  // 1️⃣ Add product to cart
  await addToCart(productId, quantity);

  // 2️⃣ Call backend to move it from wishlist to cart
  await api.post(`/Wishlist/user/move-to-cart/${productId}`);

  // 3️⃣ Update UI
  setWishlist((prev) => prev.filter((w) => w.productId !== productId));

  toast.success("Moved to cart!");
  console.log(`🛒 Product ${productId} moved to cart`);
} catch (err) {
  console.error("❌ Failed to move item to cart:", err);
  toast.error("Failed to move item to cart");
}

  };

  // ---------------- Effect ----------------
  useEffect(() => {
    fetchWishlist();
  }, [user]);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, moveToCart, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

// Helper hook
export const useWishlist = () => useContext(WishlistContext);
