import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ React Router hook
import kycService from "../../services/kycService";
import "./logIn.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await kycService.login(email, password);
      setMessage(response.message || "Login successful!");

      if (response.success) {
        // ✅ redirect to /admin
        navigate("/admin");
      }
    } catch (error) {
      setMessage(error.message || "Login failed.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">KYC Login</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button">
            Login
          </button>

          {message && (
            <p
              className={
                message.toLowerCase().includes("success")
                  ? "success-msg"
                  : "error-msg"
              }
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
