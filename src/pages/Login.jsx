import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import Input from "../components/Input";
import Button from "../components/Button";
import { AuthContext } from "../context/MyContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      return toast.warning("All fields are required.");
    }

    try {
      const res = await api.get(`/users?email=${email}&password=${password}`);

      if (res.data.length === 0) {
        return toast.error("Invalid email or password.");
      }

      const user = res.data[0];

      if (user.isBlock) {
        return toast.error("User is blocked. Contact support.");
      }

      setUser(user);
      localStorage.setItem("user", JSON.stringify(res.data[0]));
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
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
          <div style={{display:'flex', justifyContent:"space-between",alignItems:"center"}}>
            <Button text="Login" type="submit" />
            <label
              style={{ textAlign: "end",fontWeight:"bold", color:"red "}}
              onClick={() => navigate("/signup")}
            >
              Signup?
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
