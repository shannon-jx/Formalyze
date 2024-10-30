import React, { useEffect, useRef, useState } from 'react';
import useTypewriter from './useTypewriter';
import './Home.css';
import Lenis from '@studio-freight/lenis';

const Home = () => {
  const phrases = ["Surveys", "Data", "Analysis"];
  const prefix = "Better ";
  const typedText = useTypewriter(prefix, phrases);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function animate(time) {
      lenis.raf(time);
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    // Cleanup on unmount
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

        {/* Scrollable Reveal Boxes */}
        {[...Array(5)].map((_, index) => (
          <ScrollBox
            key={index}
            title={`Discover More ${index + 1}`}
            content={`This is additional information that reveals as you scroll through box ${index + 1}. Explore insights, data trends, and much more to make informed decisions with ease.`}
          />
        ))}
      </main>
    </div>
  );
};

// ScrollBox Component
const ScrollBox = ({ title, content }) => {
  const [isFullyScrolled, setIsFullyScrolled] = useState(false);
  const boxRef = useRef(null);

  const handleScroll = () => {
    if (boxRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = boxRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setIsFullyScrolled(true); // Fully reveal content when scrolled to the bottom
      } else {
        setIsFullyScrolled(false); // Hide content if not fully scrolled
      }
    }
  };

  return (
    <div
      ref={boxRef}
      onScroll={handleScroll}
      className={`scroll-box ${isFullyScrolled ? 'fully-scrolled' : ''}`}
    >
      <h2 className="scroll-title">{title}</h2>
      <p className={`scroll-content ${isFullyScrolled ? 'revealed' : ''}`}>{content}</p>
    </div>
  );
};

export default Home;
