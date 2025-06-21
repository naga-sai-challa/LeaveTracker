import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Home.css";

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
  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="company-name">Foundation Finance Company</h1>
        <div className="auth-buttons">
          <Link to="/login">
            <button className="header-btn">Login</button>
          </Link>
          <Link to="/register">
            <button className="header-btn">Register</button>
          </Link>
        </div>
      </header>

      <main className="home-main">
        <h2 className="moto-heading">Streamlining Your Leave Management</h2>
        <p className="moto-subtext">Effortless. Transparent. Organized.</p>
      </main>

      <section className="feature-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
