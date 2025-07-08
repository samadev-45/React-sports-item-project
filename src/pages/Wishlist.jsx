import React, { useContext, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/MyContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { toast } from 'react-toastify';

function Wishlist() {
  const { user } = useContext(AuthContext);
  const { cart, setCart } = useContext(CartContext);
  const { wishlist, setWishlist } = useContext(WishlistContext); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.id) return;

      try {
        const res = await api.get(`/users/${user.id}`);
        setWishlist(res.data.wishlist || []);
      } catch (err) {
        console.error("Failed to load wishlist", err);
      }
    };

    fetchWishlist();
  }, [user, setWishlist]);

  const moveToCart = async (product) => {
    try {
      const res = await api.get(`/users/${user.id}`);
      const userData = res.data;
      const cart = userData.cart || [];

      const exists = cart.find((item) => item.id === product.id);

      const updatedCart = exists
        ? cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...cart, { ...product, quantity: 1 }];

      const updatedWishlist = wishlist.filter((item) => item.id !== product.id);

      await api.patch(`/users/${user.id}`, {
        cart: updatedCart,
        wishlist: updatedWishlist,
      });

      setCart(updatedCart);
      setWishlist(updatedWishlist); 
      toast.success("Moved to cart!");
    } catch (err) {
      console.error("Error moving to cart:", err);
      toast.error("Failed to move to cart");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Wishlist</h2>
      <img src="https://www.niviasports.com/cdn/shop/collections/cricket-category_banner-footwear.webp?v=1722230903&width=1100" alt="wish list image" style={{width:"100%"}} />
      {wishlist.length === 0 ? (
        <h1 className="text-gray-600 text-lg text-center mt-10 text-bold text-3xl">Your wishlist is empty.</h1>

      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded shadow flex flex-col items-center"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-32 h-32 object-contain mb-2"
              />
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.category}</p>
              <p className="text-red-600 font-bold mt-1">₹{item.price}</p>
              <button
                type='button'
                onClick={() => moveToCart(item)}
                className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Move to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
