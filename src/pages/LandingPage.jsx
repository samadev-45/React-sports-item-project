import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function LandingPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3000/products')
      .then((res) => setProducts(res.data.slice(0, 4)))
      .catch((err) => console.error('Error fetching products', err));
  }, []);

  return (
    <>
      <div
        className="w-full h-screen bg-cover bg-center flex items-center"
        style={{ backgroundImage: "url('./bgimg1.png')" }}
      >
        <div className="ml-10 max-w-xl bg-white bg-opacity-80 p-8 rounded shadow">
          <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4">
            Fuel Your Game
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Explore premium-quality sports gear and apparel for champions.
            Whether you're on the field or the track — we’ve got you covered.
          </p>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Featured Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition duration-200 flex flex-col items-center"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-40 h-40 object-contain mb-4"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-500">{product.category}</p>
              <p className="text-red-600 font-bold mt-1">
                ₹{product.price}
              </p>
              
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Link
            to="/products"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            View More
          </Link>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
