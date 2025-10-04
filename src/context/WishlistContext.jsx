import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import { AuthContext } from "./MyContext";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    if (!user?.id) return;
    try {
      const res = await api.get("/Wishlist/user");
      setWishlist(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    }
  };

  const toggleWishlist = async (productId) => {
  try {
    const res = await api.post(`/wishlist/user/toggle/${productId}`);
    if (res.data.message.includes("added")) {
      // Optimistically update state
      setWishlist((prev) => [...prev, res.data.data]);
      toast.success("Added to wishlist");
    } else {
      setWishlist((prev) => prev.filter((w) => w.productId !== productId));
      toast.info("Removed from wishlist");
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to update wishlist");
  }
};


  const moveToCart = async (productId) => {
    if (!user?.id) return;
    try {
      await api.post(`/Wishlist/user/move-to-cart/${productId}`);
      setWishlist((prev) => prev.filter((p) => p.productId !== productId));
      toast.success("Moved to cart");
    } catch (err) {
      console.error(err);
      toast.error("Failed to move to cart");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  return (
    <WishlistContext.Provider value={{ wishlist, fetchWishlist, toggleWishlist, moveToCart }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
