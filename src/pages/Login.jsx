import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../context/MyContext";
import { useAdmin } from "../context/AdminContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const { setAdmin } = useAdmin();
  const navigate = useNavigate();

  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // Handle login
  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      // Call AuthContext login (which should POST to /Auth/login)
      const result = await login(values.email, values.password);

      if (result?.success) {
        const user = result.data; // assuming your AuthController returns user data
        if (user.role === "admin") {
          // Admin login
          setAdmin(user);
          localStorage.setItem("adminId", user.id);
          toast.success("Welcome, Admin!");
          navigate("/admin/dashboard");
        } else {
          // Normal user login
          toast.success("Login successful!");
          navigate("/");
        }
      } else if (result?.blocked) {
        toast.error("Your account is blocked by admin!");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
    }
    setSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Field
                  type="email"
                  name="email"
                  className="w-full border px-4 py-2 rounded"
                  placeholder="Enter your email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <Field
                  type="password"
                  name="password"
                  className="w-full border px-4 py-2 rounded"
                  placeholder="Enter your password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
                <span
                  className="text-red-600 font-semibold cursor-pointer"
                  onClick={() => navigate("/signup")}
                >
                  Signup?
                </span>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
