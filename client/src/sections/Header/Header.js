import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { db } from '../firebase';


const Header = () => {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">
          <img className="w-[20px]" src="assets/common/logo_without_slogan.jpg" alt="Logo" />
        </div>
        <ul className="nav-list">
          <li className="nav-item"><Link to="/home">Home</Link></li>
          <li className="nav-item"><Link to="/features">Features</Link></li>
          <li className="nav-item"><Link to="/pricing">Pricing</Link></li>
          <li className="nav-item"><Link to="/contact">Contact Us</Link></li>
          <li className="nav-item"><Link to="/faq">FAQ</Link></li>
          <li className="nav-item"><Link to="/surveys">Surveys</Link></li> {/* Added Surveys link */}
        </ul>
        <Link to="/login">
          <button className="login-button">Login</button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
