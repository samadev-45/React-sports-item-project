import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { AuthContext } from "./MyContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (user?.id) {
      api
        .get(`/users/${user.id}`)
        .then((res) => {
          setCart(res.data.cart || []);
        })
        .catch((err) => {
          console.error("Failed to fetch user cart:", err);
        });
    }
  }, [user]);

  // ✅ Add to cart (with quantity = 1 if not exists, else increase quantity)
  const addToCart = async (product) => {
    if (!user?.id) return;

    const exists = cart.find((item) => item.id === product.id);

    let updatedCart;

    if (exists) {
      updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    await api.patch(`/users/${user.id}`, { cart: updatedCart });
    setCart(updatedCart);
  };

  // ✅ Remove item
  const removeFromCart = async (productId) => {
    if (!user?.id) return;

    const updatedCart = cart.filter((item) => item.id !== productId);

    await api.patch(`/users/${user.id}`, { cart: updatedCart });
    setCart(updatedCart);
  };

  // ✅ Increase quantity
  const increaseQty = async (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );

    await api.patch(`/users/${user.id}`, { cart: updatedCart });
    setCart(updatedCart);
  };

  // ✅ Decrease quantity
  const decreaseQty = async (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
        : item
    );

    await api.patch(`/users/${user.id}`, { cart: updatedCart });
    setCart(updatedCart);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
