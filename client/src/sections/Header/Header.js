import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import LoginOverlay from './LoginOverlay';

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

  const [showLoginOverlay, setShowLoginOverlay] = useState(false);

  const handleLoginClick = () => {
    setShowLoginOverlay(true);
  };

  const closeOverlay = () => {
    setShowLoginOverlay(false);
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">
          <img className="w-[20px]" src="/assets/common/logo_word.png" alt="Logo" />
        </div>
        <ul className="nav-list">
          <li className="nav-item"><Link to="/home">Home</Link></li>
          <li className="nav-item"><Link to="/features">Features</Link></li>
          <li className="nav-item"><Link to="/pricing">Pricing</Link></li>
          <li className="nav-item"><Link to="/contact">Contact Us</Link></li>
          <li className="nav-item"><Link to="/faq">FAQ</Link></li>
          <li className="nav-item"><Link to="/forms">Forms</Link></li>
          <li className="nav-item"><Link to="/dashboard">Dashboard</Link></li>
        </ul>

        {user ? (
          <div className="user-info">
            <span className="user-name">Hello, {user.displayName || 'User'}</span>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          
            <button className="login-button" onClick={handleLoginClick}>Login</button>
        )}
      </nav>

      {showLoginOverlay && <LoginOverlay closeOverlay={closeOverlay} />}
    </header>
  );
};

export default Header;