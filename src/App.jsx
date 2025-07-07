import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./User/Signup";
import Login from "./pages/Login";
import Products from "./pages/Products";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import ProductDetails from "./pages/ProductDetails";
import "./App.css";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            
              <Layout>
                <LandingPage />
              </Layout>
            
          }
        />

        <Route
          path="/products"
          element={

              <Layout>
                <Products />
              </Layout>
            
          }
        />

        <Route
          path="/products/:id"
          element={
            
              <Layout>
                <ProductDetails />
              </Layout>
            
          }
        />

        <Route
          path="/cart"
          element={
            
              <Layout>
                <Cart />
              </Layout>
            
          }
        />
        <Route
          path="/wishlist"
          element={
            
              <Layout>
                <Wishlist />
              </Layout>
            
          }
        />
        <Route path="/checkout" element={
          <PrivateRoute>
            <Checkout/>
          </PrivateRoute>
          }/>
        <Route path="/orders" element={
          <PrivateRoute>
            <Orders/>
          </PrivateRoute>
          }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
