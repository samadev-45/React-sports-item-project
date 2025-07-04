import React, { useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/MyContext';

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useContext(AuthContext);
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
  }, [user]);

  const moveToCart = async (product) => {
    try {
      // 1. Add to cart
      const userRes = await api.get(`/users/${user.id}`);
      const updatedCart = [...(userRes.data.cart || []), product];
    
      // 2. Remove from wishlist
      const updatedWishlist = wishlist.filter((item) => item.id !== product.id);

      // 3. Update user
      await api.put(`/users/${user.id}`, {
        ...userRes.data,
        cart: updatedCart,
        wishlist: updatedWishlist,
      });

      setWishlist(updatedWishlist);
    } catch (err) {
      console.error("Error moving to cart:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty.</p>
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
              type='submit'
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
