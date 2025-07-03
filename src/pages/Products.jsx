import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((item) => (
        <div
          key={item.id}
          className="border rounded-lg shadow hover:shadow-lg transition-all p-4 flex flex-col items-center bg-white"
        >
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
