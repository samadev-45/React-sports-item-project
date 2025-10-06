import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import { CartContext } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart, user } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigator = useNavigate()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.data);
      } catch (err) {
        console.error(err);

        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading product...</div>;
  if (!product) return <div className="p-6 text-center">Product not found</div>;

  const renderImage = (imgBase64) => {
    if (!imgBase64) return "/placeholder-image.png";
    const isJPEG = imgBase64.startsWith("/9j/");
    const mimeType = isJPEG ? "jpeg" : "png";
    return `data:image/${mimeType};base64,${imgBase64}`;
  };

  const images =
    product.imagesBase64?.length > 0 ? product.imagesBase64 : [null];

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
            <p className="text-gray-700 mb-4">{product.description}</p>
          </div>

          <button
            type="button"
            className="bg-black text-white px-6 py-3 rounded hover:bg-red-600 mt-4"
            onClick={async () => {
              try {
                if (!user) {
                  console.log("hhh");

                  navigator("/login");
                }
                await addToCart(product.id, 1); // pass productId & quantity
                toast.success("Added to cart!");
              } catch (err) {
                navigator("/login");
                console.error(err);
                toast.error("Failed to add to cart");
              }
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
