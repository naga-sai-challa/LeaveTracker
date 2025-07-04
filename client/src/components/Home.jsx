import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Stack,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const features = [
  {
    icon: "📝",
    title: "Apply Leave",
    description:
      "Employees can easily apply for different types of leaves through a simple form.",
  },
  {
    icon: "📅",
    title: "Track My Leaves",
    description:
      "View all your leave applications and their current approval status.",
  },
  {
    icon: "🏖️",
    title: "Track Holidays",
    description:
      "Access the list of official holidays and plan your leaves accordingly.",
  },
  {
    icon: "✅",
    title: "Approve Leaves",
    description:
      "Admins can approve or reject leave requests submitted by employees.",
  },
  {
    icon: "👥",
    title: "Approve Employees",
    description: "Admins can review and approve new employee account requests.",
  },
  {
    icon: "🧑‍💼",
    title: "Manage My Profile",
    description:
      "Employees can manage their contact details, address, and personal info.",
  },
];

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f0fdf4",
        fontFamily: "'Segoe UI', sans-serif",
        color: "#1a1a1a",
      }}
    >
      {/* Header */}
      <Box
        component="header"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          px: { xs: 3, sm: 5 },
          py: 3,
          backgroundColor: "white",
          borderBottom: "2px solid #d4f1d7",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#2e7d32",
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          Foundation Finance Company
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ width: { xs: "100%", sm: "auto" }, alignItems: "center" }}
        >
          <Link to="/login" style={{ width: "100%" }}>
            <Button
              fullWidth={isMobile}
              variant="contained"
              sx={{
                backgroundColor: "#4ade80",
                color: "white",
                "&:hover": { backgroundColor: "#22c55e" },
              }}
            >
              Login
            </Button>
          </Link>
          <Link to="/register" style={{ width: "100%" }}>
            <Button
              fullWidth={isMobile}
              variant="contained"
              sx={{
                backgroundColor: "#4ade80",
                color: "white",
                "&:hover": { backgroundColor: "#22c55e" },
              }}
            >
              Register
            </Button>
          </Link>
        </Stack>
      </Box>

      {/* Main Section */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          px: 2,
          py: { xs: 6, md: 10 },
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: "#1b5e20",
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            mb: 2,
          }}
        >
          Streamlining Your Leave Management
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "#4b4b4b",
            fontSize: { xs: "1.1rem", sm: "1.3rem" },
          }}
        >
          Effortless. Transparent. Organized.
        </Typography>
      </Box>

      {/* Feature Cards */}
      <Box sx={{ backgroundColor: "#f5fdf7", py: 5 }}>
        <Container maxWidth="lg">
          <Grid container spacing={5}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={3}
                  sx={{
                    borderRadius: "16px",
                    p: { xs: 2, sm: 3 },
                    height: "100%",
                    width: "100%",
                    maxWidth: "350px",
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      fontSize: 36,
                      mb: 2,
                      display: "inline-flex",
                      backgroundColor: "#f0fdf4",
                      color: "#2e7d32",
                      padding: 1.5,
                      borderRadius: "50%",
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#1f2937", mb: 1 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography sx={{ color: "#4b5563", fontSize: 15 }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
