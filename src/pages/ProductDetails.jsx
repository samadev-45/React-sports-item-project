import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import { CartContext } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product", err);
        toast.error("Product not found!");
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div className="p-6 text-center">Loading product...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded shadow-md">
        
        <div className="w-full md:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto object-contain rounded border"
          />
        </div>

        
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold text-red mb-2">{product.name}</h2>
            <p className="text-xl text-gray-800 font-semibold mb-2">₹{product.price}</p>
            <p className="text-sm text-gray-600 mb-2">Category: {product.category}</p>

            
            <div className="flex items-center mb-3">
              <span className="text-yellow-400 text-lg">★★★★☆</span>
              <span className="text-sm text-gray-600 ml-2">(4.0 / 5)</span>
            </div>

            
            <p className="text-gray-700 mb-4">
              This high-quality {product.name.toLowerCase()} is designed for sports
              enthusiasts who demand both style and performance. Whether you're a
              beginner or a pro, this item is perfect for your next game or workout.
            </p>
          </div>

          
          <button
            type="button"
            className="bg-black text-white px-6 py-3 rounded hover:bg-red-600 mt-4"
            onClick={() => {
              addToCart(product);
              toast.success("Added to cart!");
            }}
          >
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
