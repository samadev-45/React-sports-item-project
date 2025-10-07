import { useWishlist } from "../context/WishlistContext";

const Wishlist = () => {
  const { wishlist, toggleWishlist, moveToCart } = useWishlist();

  const handleMoveToCart = async (item) => {
    await moveToCart(item.productId, item.quantity || 1);
  };

  const handleToggle = async (productId) => {
    await toggleWishlist(productId);
  };

  if (wishlist.length === 0) {
    return (
      <h2 className="text-center text-2xl mt-10 text-gray-700">
        Your wishlist is empty 💔
      </h2>
    );
  }

  return (
    <div className="p-6 grid md:grid-cols-3 gap-6">
      {wishlist.map((item) => (
        <div
          key={item.productId}
          className="border rounded p-4 flex flex-col items-center"
        >
          {/* Images carousel */}
          <div className="flex gap-2 overflow-x-auto mb-4">
            {item.imagesBase64 && item.imagesBase64.length > 0 ? (
              item.imagesBase64.map((imgBase64, index) => (
                <img
                  key={index}
                  src={`data:image/png;base64,${imgBase64}`}
                  alt={`${item.productName} ${index + 1}`}
                  className="w-24 h-24 object-contain flex-shrink-0"
                />
              ))
            ) : (
              <img
                src="/placeholder-image.png"
                alt={item.productName}
                className="w-24 h-24 object-contain"
              />
            )}
          </div>

          <h3 className="font-semibold text-lg">{item.productName}</h3>
          <p className="text-gray-600">₹{item.price}</p>

          <div className="mt-4 flex gap-2">
            <button
              className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
              onClick={() => handleMoveToCart(item)}
            >
              Move to Cart
            </button>

            <button
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => handleToggle(item.productId)}
            >
              ❤️ Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Wishlist;
