import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [isLogout, setIsLogout] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function logout() {
    localStorage.removeItem("token");
    setIsLogout(!isLogout);
    setIsMenuOpen(false); // Close menu on logout
    setTimeout(() => navigate("/"), 2000);
  }

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="header-title">Leave Tracker</div>

        {/* Mobile menu button */}
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <span className="menu-icon">☰</span>
        </button>

        <nav className={`header-links ${isMenuOpen ? "active" : ""}`}>
          <Link to="/emp-dashboard" onClick={() => setIsMenuOpen(false)}>
            Dashboard
          </Link>
          <Link to="/my-leaves" onClick={() => setIsMenuOpen(false)}>
            My Leaves
          </Link>
          <Link to="/my-profile" onClick={() => setIsMenuOpen(false)}>
            My Profile
          </Link>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </nav>
      </div>
      {isLogout && (
        <div className="logout-pop-up">
          <h4>Logout Successful</h4>
        </div>
      )}
    </header>
  );
};

export default Header;
