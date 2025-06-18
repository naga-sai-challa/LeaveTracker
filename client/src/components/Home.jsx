import React from 'react';
import { Link } from 'react-router-dom';
import "../Styles/Home.css";

const Home = () => {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1 className="company-name">Foundation Finance Company</h1>
                <div className="auth-buttons">
                    <Link to="/login"><button className="header-btn">Login</button></Link>
                    <Link to="/register"><button className="header-btn">Register</button></Link>
                </div>
            </header>

            <main className="home-main">
                <h2 className="moto-heading">Streamlining Your Leave Management</h2>
                <p className="moto-subtext">Effortless. Transparent. Organized.</p>
            </main>
        </div>
    );
};

export default Home;
