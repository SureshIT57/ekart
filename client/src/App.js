import React from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import { CartProvider, useCart } from "./CartContext";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}

function Nav() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  return (
    <div className="nav">
      <NavLink className="brand" to="/">
        Ekart
      </NavLink>
      <div className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink className="cart-link" to="/cart">
          Cart
          {count > 0 ? <span className="badge">{count}</span> : null}
        </NavLink>
        {user ? (
          <>
            <NavLink to="/checkout">Checkout</NavLink>
            <NavLink to="/orders">Orders</NavLink>
            <button type="button" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Join</NavLink>
          </>
        )}
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <div className="shop">
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  const basename = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter basename={basename || undefined}>
          <AppRoutes />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
