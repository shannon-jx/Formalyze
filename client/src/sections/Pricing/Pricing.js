import React from 'react';
import './Pricing.css';

const Pricing = () => {
  return (
    <div className="pricing">
      <h1>Flexible Pricing Plans</h1>
      <p>Choose the plan that best fits your needs and scale as you grow.</p>
      <div className="pricing-plans">
        <div className="plan">
          <h2>Starter Pack</h2>
          <p>5 Credits - $5</p>
          <ul>
            <li>5 additional forms</li>
            <li>Up to 20 responses per form</li>
            <li>Email support</li>
          </ul>
          <button className="btn">Purchase</button>
        </div>
        <div className="plan">
          <h2>Standard Pack</h2>
          <p>10 Credits - $8</p>
          <ul>
            <li>10 additional forms</li>
            <li>Up to 20 responses per form</li>
            <li>Email support</li>
          </ul>
          <button className="btn">Purchase</button>
        </div>
        <div className="plan">
          <h2>Advanced Pack</h2>
          <p>15 Credits - $10</p>
          <ul>
            <li>15 additional forms</li>
            <li>Up to 20 responses per form</li>
            <li>Email support</li>
          </ul>
          <button className="btn">Purchase</button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;