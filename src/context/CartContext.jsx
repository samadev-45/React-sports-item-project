import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api"; 
import { AuthContext } from "./MyContext";


export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (user?.id) {
      api.get(`/users/${user.id}`)
        .then((res) => {
          setCart(res.data.cart || []);
        })
        .catch((err) => {
          console.error("Failed to fetch user cart:", err);
        });
    }
  }, [user]);

  const addToCart = async (product) => {
    if (!user?.id) return;

    const exists = cart.find((item) => item.id === product.id);
    if (exists) return;

    const updatedCart = [...cart, product];

    await api.patch(`/users/${user.id}`, { cart: updatedCart });
    setCart(updatedCart);
  };

  const removeFromCart = async (productId) => {
    if (!user?.id) return;

    const updatedCart = cart.filter((item) => item.id !== productId);

    await api.patch(`/users/${user.id}`, { cart: updatedCart });
    setCart(updatedCart);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
