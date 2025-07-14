import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./admin/AdminPrivateRoute";
import Layout from "./components/Layout";
import AdminLayout from "./admin/AdminLayout";
import "./App.css";
import EditProduct from "./admin/EditProduct";
import AddProduct from "./admin/AddProduct";
import UserDetails from "./admin/UserDetails";

// User Pages
const Signup = lazy(() => import("./User/Signup"));
const Login = lazy(() => import("./pages/Login"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Orders = lazy(() => import("./pages/Orders"));
const Profile = lazy(() => import("./pages/Profile"));

// Admin Pages
const Dashboard = lazy(() => import("./admin/Dashbord"));
const Users = lazy(() => import("./admin/Users"));
const AdminProducts = lazy(() => import("./admin/Products"));
const AdminOrders = lazy(() => import("./admin/Orders"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="text-center mt-10 text-lg">Loading...</div>}>
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

          
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Layout>
                  <Checkout />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Layout>
                  <Orders />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Layout>
                  <Profile />
                </Layout>
              </PrivateRoute>
            }
          />

         
          <Route
            path="/admin"
            element={
              <AdminPrivateRoute>
                <AdminLayout />
              </AdminPrivateRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="/admin/products/add" element={<AddProduct />} />
            <Route path="/admin/users/:id" element={<UserDetails />} />


          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
