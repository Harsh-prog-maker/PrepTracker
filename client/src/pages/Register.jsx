import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../assets/logo.svg";
import "../styles/Auth.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/users/register", {
        name,
        email,
        password,
      });

      toast.success("Registration successful! Please login.");

      navigate("/");
    } catch (err) {
      toast.error(
  err.response?.data?.message || "Registration failed"
);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">
  <img src={logo} alt="PrepTracker" className="auth-logo" />

  <form onSubmit={handleRegister}>
    <h1 className="auth-title">PrepTracker</h1>

    <p className="auth-subtitle">
      Your personal coding progress dashboard.
    </p>

    <input
      className="auth-input"
      type="text"
      placeholder="Full Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />

    <input
      className="auth-input"
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      className="auth-input"
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button
      className="auth-btn"
      type="submit"
    >
      Create Account
    </button>
  </form>

  <div className="auth-footer">
    Already have an account?{" "}
    <Link className="auth-link" to="/">
      Login
    </Link>
  </div>
</div>
    </div>
  );
}