import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function LandingPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/products')
      .then((res) => setProducts(res.data.slice(0, 4)))
      .catch((err) => console.error('Error fetching products', err));
  }, []);

  return (
    <>
      <div className="w-full h-screen bg-cover bg-center flex items-start justify-start" style={{ backgroundImage: "url('./bgimg1.png')" }}>
        <div className="m-4 md:ml-10 mt-20 md:mt-40 max-w-xl bg-white bg-opacity-80 p-6 md:p-10 rounded shadow">
          <h1 className="text-3xl md:text-5xl font-bold text-red-600 mb-4">Fuel Your Game</h1>
          <p className="text-base md:text-lg text-gray-700 mb-6">
            Explore premium-quality sports gear and apparel for champions. Whether you're on the field or the track — we’ve got you covered.
          </p>
          <Link to="/products" className="inline-block px-5 py-2 md:px-6 md:py-3 bg-red-600 text-white rounded hover:bg-red-700">
            Shop Now
          </Link>
        </div>
      </div>

      

      
      <div className="p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition duration-200 flex flex-col items-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-32 h-32 md:w-40 md:h-40 object-contain mb-4"
              />
              <h3 className="text-base md:text-lg font-semibold text-center">{product.name}</h3>
              <p className="text-gray-500 text-sm md:text-base">{product.category}</p>
              <p className="text-red-600 font-bold mt-1">₹{product.price}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Link
            to="/products"
            className="bg-blue-600 text-white px-4 py-2 md:px-5 md:py-2 rounded hover:bg-blue-700"
          >
            View More
          </Link>
        </div>
      </div>

       

      <footer className="bg-black text-white px-6 py-10 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">#MoveUp by signing up</h3>
            <div className="flex items-center border-b border-gray-600 py-2">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-black outline-none text-white placeholder-gray-400 flex-1"
              />
              <button className="text-red-600 font-semibold ml-2">SEND</button>
            </div>
            <div className="flex gap-4 mt-4">
              <Link to='https://www.facebook.com/'><span className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-400">f</span></Link>
              <Link to='https://x.com/?lang=en'><span className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black">x</span>  </Link>
            
              <Link to='https://bridgeon.in/'><span className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black">G</span></Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-3">COMPANY INFORMATION</h4>
            <ul className="space-y-2 text-sm">
              <li>About Us</li>
              <li>Contact</li>
              <li>Terms And Conditions</li>
              <li>Privacy Policy</li>
              <li>Exchange & Return Policy</li>
              <li>Track Order</li>
              
              
              
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">SPORTSSTORE SERVICES</h4>
            <ul className="space-y-2 text-sm">
              <li>HOME DELIVERY</li>
              <li>quality products</li>
            
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">CONNECT WITH US</h4>
            <p className="text-sm">📞 +91-9115497521</p>
            <p className="text-sm">✉ contact@sportsstore.in</p>
            <p className="text-sm">(Mon-Sat, 10:00am till 6:00pm)</p>
          </div>
        </div>

        <hr className="my-6 border-red-600" />
        <p className="text-center text-sm">© 2025 SportsStore, All Rights Reserved.</p>
      </footer>
    </>
  );
}

export default LandingPage;