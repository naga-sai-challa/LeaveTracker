// src/router.jsx or AppRouter.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import EmployeeDashboard from "./components/EmployeeDashboard";
import BasicDateCalendar from "./components/BasicDateCalendar";
import MyLeaves from "./components/MyLeaves";
import MyProfile from "./components/MyProfile";
import Layout from "./components/Layout";
import Home from "./components/Home";

function router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route element={<Layout />}>
                    <Route path="/emp-dashboard" element={<EmployeeDashboard />} />
                    <Route path="/calander" element={<BasicDateCalendar />} />
                    <Route path="/my-leaves" element={<MyLeaves />} />
                    <Route path="/my-profile" element={<MyProfile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default router;
