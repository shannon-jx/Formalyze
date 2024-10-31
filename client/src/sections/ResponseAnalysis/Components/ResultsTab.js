import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './ResultsTab.css';

const ResultsTab = ({ formQuestions = [], responses = [] }) => {
  const [currentResponseIndex, setCurrentResponseIndex] = useState(0);
  const totalResponses = responses.length;

  const handlePrevious = () => {
    setCurrentResponseIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentResponseIndex((prevIndex) => Math.min(prevIndex + 1, totalResponses - 1));
  };

  const currentResponse = responses[currentResponseIndex];

  return (
    <div className="results-tab">
      <section className="overview-section">
        <div className="overview-card">
          <h2>{totalResponses}</h2>
          <p>Total Responses</p>
        </div>
        <div className="overview-card">
          <h2>{formQuestions.length}</h2>
          <p>Total Questions</p>
        </div>
      </section>

      <section className="response-navigation">
        <button 
          onClick={handlePrevious} 
          disabled={currentResponseIndex === 0} 
          className="nav-button"
        >
          <FaChevronLeft />
        </button>
        <span className="response-indicator">
          Response: {currentResponseIndex + 1} / {totalResponses}
        </span>
        <button 
          onClick={handleNext} 
          disabled={currentResponseIndex === totalResponses - 1} 
          className="nav-button"
        >
          <FaChevronRight />
        </button>
      </section>

      <section className="results-section">
        <h3>Collected Response</h3>
        {currentResponse ? (
          <div className="response-content">
            {currentResponse.responses.map((response, index) => (
              <div key={response.id} className="question-answer-block">
                <p><strong>Question {index + 1}:</strong> {response.question}</p>
                <p><strong>Answer:</strong> {response.answer || 'No response'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No responses available for this form.</p>
        )}
      </section>
    </div>
  );
};

export default ResultsTab;