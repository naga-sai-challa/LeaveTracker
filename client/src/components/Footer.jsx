import React from "react";
import "../Styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          &copy; 2025 Employee Leave Tracker. All rights reserved.
        </p>
        <p className="footer-text">
          Powered by <span className="footer-brand">FFC</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
