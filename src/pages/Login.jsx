

// import { useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { AuthContext } from "../context/MyContext";

// const Login = () => {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const validationSchema = Yup.object({
//     email: Yup.string().email("Invalid email").required("Email is required"),
//     password: Yup.string().required("Password is required"),
//   });

//   const handleSubmit = async (values, { setSubmitting }) => {
//     setSubmitting(true);
//     try {
//       const result = await login(values.email, values.password);
//       if (result.success) {
//         const user = result.data;
//         toast.success(user.role === "admin" ? "Welcome, Admin!" : "Login successful!");
//         navigate(user.role === "admin" ? "/admin/dashboard" : "/");
//       } else {
//         toast.error("Invalid credentials or blocked account!");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       toast.error("Login failed. Please try again.");
//     }
//     setSubmitting(false);
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Left Side - Form */}
//       <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-10">
//         <div className="w-full max-w-md">
//           <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">WELCOME BACK</h2>
//           <p className="text-gray-500 mb-6 text-center">Please enter your details to sign in</p>

//           <Formik
//             initialValues={{ email: "", password: "" }}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ isSubmitting }) => (
//               <Form className="space-y-5">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Email</label>
//                   <Field
//                     type="email"
//                     name="email"
//                     placeholder="Enter your email"
//                     className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
//                   />
//                   <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Password</label>
//                   <Field
//                     type="password"
//                     name="password"
//                     placeholder="Enter your password"
//                     className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
//                   />
//                   <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
//                 </div>

                

//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold"
//                 >
//                   {isSubmitting ? "Logging in..." : "Sign In"}
//                 </button>

                

//                 <p className="text-center text-gray-500 text-sm mt-2">
//                   Don't have an account?{" "}
//                   <span
//                     className="text-red-600 cursor-pointer font-semibold"
//                     onClick={() => navigate("/signup")}
//                   >
//                     Sign up
//                   </span>
//                 </p>
//               </Form>
//             )}
//           </Formik>
//         </div>
//       </div>

//       {/* Right Side - Illustration */}
//       <div
//         className="hidden md:flex md:w-1/2 bg-red-600 justify-center items-center"
//         style={{
//           backgroundImage: `url('/sport-illustration.png')`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       ></div>
//     </div>
//   );
// };

// export default Login;
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../context/MyContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      const result = await login(values.email, values.password);
      if (result.success) {
        const user = result.data;
        toast.success(user.role === "admin" ? "Welcome, Admin!" : "Login successful!");
        navigate(user.role === "admin" ? "/admin/dashboard" : "/");
      } else {
        toast.error("Invalid credentials or blocked account!");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Side Image */}
      <div
        className="hidden md:flex md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: "url('/bgimage1.png')",
        }}
      ></div>

      {/* Right Side Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Welcome Back
          </h2>
          <p className="text-gray-500 mb-6 text-center">
            Please enter your details to sign in
          </p>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold"
                >
                  {isSubmitting ? "Logging in..." : "Sign In"}
                </button>

                <p className="text-center text-gray-500 text-sm mt-3">
                  Don't have an account?{" "}
                  <span
                    className="text-red-600 cursor-pointer font-semibold"
                    onClick={() => navigate("/signup")}
                  >
                    Sign up
                  </span>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Right Side Image (Optional) */}
      <div
        className="hidden md:flex md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: "url('/bgimga1.png')",
        }}
      ></div>
    </div>
  );
};

export default Login;
