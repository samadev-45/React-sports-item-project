import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";


function LandingPage() {
  const [products, setProducts] = useState([]);

 useEffect(() => {
  api
    .get("/products")
    .then((res) => {
      const productsArray = res.data.data; //  get the actual array
      setProducts(productsArray.slice(0, 4));
    })
    .catch((err) => console.error("Error fetching products", err));
}, []);


  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative w-full h-screen max-h-[900px] bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-0 opacity-90"></div>

        <img
          src="https://images.unsplash.com/photo-1546519638-68e109498ffc"
          alt="Athlete in action"
          className="w-full h-full object-cover absolute top-0 left-0"
          loading="eager"
        />

        <div className="relative z-10 h-full flex flex-col items-end justify-center px-4 sm:px-6 lg:px-20">
          <div className="max-w-2xl bg-white/70 p-8 rounded-xl shadow-2xl backdrop-blur-md">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 mb-6 leading-tight">
              Play Harder.
              <br />
              Perform Better.
            </h1>
            <p className="text-lg md:text-xl text-gray-800 mb-8">
              Premium sportswear engineered for peak performance. Whether you're
              training, competing, or pushing your limits — we've got you
              covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-full text-lg font-bold hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-lg hover:shadow-xl text-center"
              >
                Shop Collection
              </Link>
              <Link
                to="/profile"
                className="px-8 py-4 bg-transparent border-2 border-gray-800 text-gray-800 rounded-full text-lg font-bold hover:bg-gray-800 hover:text-white transition-all duration-300 text-center"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            ></path>
          </svg>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Featured Gear
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked performance essentials to elevate your game
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <p className="text-sm font-medium text-red-600 mb-1">
                  {product.category}
                </p>
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-gray-900">
                    ₹{product.price}
                  </p>
                  <Link
                    to={`/products/${product.id}`}
                    className="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-block px-8 py-3 bg-gray-900 text-white rounded-full text-lg font-semibold hover:bg-black transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Explore All Products
          </Link>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Join the Movement
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Sign up for exclusive offers, training tips, and early access to new
            collections
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-4 rounded-l-full bg-white text-gray-900 outline-none"
            />
            <button className="px-6 py-4 bg-red-600 hover:bg-red-700 rounded-r-full font-bold transition-colors duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-black text-white px-4 sm:px-6 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-red-600">SPORTSSTORE</h3>
            <p className="text-gray-400 mb-4">
              Performance gear for athletes who demand more from themselves and
              their equipment.
            </p>
            <div className="flex gap-4">
              <Link
                to="https://facebook.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </Link>
              <Link
                to="https://twitter.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link
                to="https://instagram.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">SHOP</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products/men"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Men's Collection
                </Link>
              </li>
              <li>
                <Link
                  to="/products/women"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link
                  to="/products/new"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  to="/products/sale"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Sale Items
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">SUPPORT</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  to="/size-guide"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">ABOUT</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/stores"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Store Locator
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 SportsStore. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
