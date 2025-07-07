import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "./MyContext";
import api from "../services/api";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user?.id) {
      api.get(`/users/${user.id}`)
        .then(res => setWishlist(res.data.wishlist || []))
        .catch(err => console.error("Failed to load wishlist:", err));
    }
  }, [user]);

  const addToWishlist = async (product) => {
    if (!user?.id) return;
    const exists = wishlist.find(item => item.id === product.id);
    if (exists) return toast.info("Already in wishlist!");

    const updatedList = [...wishlist, product];

    await api.put(`/users/${user.id}`, { ...user, wishlist: updatedList });

    setWishlist(updatedList);
    toast.success("Added to wishlist!");
  };

  const removeFromWishlist = async (id) => {
    const updatedList = wishlist.filter(item => item.id !== id);
    await api.put(`/users/${user.id}`, { wishlist: updatedList });
    setWishlist(updatedList);
    toast.success("Removed from wishlist!")
  }

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
