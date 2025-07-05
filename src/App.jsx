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
            <PrivateRoute>
              <Layout>
                <LandingPage />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Layout>
                <Products />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/products/:id"
          element={
            <PrivateRoute>
              <Layout>
                <ProductDetails />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Layout>
                <Cart />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <PrivateRoute>
              <Layout>
                <Wishlist />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/orders" element={<Orders/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
