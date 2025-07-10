// src/pages/AddProduct.jsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

const AddProduct = () => {
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    price: "",
    category: "",
    image: "",
    description: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Product name is required"),
    price: Yup.number().typeError("Must be a number").required("Price is required"),
    category: Yup.string().required("Category is required"),
    image: Yup.string().url("Invalid URL").required("Image URL is required"),
    description: Yup.string().required("Description is required"),
  });

  const handleSubmit = async (values) => {
    try {
      await api.post("/products", values);
      toast.success("Product added successfully");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="space-y-4">
          {["name", "price", "category", "image", "description"].map((field) => (
            <div key={field}>
              <Field
                name={field}
                placeholder={`Enter ${field}`}
                className="w-full p-2 border rounded"
              />
              <ErrorMessage name={field} component="div" className="text-red-500 text-sm" />
            </div>
          ))}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded hover:bg-green-600"
            >
              Add Product
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default AddProduct;
