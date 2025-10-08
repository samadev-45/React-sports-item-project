import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import debounce from "lodash.debounce";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await api.get("/Products"); // fetch all products
      const productsArray = Array.isArray(res.data.data) ? res.data.data : [];
      setProducts(productsArray);
      filterProducts(productsArray, searchTerm, categoryFilter, showDeleted);
    } catch (err) {
      console.error("Fetch products error:", err);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search, category, and deleted flag
  const filterProducts = (productsArray, term, category, showDeletedFlag) => {
    let filtered = productsArray;

    // Filter by deleted/active
    filtered = filtered.filter((p) => (showDeletedFlag ? p.isDeleted : !p.isDeleted));

    // Filter by search term
    if (term) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Filter by category
    if (category && category !== "All") {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  };

  // Handle search/filter changes
  const handleSearch = debounce((term) => {
    filterProducts(products, term, categoryFilter, showDeleted);
  }, 300);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, categoryFilter, products, showDeleted]);

  // Soft Delete / Restore
  const handleDeleteOrRestore = async (product) => {
    try {
      if (!product.isDeleted) {
        await api.delete(`/Products/${product.id}`);
        toast.success("Product deleted (soft delete)");
      } else {
        await api.put(`/Products/restore/${product.id}`);
        toast.success("Product restored");
      }
      fetchProducts();
    } catch (err) {
      console.error("Delete/Restore error:", err);
      toast.error("Operation failed");
    } finally {
      setSelectedProduct(null);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">Manage Products</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input
            type="text"
            placeholder="Search products..."
            className="border border-gray-300 px-4 py-2 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md"
          >
            <option value="All">All Categories</option>
            <option value="football">Football</option>
            <option value="cricket">Cricket</option>
            <option value="basketball">Basketball</option>
            <option value="shoes">Shoes</option>
            <option value="socks">Socks</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
            />
            Show Deleted
          </label>
          <Link
            to="/admin/products/add"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-md rounded-lg overflow-hidden border hover:shadow-xl transition-shadow"
            >
              {/* Image Carousel */}
              <div className="h-40 bg-white">
                {product.imagesBase64 && product.imagesBase64.length > 0 ? (
                  <Swiper
                    modules={[Navigation]}
                    navigation
                    spaceBetween={10}
                    slidesPerView={1}
                    className="h-40"
                  >
                    {product.imagesBase64.map((img, idx) => (
                      <SwiperSlide key={idx}>
                        <img
                          src={`data:image/webp;base64,${img}`}
                          alt={`${product.name}-${idx}`}
                          className="h-40 w-full object-contain"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <img
                    src="/placeholder.png"
                    alt={product.name}
                    className="h-40 w-full object-contain"
                  />
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                <p className="text-green-600 font-bold mb-3">₹{product.price}</p>

                {/* Actions */}
                <div className="flex gap-2">
                  {!product.isDeleted && (
                    <Link
                      to={`/admin/products/edit/${product.id}`}
                      className="flex-1 bg-blue-600 text-white text-center py-1 rounded hover:bg-blue-700"
                    >
                      Edit
                    </Link>
                  )}
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className={`flex-1 ${product.isDeleted ? "bg-yellow-600" : "bg-black"} text-white py-1 rounded hover:opacity-80`}
                  >
                    {product.isDeleted ? "Restore" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-2">
              {selectedProduct.isDeleted ? "Restore Product" : "Delete Product"}
            </h2>
            <p className="mb-4">
              Are you sure you want to <b>{selectedProduct.isDeleted ? "restore" : "delete"}</b> <b>{selectedProduct.name}</b>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteOrRestore(selectedProduct)}
                className={`px-4 py-2 ${selectedProduct.isDeleted ? "bg-green-600 hover:bg-green-800" : "bg-red-600 hover:bg-red-800"} text-white rounded`}
              >
                {selectedProduct.isDeleted ? "Restore" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
