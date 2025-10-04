import { useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  // Handle multiple file selection
  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !category || !description || images.length === 0) {
      toast.error("Please fill all fields and select at least one image!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Name", name);
      formData.append("Price", price);
      formData.append("Category", category);
      formData.append("Description", description);

      // Append multiple images
      images.forEach((img) => {
        formData.append("Images", img);
      });

      const res = await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product added successfully!");
      // Reset form
      setName("");
      setPrice("");
      setCategory("");
      setDescription("");
      setImages([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product. Check console for details.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
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
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="border px-3 py-2 rounded"
        />
        {images.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {images.map((img, idx) => (
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
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
