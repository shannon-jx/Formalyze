// sections/NotFound/NotFound.js
import React from 'react';
import './NotFound.css'; // Create this CSS file for styling

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/">Go to Home</a>
    </div>
  );
};

export default NotFound;
