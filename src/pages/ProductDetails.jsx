import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";   //  pagination support
import "swiper/css";
import "swiper/css/pagination";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import { CartContext } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        console.log("Product fetched:", res.data.data);
        setProduct(res.data.data); // directly set the product object
      } catch (err) {
        console.error("Failed to fetch product", err);
        toast.error("Product not found!");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading product...</div>;
  if (!product) return <div className="p-6 text-center">Product not found</div>;

  // Function to render Base64 images with MIME detection
  const renderImage = (imgBase64) => {
    if (!imgBase64) return "/placeholder-image.png"; // fallback placeholder
    const isJPEG = imgBase64.startsWith("/9j/"); // JPEG detection
    const mimeType = isJPEG ? "jpeg" : "png";
    return `data:image/${mimeType};base64,${imgBase64}`;
  };

  // Ensure images array exists
  const images =
    product.imagesBase64 && product.imagesBase64.length > 0
      ? product.imagesBase64
      : [null]; // will show placeholder if no images

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded shadow-md">
        {/* Image Carousel */}
        <div className="w-full md:w-1/2">
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            className="rounded"
          >
            {images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={renderImage(img)}
                  alt={img ? `${product.name} ${idx + 1}` : "No image"}
                  className="w-full h-80 object-contain rounded border bg-gray-50"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
            <p className="text-xl text-gray-800 font-semibold mb-2">
              ₹{product.price}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Category: {product.category}
            </p>

            <div className="flex items-center mb-3">
              <span className="text-yellow-400 text-lg">★★★★☆</span>
              <span className="text-sm text-gray-600 ml-2">(4.0 / 5)</span>
            </div>

            <p className="text-gray-700 mb-4">{product.description}</p>
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
