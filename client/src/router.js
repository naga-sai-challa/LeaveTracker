// src/router.jsx or AppRouter.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import EmployeeDashboard from "./components/EmployeeDashboard";
import BasicDateCalendar from "./components/BasicDateCalendar";
import MyLeaves from "./components/MyLeaves";
import MyProfile from "./components/MyProfile";
import Layout from "./components/Layout";
import Home from "./components/Home";
import GetPedningLeaves from "./components/GetPedningLeaves";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";
import AdminLayout from "./components/AdminLayout";
import AdminProfile from "./components/AdminProfile";
import ManagerEmp from "./components/ManagerEmp";
import AdminLeaves from "./components/AdminLeaves";

function router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route element={<Layout />}>
          <Route path="/emp-dashboard" element={<EmployeeDashboard />} />
          <Route path="/calander" element={<BasicDateCalendar />} />
          <Route path="/my-leaves" element={<MyLeaves />} />
          <Route path="/my-profile" element={<MyProfile />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-leaves" element={<AdminLeaves />} />
          <Route path="/get-pending-leaves" element={<GetPedningLeaves />} />
          <Route path="/admin-profile" element={<AdminProfile />} />
          <Route path="/manage-emp" element={<ManagerEmp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default router;
