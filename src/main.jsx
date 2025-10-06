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
import { AdminProvider } from "./context/AdminContext";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    
      <AdminProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <App />
              <ToastContainer position="center" autoClose={2000} />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </AdminProvider>
    
  </StrictMode>
);
