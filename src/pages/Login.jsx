import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../context/MyContext";
import api from "../services/api";
import { useAdmin } from "../context/AdminContext";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const { setAdmin } = useAdmin();
  const navigate = useNavigate();

  // ✅ Validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // ✅ Form submission logic
  const handleSubmit = async (values, { setSubmitting }) => {
    const { email, password } = values;
    setSubmitting(true);

    try {
      const res = await api.get(`/users?email=${email}&password=${password}`);
      if (res.data.length > 0) {
        const user = res.data[0];

        if (user.role === "admin") {
          setAdmin(user); // set context
          localStorage.setItem("adminId", user.id); // ✅ store only ID
          toast.success("Welcome, Admin!");
          navigate("/admin/dashboard");
        } else {
          setUser(user); // set context
          localStorage.setItem("userId", user.id); // ✅ store only ID
          toast.success("Login successful!");
          navigate("/");
        }
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed");
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
