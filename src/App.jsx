import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./User/Signup";
import Login from "./pages/Login";
import Home from "./components/Home";
import Products from "./pages/Products";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import "./App.css";
import ProductDetails from "./pages/ProductDetails";

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
                <Home />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
