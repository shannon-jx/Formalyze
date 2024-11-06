import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import LoginOverlay from './LoginOverlay';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showLoginOverlay, setShowLoginOverlay] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  const handleLoginClick = () => {
    setShowLoginOverlay(true);
  };

  const closeOverlay = () => {
    setShowLoginOverlay(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const getLinkClassName = (path) => {
    return location.pathname === path ? 'drawer-item active' : 'drawer-item';
  };

  return (
    <header className={`header ${location.pathname}`} >
      <nav className={`navbar ${location.pathname === '/home' ? 'active' : ''}`}>
        {isMobile && (
          <button className="menu-icon" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        )}
        <div className="logo">
          <img className="w-[20px]" src="/assets/common/logo_word.png" alt="Logo" />
        </div>
        {!isMobile && (
          <div className="nav-links">
            <Link className={location.pathname === '/home' ? 'active' : ''} to="/home">Home</Link>
            <Link className={location.pathname === '/pricing' ? 'active' : ''} to="/pricing">Pricing</Link>
            <Link className={location.pathname === '/contact' ? 'active' : ''} to="/contact">Contact Us</Link>
            <Link className={location.pathname === '/faq' ? 'active' : ''} to="/faq">FAQ</Link>
            <Link className={location.pathname === '/dashboard' ? 'active' : ''} to="/dashboard">Dashboard</Link>
          </div>
        )}
        {user ? (
          <div className="user-info">
            {!isMobile && <span className="user-name">Hello, {user.displayName || 'User'}</span>}
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button className="login-button" onClick={handleLoginClick}>Login</button>
        )}
      </nav>
      <div className={`side-drawer ${isMobileMenuOpen ? 'open' : ''}`} ref={drawerRef}>
        <div className="drawer-header">
          <img className="drawer-logo" src="/assets/common/logo_word.png" alt="Logo" />
        </div>
        <ul className="drawer-list">
          <li className={getLinkClassName('/home')}><Link to="/home" onClick={toggleMobileMenu}>Home</Link></li>
          <li className={getLinkClassName('/pricing')}><Link to="/pricing" onClick={toggleMobileMenu}>Pricing</Link></li>
          <li className={getLinkClassName('/contact')}><Link to="/contact" onClick={toggleMobileMenu}>Contact Us</Link></li>
          <li className={getLinkClassName('/faq')}><Link to="/faq" onClick={toggleMobileMenu}>FAQ</Link></li>
          <li className={getLinkClassName('/dashboard')}><Link to="/dashboard" onClick={toggleMobileMenu}>Dashboard</Link></li>
        </ul>
      </div>
      {showLoginOverlay && <LoginOverlay closeOverlay={closeOverlay} />}
    </header>
  );
};

export default Header;
