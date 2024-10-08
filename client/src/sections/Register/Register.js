import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from './firebase';

const Register = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // if (credentials.password !== credentials.confirmPassword) {
    //   alert('Passwords do not match!');
    //   return;
    // }

    // try {
    //   const userCredential = await createUserWithEmailAndPassword(
    //     auth,
    //     credentials.email,
    //     credentials.password
    //   );
    //   console.log('Registration successful:', userCredential);
    //   alert('Registration successful!');
    // } catch (error) {
    //   console.error('Error during registration:', error);
    //   alert('Error during registration: ' + error.message);
    // }
  };


  return (
    <div className="register">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="register-form">
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
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={credentials.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">Register</button>
      </form>
      <div className="additional-links">
        <p className="login-prompt">Already have an account? 
          <Link to="/login" className="login-link"> Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;