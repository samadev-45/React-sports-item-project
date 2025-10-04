import React, { useEffect } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const { wishlist, fetchWishlist, toggleWishlist, moveToCart } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleMoveToCart = async (productId) => {
    await moveToCart(productId);
    navigate("/cart"); // Redirect after move
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Wishlist</h2>
      <img
        src="https://www.niviasports.com/cdn/shop/collections/cricket-category_banner-footwear.webp?v=1722230903&width=1100"
        alt="wish list banner"
        style={{ width: "100%" }}
      />
      {wishlist.length === 0 ? (
        <h1 className="text-gray-600 text-lg text-center mt-10 text-bold text-3xl">
          Your wishlist is empty.
        </h1>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {wishlist.map((item) => (
            <div key={item.id} className="border p-4 rounded shadow flex flex-col items-center">
              <img
                src={item.image || "/placeholder-image.png"}
                alt={item.productName}
                className="w-32 h-32 object-contain mb-2"
              />
              <h3 className="font-semibold">{item.productName}</h3>
              <p className="text-sm text-gray-500">{item.category || "Category"}</p>
              <p className="text-red-600 font-bold mt-1">₹{item.price}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => toggleWishlist(item.productId)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
                <button
                  onClick={() => handleMoveToCart(item.productId)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
