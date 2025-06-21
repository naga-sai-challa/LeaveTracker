import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../Styles/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    checkbox: "",
  });
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        formData
      );
      localStorage.setItem("token", response.data.token);

      if (formData.checkbox && response.data.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/emp-dashboard");
      }
    } catch (error) {
      //alert(error.response?.data?.message || "Login failed");
      setMessage(error.response.data.message);
    }
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Employee Login</h2>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />
        <label>
          <input
            type="checkbox"
            name="checkbox"
            checked={formData.checkbox}
            onChange={(e) =>
              setFormData({ ...formData, checkbox: e.target.checked })
            }
          />
          Login as Admin
        </label>

        <button type="submit">Login</button>
        <p className="msg">{message}</p>
        <Link to="/" className="home-link">
          ← Back to Home
        </Link>
      </form>
    </div>
  );
};

export default Login;
