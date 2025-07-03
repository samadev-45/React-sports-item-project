import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import api from "../services/api";
import Input from "../components/Input";
import Button from "../components/Button";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;

    if (!name || !email || !password) {
      toast.warning("All fields are required.");
      return;
    }

    try {
      const res = await api.get(`/users?email=${email}`);
      if (res.data.length > 0) {
        toast.warning("Email already exists.");
        return;
      }

      const newUser = {
        ...formData,
        role: "user",
        isBlock: false,
        cart: [],
        orders: [],
        wishlist: [],
      };

      await api.post("/users", newUser);
      toast.success("Signup successful!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex" }}>
      <div className="hidden md:flex w-1/2 bg-red-500 justify-center items-center overflow-hidden">
        <img
          src="/img.jpg"
          alt="Signup Illustration"
          className="w-full h-full object-cover"
          />
      </div>

      <div className="flex flex-col justify-center w-full md:w-1/2 px-8 py-12 bg-white">
        <h2 className="text-3xl font-bold mb-2 text-gray-900">Welcome!</h2>
        <p className="mb-6 text-gray-600">Create your account to get started</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          <Button text="Sign up" type="submit" />
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} style={{ color: "red" }}>
            SignIn
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
