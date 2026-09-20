import React from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Users from "./pages/Users";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (user.role !== "admin") {
    return <div className="main">Admin only</div>;
  }
  return children;
}

function Nav() {
  const { logout } = useAuth();
  return (
    <div className="side">
      <div className="brand">Ekart Admin</div>
      <NavLink to="/" end>
        Dashboard
      </NavLink>
      <NavLink to="/products">Products</NavLink>
      <NavLink to="/orders">Orders</NavLink>
      <NavLink to="/users">Users</NavLink>
      <button type="button" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <div className={user ? "shell" : ""}>
      {user ? <Nav /> : null}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Users />
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
      <BrowserRouter basename={basename || undefined}>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
