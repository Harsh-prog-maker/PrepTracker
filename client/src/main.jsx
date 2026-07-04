import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
<Toaster
  position="top-right"
  toastOptions={{
    duration: 2500,
    style: {
      background: "#1f2937",
      color: "#fff",
      borderRadius: "10px",
      padding: "14px",
      fontSize: "14px",
    },

    success: {
      iconTheme: {
        primary: "#22c55e",
        secondary: "#fff",
      },
    },

    error: {
      iconTheme: {
        primary: "#ef4444",
        secondary: "#fff",
      },
    },
  }}
/>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
    path="/dashboard"
    element={
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    }
/>
    </Routes>
  </BrowserRouter>
);