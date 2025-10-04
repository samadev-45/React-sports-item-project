import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  const { wishlist, toggleWishlist } = useWishlist();

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const minPrice =
        priceRange === "under-500" ? 0 :
        priceRange === "500-1000" ? 500 :
        priceRange === "1000-1500" ? 1000 :
        priceRange === "above-1500" ? 1500 : undefined;

      const maxPrice =
        priceRange === "under-500" ? 499 :
        priceRange === "500-1000" ? 1000 :
        priceRange === "1000-1500" ? 1500 :
        priceRange === "above-1500" ? undefined : undefined;

      const params = {};
      if (debouncedSearchTerm) params.name = debouncedSearchTerm;
      if (category) params.category = category;
      if (minPrice !== undefined) params.minPrice = minPrice;
      if (maxPrice !== undefined) params.maxPrice = maxPrice;

      const res = await api.get("/products/search", { params });
      setProducts(res.data.data || []);
      setCurrentPage(0);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearchTerm, category, priceRange]);

  const pageCount = Math.ceil(products.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const paginatedProducts = products.slice(offset, offset + itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setCategory("");
    setPriceRange("");
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCurrentPage(0);
  };

  const renderImage = (imgBase64) => {
    if (!imgBase64) return "/placeholder-image.png";
    const isJPEG = imgBase64.startsWith("/9j/");
    const mimeType = isJPEG ? "jpeg" : "png";
    return `data:image/${mimeType};base64,${imgBase64}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No products found</h2>
            <button
              onClick={resetFilters}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((item) => {
              const isInWishlist = wishlist.some((w) => w.productId === item.id);
              const hasImages = item.imagesBase64 && item.imagesBase64.length > 0;

              return (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full"
                >
                  {/* Wishlist button */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(item.id)}
                    className={`absolute top-3 right-3 z-10 p-2 rounded-full ${
                    isInWishlist ? "bg-red-100 text-red-500" : "bg-white text-gray-400"
                    } shadow hover:bg-red-100 hover:text-red-500 transition-colors`}
                      >
                      <FaHeart size={16} />
                    </button>


                  {/* Product Image */}
                  <div className="w-full h-64 overflow-hidden">
                    {hasImages && item.imagesBase64.length > 1 ? (
                      <Swiper spaceBetween={10} slidesPerView={1}>
                        {item.imagesBase64.map((imgBase64, idx) => (
                          <SwiperSlide key={idx}>
                            <img
                              src={renderImage(imgBase64)}
                              alt={`${item.name} ${idx + 1}`}
                              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    ) : (
                      <img
                        src={hasImages ? renderImage(item.imagesBase64[0]) : "/placeholder-image.png"}
                        alt={item.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-gray-600 mt-1">{item.category}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-black font-bold">₹{item.price}</p>
                      <Link
                        to={`/products/${item.id}`}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {products.length > itemsPerPage && (
          <div className="mt-10 flex justify-center">
            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName={"flex gap-2"}
              pageClassName={"px-3 py-1 border border-gray-300 rounded-lg cursor-pointer"}
              previousClassName={"px-3 py-1 border border-gray-300 rounded-lg cursor-pointer"}
              nextClassName={"px-3 py-1 border border-gray-300 rounded-lg cursor-pointer"}
              activeClassName={"bg-black text-white border-black"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
