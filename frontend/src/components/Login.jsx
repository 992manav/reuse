import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "./Auth.css";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Logging in with:", formData);

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      console.log("Login response status:", res.status);
      console.log("Login response data:", data);

      if (!res.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log("Token and user saved to localStorage");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setLoading(true);
    setError("");

    console.log("Google credential received:", credentialResponse);

    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Decoded Google token:", decoded);

      const res = await fetch("http://localhost:8080/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();

      console.log("Google login response status:", res.status);
      console.log("Google login response data:", data);

      if (!res.ok) {
        setError(data.message || "Google login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log("Google token and user saved to localStorage");
      navigate("/dashboard");
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <Link to="/" className="auth-logo">
          ReWear
        </Link>
        <h2>Sign In</h2>
        <p>
          Don’t have an account?{" "}
          <Link to="/signup" className="auth-link">
            Sign up
          </Link>
        </p>
      </div>

      <div className="auth-form-wrapper">
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? "Please wait..." : "Sign In"}
          </button>
        </form>

        <div className="google-login-wrapper">
          <p style={{ textAlign: "center", margin: "1rem 0" }}>or</p>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              console.error("Google login failed callback");
              setError("Google login failed");
            }}
          />
        </div>
      </div>
    </div>
  );
}
