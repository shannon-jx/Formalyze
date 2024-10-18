import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); 
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); 
  }, [auth]);

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">
          <img className="w-[20px]" src="/assets/common/logo_without_slogan.jpg" alt="Logo" />
        </div>
        <ul className="nav-list">
          <li className="nav-item"><a href="/home">Home</a></li>
          <li className="nav-item"><a href="/features">Features</a></li>
          <li className="nav-item"><a href="/pricing">Pricing</a></li>
          <li className="nav-item"><a href="/contact">Contact Us</a></li>
          <li className="nav-item"><a href="/faq">FAQ</a></li>
        </ul>

        {user ? (
          <div className="user-info">
            <span className="user-name">Hello, {user.displayName || 'User'}</span>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;