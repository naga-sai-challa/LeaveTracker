import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      console.log("Form submitted:", formData);
      try {
        const response = await axios.post(
          "http://localhost:5000/auth/register",
          formData
        );
        console.log(response.data);
        setMessage(response.data.message);
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          address: "",
        });
        setInterval(() => setMessage(""), 2000);
      } catch (error) {
        console.log(error.response.data.message);
        setMessage(error.response.data.message);
      }
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box component="form"
        
        sx={{
          width: "100%",
          maxWidth: { xs: "90%", sm: "400px" },
          borderRadius: 2,
          boxShadow: 4,
          padding: { xs: 5, sm: 4 },
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={"bold"} textAlign={"center"}>
            Register
          </Typography>
          <TextField
            type="text"
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
          {errors.name && <Typography>{errors.name}</Typography>}
          <TextField
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <TextField
            type="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <TextField
            type="tel"
            name="phone"
            label="Phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            name="address"
            value={formData.address}
            onChange={handleChange}
            label="Address"
          />
          <Button variant="contained" style={{ backgroundColor: "#4ade80" }}  onClick={handleSubmit}>
            Register
          </Button>
          <Typography>{message}</Typography>
          <Typography textAlign={"center"}>
            <Link to="/">← Back to Home</Link>
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default Register;