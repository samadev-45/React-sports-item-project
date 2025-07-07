import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FaHeart } from 'react-icons/fa';
import { AuthContext } from '../context/MyContext';
import { WishlistContext } from '../context/WishlistContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useContext(AuthContext);
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  useEffect(() => {
    api.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  const filteredProducts = products.filter((item) => {
    const matchCategory = category ? item.category.toLowerCase() === category.toLowerCase() : true;
    const matchSubCategory = subCategory ? item.name.toLowerCase().includes(subCategory.toLowerCase()) : true;
    const matchSearch = searchTerm ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;

    let matchPrice = true;
    const price = item.price;

    if (priceRange === "under-500") matchPrice = price < 500;
    else if (priceRange === "500-1000") matchPrice = price >= 500 && price <= 1000;
    else if (priceRange === "1000-1500") matchPrice = price > 1000 && price <= 1500;
    else if (priceRange === "above-1500") matchPrice = price > 1500;

    return matchCategory && matchSubCategory && matchSearch && matchPrice;
  });

  return (
    <div className="p-6">
      <img src="https://www.niviasports.com/cdn/shop/collections/Footwear_main_Shoes_category-banner.webp?v=1722404461&width=2000" alt="landing page image" />
      
      <div className="bg-gray-100 rounded-lg p-4 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 shadow-sm">
        <select
          className="border px-3 py-2 rounded text-sm bg-white"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Football">Football</option>
          <option value="Cricket">Cricket</option>
          <option value="Basketball">Basketball</option>
        </select>

        <select
          className="border px-3 py-2 rounded text-sm bg-white"
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
        >
          <option value="">All Subcategories</option>
          <option value="Shoes">Shoes</option>
          <option value="Socks">Socks</option>
        </select>

        <select
          className="border px-3 py-2 rounded text-sm bg-white"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
        >
          <option value="">All Prices</option>
          <option value="under-500">Below ₹500</option>
          <option value="500-1000">₹500 - ₹1000</option>
          <option value="1000-1500">₹1000 - ₹1500</option>
          <option value="above-1500">Above ₹1500</option>
        </select>

        <input
          type="text"
          placeholder="Search product"
          className="border px-3 py-2 rounded text-sm bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          filteredProducts.map((item) => {
            const isInWishlist = wishlist.some((w) => w.id === item.id);

            return (
              <div
                key={item.id}
                className="relative border rounded-lg shadow-md hover:shadow-lg transition-all p-4 flex flex-col items-center bg-white hover:bg-gray-50"
              >
                <button
                  type="button"
                  onClick={() =>
                    isInWishlist ? removeFromWishlist(item.id) : addToWishlist(item)
                  }
                  className={`absolute top-2 right-2 ${
                    isInWishlist ? 'text-red-500' : 'text-gray-400'
                  } hover:text-red-500`}
                >
                  <FaHeart size={20} />
                </button>

                <img
                  src={item.image}
                  alt={item.name}
                  className="h-40 object-contain mb-4"
                />

            
                <h3 className="text-lg font-semibold mb-1 text-center">{item.name}</h3>

                
                <p className="text-gray-600 text-sm mb-1">{item.category}</p>

              
                <div className="text-yellow-400 text-sm mb-2">★★★★☆</div>

                
                <p className="text-red-600 font-bold mb-3">₹{item.price}</p>

                
                <Link
                  to={`/products/${item.id}`}
                  className="px-4 py-2 bg-black text-white rounded hover:bg-red-600 text-sm transition"
                >
                  View Details
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Products;
