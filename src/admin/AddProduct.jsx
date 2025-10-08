import { useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Cricket");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Handle multiple file selection and preview
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
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
      images.forEach((img) => formData.append("Images", img));

      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product added successfully!");

      // Reset form
      setName("");
      setPrice("");
      setCategory("Cricket");
      setDescription("");
      setImages([]);
      setImagePreviews([]);
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
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="Football">Football</option>
          <option value="Cricket">Cricket</option>
          <option value="Basketball">Basketball</option>
          <option value="Shoes">Shoes</option>
          <option value="Socks">Socks</option>
        </select>
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

        {/* Preview selected images */}
        {imagePreviews.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {imagePreviews.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`preview-${idx}`}
                className="w-20 h-20 object-cover rounded border"
              />
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
