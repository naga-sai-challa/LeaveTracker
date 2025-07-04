import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Button,
  Box,
  Checkbox,
  TextField,
  Typography,
  FormControlLabel,
  Stack,
} from "@mui/material";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    checkbox: false,
  });
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(formData);
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
      console.log(error);
      setMessage(error.response?.data?.message || "Login failed");
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: { xs: "90%", sm: "400px" },
          backgroundColor: "white",
          p: { xs: 3, sm: 4 },
          borderRadius: 2,
          boxShadow: 4,
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h5" textAlign="center" fontWeight="bold">
            Employee Login
          </Typography>

          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
          />

          <FormControlLabel
            control={
              <Checkbox
                name="checkbox"
                checked={formData.checkbox}
                onChange={handleChange}
              />
            }
            label="Login As Admin"
          />

          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "#4ade80" }}
          >
            Login
          </Button>

          {message && (
            <Typography color="error" fontSize={14} textAlign="center">
              {message}
            </Typography>
          )}

          <Link
            to="/"
            style={{ textAlign: "center", color: "#1e293b", fontSize: "14px" }}
          >
            ← Back to Home
          </Link>
        </Stack>
      </Box>
    </Box>
  );
};

export default Login;
