import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>Welcome to Formalyze</h1>
        <p>
          Transform the way you collect data. Our AI generates questions tailored to your form's purpose, with built-in response and data analysis.
        </p>
        <button className="cta-button">Get Started for Free</button>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2>How Formalyze Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <h3>1. Define Your Purpose</h3>
            <p>
              Simply tell us the goal of your form, and our AI will handle the rest.
            </p>
          </div>
          <div className="step-card">
            <h3>2. AI-Generated Questions</h3>
            <p>
              Based on your form's purpose, our AI will instantly generate relevant, optimized questions.
            </p>
          </div>
          <div className="step-card">
            <h3>3. Analyze Responses</h3>
            <p>
              Get real-time insights and in-depth analysis of the responses with our built-in data tools.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>AI-Powered Question Generation</h3>
            <p>
              Create the perfect set of questions with AI tailored to your goals.
            </p>
          </div>
          <div className="feature-card">
            <h3>Real-Time Response Analysis</h3>
            <p>
              Get valuable insights and feedback as soon as responses are submitted.
            </p>
          </div>
          <div className="feature-card">
            <h3>Comprehensive Data Analysis</h3>
            <p>
              Our advanced analytics tools help you make informed decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2>Ready to Create Smarter Forms?</h2>
        <p>Sign up now and revolutionize how you collect data.</p>
        <button className="cta-button">Get Started</button>
      </section>
    </div>
  );
};

export default Home;