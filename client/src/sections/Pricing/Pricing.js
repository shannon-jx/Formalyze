import React from 'react';
import './Pricing.css';

const Pricing = () => {
  return (
    <div className="pricing">
      <h1>Pricing Plans</h1>
      <p>Choose the plan that suits your needs best.</p>
      <div className="pricing-plans">
        <div className="plan">
          <h2>Basic Plan</h2>
          <p>$10/month</p>
          <ul>
            <li>Access to basic features</li>
            <li>10 forms per month</li>
            <li>Email support</li>
          </ul>
          <button className="btn">Sign Up</button>
        </div>
        <div className="plan">
          <h2>Pro Plan</h2>
          <p>$30/month</p>
          <ul>
            <li>Access to all features</li>
            <li>Unlimited forms</li>
            <li>Priority email support</li>
          </ul>
          <button className="btn">Sign Up</button>
        </div>
        <div className="plan">
          <h2>Enterprise Plan</h2>
          <p>Contact Us</p>
          <ul>
            <li>Custom solutions</li>
            <li>Dedicated account manager</li>
            <li>Phone and email support</li>
          </ul>
          <button className="btn">Contact Us</button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;