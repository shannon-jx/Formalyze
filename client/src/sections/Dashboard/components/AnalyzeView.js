// src/sections/Dashboard/components/AnalyzeView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import './AnalyzeView.css';

Chart.register(ArcElement, Tooltip, Legend);

const AnalyzeView = ({ responses, formQuestions }) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const analyzeSentiment = async () => {
      if (!responses || responses.length === 0 || !formQuestions || formQuestions.length === 0) return;

      setLoading(true);
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/analyze-sentiment`, { responses, formQuestions });
        console.log('Response: ', JSON.stringify(response.data, null, 2));
        setAnalysisResult(response.data);
      } catch (error) {
        console.error('Error fetching sentiment analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    analyzeSentiment();
  }, [responses, formQuestions]);

  const renderSentimentChart = (sentiment) => {
    const data = {
      labels: ['Positive', 'Negative', 'Neutral'],
      datasets: [{
        data: [parseInt(sentiment.positive), parseInt(sentiment.negative), parseInt(sentiment.neutral)],
        backgroundColor: ['#36a2eb', '#ff6384', '#ffcd56'],
        hoverOffset: 10,
      }]
    };
    const options = {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return `${tooltipItem.label}: ${tooltipItem.raw}%`;
            }
          }
        }
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    };
    return <Pie data={data} options={options} />;
  };

  return (
    <section className="analyze-view">
      <h3>Sentiment Analysis Dashboard</h3>
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Analyzing responses...</p>
        </div>
      ) : (
        <div className="analysis-content">
          {analysisResult ? (
            <div>
              {/* Overall Analysis Grid */}
              <div className="dashboard-grid">
                <div className="sentiment-overview">
                  <h4>Overall Sentiment</h4>
                  <div className="chart-container">
                    {renderSentimentChart(analysisResult.analysis.overallSentiment)}
                  </div>
                </div>

                <div className="common-themes">
                  <h4>Common Themes</h4>
                  <ul>
                    {analysisResult.analysis.commonThemes.map((theme, index) => (
                      <li key={index}>{theme}</li>
                    ))}
                  </ul>
                </div>

                <div className="actionable-insights">
                  <h4>Actionable Insights</h4>
                  <ul>
                    {analysisResult.analysis.actionableInsights.map((insight, index) => (
                      <li key={index}>{insight}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Question Analysis Grid */}
              <div className="question-analyses">
                <h4>Individual Question Analysis</h4>
                <div className="question-grid">
                  {analysisResult.analysis.questions.map((question) => {
                    if (!String(question.questionId).includes('.')) {
                      return (
                        <div key={question.questionId} className="question-analysis">
                          <h5>Question {question.questionId}: {question.text}</h5>
                          <p><strong>Sentiment:</strong></p>
                          <div className="chart-container">
                            {renderSentimentChart(question.sentiment)}
                          </div>
                          <p><strong>Response Patterns:</strong></p>
                          <ul>
                            {question.responsePatterns.mostCommonKeywords.map((keyword, index) => (
                              <li key={index}>{keyword}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          ) : (
            <p>No sentiment analysis results yet.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default AnalyzeView;
