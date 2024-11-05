import React, { useEffect, useRef, useState } from 'react';
import useTypewriter from './useTypewriter';
import './Home.css';
import Lenis from '@studio-freight/lenis';

const Home = () => {
  const phrases = ["Surveys", "Data", "Analysis"];
  const prefix = "Better ";
  const typedText = useTypewriter(prefix, phrases);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function animate(time) {
      lenis.raf(time);
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="app-container">
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero">
          <p className="typewriter">
            <span>{typedText}</span>
            <span className="blinking-cursor">|</span>
          </p>
          <img className="w-[20px]" src="/assets/common/iPhone14.svg" alt="Mockup" />
          <div className="cta">
            <p className="subtext">Welcome to the future of surveying</p>
            <p className="description">
              Transform the way you collect data. Our AI generates questions tailored to your form's purpose, asks further questions, and provides deep insights with built-in response and data analysis.
            </p>
            <button className="create-form-btn-large">Create Your First Form</button>
          </div>
        </section>

        {/* Steps Section */}
        <section className="steps">
          <div className="step">
            <div className="step-number">01</div>
            <div className="step-title">Define Your Purpose</div>
            <p className="step-des">Simply tell us the goal of your form, and our AI will handle the rest.</p>
          </div>

          <div className="step">
            <div className="step-number">02</div>
            <div className="step-title">Gather Quality Data</div>
            <p className="step-des">Our AI asks further, extensive questions, extracting more information from respondents.</p>
          </div>

          <div className="step">
            <div className="step-number">03</div>
            <div className="step-title">Gain Deeper Insights</div>
            <p className="step-des">Get real-time insights and in-depth analysis of the responses with our built-in data tools.</p>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <h2 className="features-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3 className="feature-title">Prompt Further Engagement</h3>
              <p className="feature-description">
                Our intelligent system automatically prompts users with follow-up questions based on their answers, ensuring deeper engagement and richer data collection.
              </p>
            </div>
            <div className="feature-card">
              <h3 className="feature-title">In-Depth Dashboard Analysis</h3>
              <p className="feature-description">
                Gain actionable insights through our advanced dashboard analytics, designed to transform raw data into meaningful information that drives decisions.
              </p>
            </div>
            <div className="feature-card">
              <h3 className="feature-title">AI-Generated Questions</h3>
              <p className="feature-description">
                Tailor your surveys with AI-generated questions that align with the purpose of your form, making data collection effortless and precise.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
