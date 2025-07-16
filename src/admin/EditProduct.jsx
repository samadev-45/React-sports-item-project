
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../services/api";
import { toast } from "react-toastify";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setInitialValues(res.data))
      .catch(() => toast.error("Failed to load product"));
  }, [id]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Product name is required"),
    price: Yup.number().typeError("Must be a number").required("Price is required"),
    category: Yup.string().required("Category is required"),
    image: Yup.string().url("Invalid URL").required("Image URL is required"),
    description: Yup.string().required("Description is required"),
  });

  const handleSubmit = async (values) => {
    try {
      await api.patch(`/products/${id}`, values);
      toast.success("Product updated");
      navigate("/admin/products");
    } catch {
      toast.error("Update failed");
    }
  };

  if (!initialValues) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
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
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update Product
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default EditProduct;
