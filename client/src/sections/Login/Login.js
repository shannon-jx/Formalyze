import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from './firebase';

import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in:', userCredential.user);
      setError('');
      // Redirect to another page or update UI based on sign-in status
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
        </div>
        <button type="submit" className="submit-button">Login</button>
      </form>
      <div className="additional-links">
        <p className="signup-prompt">Already have an account?  
          <Link to="/sign-up" className="signup-link"> Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;