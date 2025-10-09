import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/MyContext";
import { toast } from "react-toastify";

import Button from "../components/Button";

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  // Yup validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Initial values for form fields
  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  // Form submit function
  const handleSubmit = async (values, { setSubmitting }) => {
  try {
    const res = await register(values);

    if (res.success) {
      toast.success(res.message);
      // ✅ Redirect only when registration is successful
      setTimeout(() => navigate("/login"), 1500);
    } 
    else if (res.exists) {
      // ✅ Email already exists → show toast, stay on page
      toast.warning(res.message);
      // ❌ Do NOT navigate
    } 
    else {
      // ✅ Other errors
      toast.error(res.message);
    }
  } catch (err) {
    toast.error("Something went wrong!");
    console.error(err);
  } finally {
    setSubmitting(false);
  }
};



  return (
    <div style={{ height: "100vh", display: "flex" }}>
      {/* Left side image */}
      <div className="hidden md:flex w-1/2 bg-red-500 justify-center items-center overflow-hidden">
        <img
          src="/img.jpg"
          alt="Signup Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Signup Form */}
      <div className="flex flex-col justify-center w-full md:w-1/2 px-8 py-12 bg-white">
        <h2 className="text-3xl font-bold mb-2 text-gray-900">Welcome!</h2>
        <p className="mb-6 text-gray-600">Create your account to get started</p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
                  Name
                </label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter your name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter your email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter your password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <Button
                type="submit"
                text={isSubmitting ? "Signing up..." : "Sign up"}
              />
            </Form>
          )}
        </Formik>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-red-500 cursor-pointer font-medium"
          >
            SignIn
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
