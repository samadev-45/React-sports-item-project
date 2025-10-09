import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [newImages, setNewImages] = useState([]);

  // Fetch product details
  const fetchProduct = async () => {
    try {
      const res = await api.get(`/Products/${id}`);
      console.log(res.data)
      const dataArray = res.data.data;
      const data = Array.isArray(dataArray) ? dataArray[0] : dataArray;

      setProduct({
        ...data,
        imagesBase64: data.imagesBase64 || [],
        imagesIds: data.imagesIds || [],
      });

      setName(data.name || "");
      setPrice(data.price || "");
      setCategory(data.category || "");
      setDescription(data.description || "");
    } catch (err) {
      console.error("Fetch product error:", err.response || err);
      toast.error("Failed to load product");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Handle new image selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
  };

  // Remove an existing image
const handleDeleteImage = async (index) => {
  try {
    const imageId = product.imagesIds?.[index];
    console.log(imageId)
    if (!imageId) {
      toast.error("Cannot delete this image");
      return;
    }

    const res = await api.delete(`/Products/${id}/images/${imageId}`);

    if (res.status === 200 || res.status === 204) {
      toast.success("Image deleted successfully!");

      setProduct((prev) => ({
        ...prev,
        imagesBase64: prev.imagesBase64.filter((_, i) => i !== index),
        imagesIds: prev.imagesIds.filter((_, i) => i !== index),
      }));
    } else {
      toast.error("Server did not confirm deletion");
    }
  } catch (err) {
    console.error("Delete image error:", err.response || err);
    toast.error(err.response?.data?.message || "Failed to delete image");
  }
};


  // Submit updated product
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Price", price);
    formData.append("Category", category);
    formData.append("Description", description);

    // Send existing image IDs (only remaining ones)
    product.imagesIds?.forEach((id) =>
      formData.append("ExistingImagesIds", id)
    );

    // Send new images
    newImages.forEach((file) => formData.append("Images", file));

    // Debug: check FormData
    // for (let pair of formData.entries()) console.log(pair[0], pair[1]);

    const res = await api.put(`/Products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("Product updated successfully!");
    setNewImages([]);
    fetchProduct(); // Refresh product
  } catch (err) {
    console.error("Update product error:", err.response || err);
    toast.error("Failed to update product");
  }
};


  if (!product)
    return <div className="p-6 text-center">Loading product...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        {/* Existing Images */}
        <div className="flex flex-wrap gap-2 mt-2">
          {product.imagesBase64?.map((imgBase64, idx) => (
            <div key={idx} className="relative">
              <img
                src={`data:image/jpeg;base64,${imgBase64}`}
                alt={`Product ${idx}`}
                className="w-24 h-24 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => handleDeleteImage(idx)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Add New Images */}
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="border px-3 py-2 rounded mt-2"
        />
        {newImages.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {newImages.map((img, idx) => (
              <span key={idx} className="text-sm bg-gray-200 px-2 py-1 rounded">
                {img.name}
              </span>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="bg-black text-white py-2 rounded hover:bg-gray-800 mt-2"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
