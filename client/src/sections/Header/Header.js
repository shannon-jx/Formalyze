import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">
          <img className="w-[20px]" src="assets/common/logo_without_slogan.jpg" alt="Logo" />
        </div>
        <ul className="nav-list">
          <li className="nav-item"><a href="/home">Home</a></li>
          <li className="nav-item"><a href="/features">Features</a></li>
          <li className="nav-item"><a href="/pricing">Pricing</a></li>
          <li className="nav-item"><a href="/contact">Contact Us</a></li>
          <li className="nav-item"><a href="/faq">FAQ</a></li>
        </ul>
        <Link to="/login">
          <button className="login-button">Login</button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
