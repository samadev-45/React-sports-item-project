import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { FaHeart, FaSearch, FaFilter } from "react-icons/fa";
import { WishlistContext } from "../context/WishlistContext";
import ReactPaginate from "react-paginate";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const itemsPerPage = 8;

  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredProducts = products.filter((item) => {
    const matchCategory = category
      ? item.category.toLowerCase() === category.toLowerCase()
      : true;
    const matchSubCategory = subCategory
      ? item.name.toLowerCase().includes(subCategory.toLowerCase())
      : true;
    const matchSearch = debouncedSearchTerm
      ? item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      : true;

    let matchPrice = true;
    const price = item.price;

    if (priceRange === "under-500") matchPrice = price < 500;
    else if (priceRange === "500-1000")
      matchPrice = price >= 500 && price <= 1000;
    else if (priceRange === "1000-1500")
      matchPrice = price > 1000 && price <= 1500;
    else if (priceRange === "above-1500") matchPrice = price > 1500;

    return matchCategory && matchSubCategory && matchSearch && matchPrice;
  });

  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(offset, offset + itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setCategory("");
    setSubCategory("");
    setPriceRange("");
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCurrentPage(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-48 md:h-64 lg:h-80 xl:h-96 overflow-hidden">
        <img
          src="https://www.niviasports.com/cdn/shop/collections/Footwear_main_Shoes_category-banner.webp?v=1722404461&width=2000"
          alt="Sports gear collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center px-4">
            Shop Our Premium Collection
          </h1>
        </div>
      </div>

      
      <div className="container mx-auto px-4 py-8">
        
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center justify-center w-full py-2 px-4 bg-black text-white rounded-lg"
          >
            <FaFilter className="mr-2" />
            {showMobileFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

       
        <div className={`${showMobileFilters ? "block" : "hidden"} lg:block mb-8`}>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <select
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Football">Football</option>
                <option value="Cricket">Cricket</option>
                <option value="Basketball">Basketball</option>
              </select>

              {/* Subcategory Filter */}
              <select
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
              >
                <option value="">All Subcategories</option>
                <option value="Shoes">Shoes</option>
                <option value="Socks">Socks</option>
              </select>

              {/* Price Filter */}
              <select
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="">All Prices</option>
                <option value="under-500">Below ₹500</option>
                <option value="500-1000">₹500 - ₹1000</option>
                <option value="1000-1500">₹1000 - ₹1500</option>
                <option value="above-1500">Above ₹1500</option>
              </select>

              {/* Reset Button */}
              <button
                onClick={resetFilters}
                className="w-full md:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {paginatedProducts.length} of {filteredProducts.length} products
          </p>
          <div className="hidden md:block">
            <select
              className="px-3 py-1 border border-gray-300 rounded"
              value={itemsPerPage}
              onChange={(e) => setCurrentPage(0)}
            >
              <option value="8">8 per page</option>
              <option value="12">12 per page</option>
              <option value="16">16 per page</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No products found</h2>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
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
              const isInWishlist = wishlist.some((w) => w.id === item.id);

              return (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                >
                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={() =>
                      isInWishlist
                        ? removeFromWishlist(item.id)
                        : addToWishlist(item)
                    }
                    className={`absolute top-3 right-3 z-10 p-2 rounded-full ${
                      isInWishlist
                        ? "bg-red-100 text-red-500"
                        : "bg-white text-gray-400"
                    } shadow hover:bg-red-100 hover:text-red-500 transition-colors`}
                  >
                    <FaHeart size={16} />
                  </button>

                  {/* Product Image */}
                  <div className="relative pt-[100%] bg-gray-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="absolute top-0 left-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-2">{item.category}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 fill-current ${
                              i < 4 ? "text-yellow-400" : "text-gray-300"
                            }`}
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-500 text-xs ml-1">(24)</span>
                    </div>

                    {/* Price */}
                    <div className="mt-auto">
                      <p className="text-xl font-bold text-gray-900">₹{item.price}</p>
                      <Link
                        to={`/products/${item.id}`}
                        className="mt-3 inline-block w-full py-2 text-center bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
         {pageCount > 1 && (
        <div className="flex justify-center mt-8">
          <ReactPaginate
            previousLabel={"← Prev"}
            nextLabel={"Next →"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"flex gap-2 text-sm"}
            pageClassName={"px-3 py-1 border rounded"}
            activeClassName={"bg-black text-white"}
            previousClassName={"px-3 py-1 border rounded"}
            nextClassName={"px-3 py-1 border rounded"}
            breakLabel={"..."}
            breakClassName={"px-3 py-1"}
            forcePage={currentPage}
          />
        </div>
        )}
      </div>
    </div>
  );
};

export default Products;