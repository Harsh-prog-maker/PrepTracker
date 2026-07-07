import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../assets/logo.svg";
import "../styles/Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
    try {
      const res = await API.post("/users/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      toast.error(
  err.response?.data?.message || "Login failed"
);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">
<img src={logo} alt="PrepTracker" className="auth-logo" />
        <form onSubmit={handleLogin}>

  <h1 className="auth-title">PrepTracker</h1>

  <p className="auth-subtitle">
    Track your coding journey.
  </p>

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
    type="submit"
    className="auth-btn"
  >
    Login
  </button>

</form>
        <div className="auth-footer">
          Don't have an account?{" "}
          <Link className="auth-link" to="/register">
            Register
          </Link>
        </div>

      </div>

    </div>
  );
}