import React from 'react';
import './Features.css'; // Create this CSS file for styling

const Features = () => {
  return (
    <div className="features">
      <h1>Features of Formalyze</h1>
      <p>
        Formalyze leverages AI to generate insightful questions tailored to your form's purpose. 
        Explore our key features:
      </p>
      <ul>
        <li>AI-Driven Question Generation</li>
        <li>Response Analysis and Visualization</li>
        <li>Customizable Form Templates</li>
        <li>User-Friendly Interface</li>
        <li>Data Export and Integration Options</li>
      </ul>
    </div>
  );
};

export default Features;