import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./admin/AdminPrivateRoute";
import Layout from "./components/Layout";
import AdminLayout from "./admin/AdminLayout";
import "./App.css";

// User Pages
import Signup from "./User/Signup";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";

// Admin Pages
import Dashboard from "./admin/Dashbord";
import Users from "./admin/Users";
import AdminProducts from "./admin/Products";
import AdminOrders from "./admin/Orders";
import EditProduct from "./admin/EditProduct";
import AddProduct from "./admin/AddProduct";
import UserDetails from "./admin/UserDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
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


        {/* Private Routes (User) */}
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

        {/* Private Routes (Admin) */}
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
          <Route path="products/add" element={<AddProduct />} />
          <Route path="users/:id" element={<UserDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
