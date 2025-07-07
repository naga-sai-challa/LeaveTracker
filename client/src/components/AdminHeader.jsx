import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Drawer,
  Link,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const AdminHeader = () => {
  const navigate = useNavigate();
  const [isLogout, setIsLogout] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    setIsLogout(true);
    setDrawerOpen(false);
    setTimeout(() => navigate("/"), 3000);
  };

  const navLinks = [
    { text: "Dashboard", path: "/admin-dashboard" },
    { text: "My Leaves", path: "/admin-leaves" },
    { text: "Get Pending Leaves", path: "/get-pending-leaves" },
    { text: "Employees", path: "/manage-emp" },
    { text: "My Profile", path: "/admin-profile" },
  ];

  return (
    <header>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          backgroundColor: "#99e699",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Admin Dashboard
        </Typography>

        {/* Hamburger for mobile */}
        <IconButton
          sx={{ display: { xs: "block", sm: "none" } }}
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>

        {/* Desktop links */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            gap: 2,
            alignItems: "center",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.text}
              component={RouterLink}
              to={link.path}
              sx={navLinkStyle}
            >
              {link.text}
            </Link>
          ))}
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={logout}
            sx={{ px: 3 }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Drawer for mobile navigation */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Menu
          </Typography>
          {navLinks.map((link) => (
            <Box key={link.text} sx={{ mb: 1 }}>
              <Link
                component={RouterLink}
                to={link.path}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  display: "block",
                  textDecoration: "none",
                  color: "black",
                  px: 1,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              >
                {link.text}
              </Link>
            </Box>
          ))}
          <Button variant="outlined" fullWidth color="error" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Drawer>

      {isLogout && (
        <Typography
          variant="h5"
          sx={{ mt: 2, textAlign: "center", color: "green" }}
        >
          Logout Successful
        </Typography>
      )}
    </header>
  );
};

// Common link style
const navLinkStyle = {
  p: 1.5,
  textDecoration: "none",
  color: "black",
  borderRadius: 2,
  "&:hover": {
    backgroundColor: "white",
  },
};

export default AdminHeader;
