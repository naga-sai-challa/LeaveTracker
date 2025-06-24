import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Header.css"; // Make sure this file exists

const AdminHeader = () => {
  const navigate = useNavigate();
  const [isLogout, setIsLogout] = useState(false);

  function logout() {
    localStorage.removeItem("token");
    setIsLogout(!isLogout);
    setTimeout(() => navigate("/"), 3000);
  }

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="header-title">Admin DashBoard</div>
        <nav className="header-links">
          <Link to="/admin-dashboard">Dashboard</Link>
          <Link to="/admin-leaves">My Leaves</Link>
          <Link to="/get-pending-leaves">Get Pending Leaves</Link>
          <Link to="/manage-emp">Employees</Link>
          <Link to="/admin-profile">My Profile</Link>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </nav>
      </div>
      {isLogout && (
        <div className="logout-pop-up">
          <h4>Logout SuccessFull</h4>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
