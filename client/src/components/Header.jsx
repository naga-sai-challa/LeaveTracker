import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Header.css"; // Make sure this file exists

const Header = () => {
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
        <div className="header-title">Leave Tracker</div>
        <nav className="header-links">
          <Link to="/emp-dashboard">Dashboard</Link>
          <Link to="/my-leaves">My Leaves</Link>
          <Link to="/my-profile">My Profile</Link>
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

export default Header;
