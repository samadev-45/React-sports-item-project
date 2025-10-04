import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";

const AdminProducts = () => {
  const [products, setProducts] = useState([]); // Full product list
  const [filteredProducts, setFilteredProducts] = useState([]); // After search/filter
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch all products safely
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      console.log("API Response:", res.data); // Debug API response

      // Make sure we always have an array
      const productsArray = Array.isArray(res.data.data) ? res.data.data : [];
      setProducts(productsArray);
      setFilteredProducts(productsArray);
    } catch (err) {
      toast.error("Failed to fetch products");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle delete confirmation
  const confirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      await api.delete(`/products/${selectedProduct.id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product");
      console.error(err);
    } finally {
      setSelectedProduct(null);
    }
  };

  // Debounced search & filter
  const handleSearch = debounce((term) => {
    let filtered = Array.isArray(products) ? products : [];
    if (term) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(term.toLowerCase())
      );
    }
    if (categoryFilter && categoryFilter !== "All") {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, 300);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, categoryFilter, products]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = Array.isArray(filteredProducts)
    ? filteredProducts.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = Math.ceil(
    Array.isArray(filteredProducts) ? filteredProducts.length : 0
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">Manage Products</h2>
        <div className="flex flex-col sm:flex-row gap-4">
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
          <Link
            to="/admin/products/add"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Product Grid */}
      {currentProducts.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-md rounded-lg overflow-hidden border hover:shadow-xl transition-shadow"
              >
                {/* Main Image */}
                <div className="flex justify-center items-center h-40 bg-white">
                  <img
                    src={product.imagesBase64?.[0] || "/placeholder.png"}
                    alt={product.name}
                    className="h-full object-contain"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                  <p className="text-green-600 font-bold mb-3">₹{product.price}</p>

                  {/* Thumbnail Gallery */}
                  <div className="flex gap-2 mb-3">
                    {product.imagesBase64?.slice(0, 3).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`thumb-${idx}`}
                        className="w-12 h-12 object-cover rounded border"
                      />
                    ))}
                    {product.imagesBase64?.length > 3 && (
                      <span className="text-xs text-gray-500 self-center">
                        +{product.imagesBase64.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/products/edit/${product.id}`}
                      className="flex-1 bg-blue-600 text-white text-center py-1 rounded hover:bg-blue-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="flex-1 bg-black text-white py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-6 gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-2">Confirm Deletion</h2>
            <p className="mb-4">
              Are you sure you want to delete <b>{selectedProduct.name}</b>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
