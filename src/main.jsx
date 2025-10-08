import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "tailwindcss";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/MyContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <App />
          <ToastContainer position="top-right" autoClose={2000} newestOnTop/>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
