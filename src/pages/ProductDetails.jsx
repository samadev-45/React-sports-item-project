import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import { CartContext } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const {addToCart} = useContext(CartContext);
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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-1/2 h-auto rounded shadow"
        />
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-red-600 mb-2">{product.name}</h2>
          <p className="text-lg text-gray-700 mb-2">₹{product.price}</p>
          <p className="text-sm text-gray-600 mb-4">Category: {product.category}</p>
          <button
          type="button"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() =>{addToCart(product);
               toast.success("Added to cart!")}}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;