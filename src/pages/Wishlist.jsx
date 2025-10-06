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
          <img
            src={item.image || "/placeholder-image.png"}
            alt={item.productName}
            className="w-40 h-40 object-contain mb-4"
          />
          <h3 className="font-semibold text-lg">{item.productName}</h3>
          <p className="text-gray-600">₹{item.price}</p>

          <div className="mt-4 flex gap-2">
  {/* 🛒 Move to Cart */}
  <button
    className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
    onClick={() => {
      console.log("🛒 Move to Cart clicked for product:", item.productId);
      if (!item || !item.productId) {
        console.error("❌ No productId found in item:", item);
        return;
      }
      handleMoveToCart(item);
    }}
  >
    Move to Cart
  </button>

  {/* ❤️ Remove from Wishlist */}
  <button
    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
    onClick={() => {
      console.log("💔 Remove clicked for product:", item.productId);
      if (typeof handleToggle !== "function") {
        console.error("❌ handleToggle is not a function!");
        return;
      }
      handleToggle(item.productId);
    }}
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
