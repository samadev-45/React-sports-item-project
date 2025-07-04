import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {FaHeart} from 'react-icons/fa'
import { AuthContext } from '../context/MyContext';



const Products = () => {
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext); 
  
  

  useEffect(() => {
    api.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  const addToWishlist = async (product) => {
    if (!user?.id) return;

    try {
      const userdata = await api.get(`/users/${user.id}`);
      const wishlist = userdata.data.wishlist || [];

      const exists = wishlist.find((item) => item.id === product.id);
      if (exists) return;

      const updatedWishlist = [...wishlist, product];
      await api.patch(`/users/${user.id}`, { wishlist: updatedWishlist });

      console.log("Added to wishlist:", product.name);
    } catch (err) {
      console.error("Failed to add to wishlist:", err);
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((item) => (
        <div
          key={item.id}
          className="relative border rounded-lg shadow hover:shadow-lg transition-all p-4 flex flex-col items-center bg-white"
        >
          <button
          type='button'
            onClick={() =>addToWishlist(item) }
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
          >
            <FaHeart size={20} />
          </button>

          <img
            src={item.image}
            alt={item.name}
            className="h-40 object-contain mb-4"
          />
          <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{item.category}</p>
          <p className="text-red-600 font-bold mb-3">₹{item.price}</p>

          <Link
            to={`/products/${item.id}`}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Products;
