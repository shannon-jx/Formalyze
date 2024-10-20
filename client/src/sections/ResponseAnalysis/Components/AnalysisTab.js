import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import './AnalysisTab.css';

Chart.register(ArcElement, Tooltip, Legend);

const AnalysisTab = ({ responses, formQuestions }) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const analyzeSentiment = async () => {
      if (!responses || responses.length === 0 || !formQuestions || formQuestions.length === 0) return;

      setLoading(true);
      try {
        const response = await axios.post('/api/analyze-sentiment', { responses, formQuestions });
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

  // Function to render Pie Charts for sentiment analysis with animations and hover effects
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
            label: function(tooltipItem) {
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
    <section className="analysis-section">
      <h3>Sentiment Analysis Dashboard</h3>
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Analyzing responses...</p>
        </div>
      ) : (
        <div className="analysis-content">
          {analysisResult ? (
            <>
              {/* Overall Sentiment */}
              <div className="sentiment-overview">
                <h4>Overall Sentiment</h4>
                <div className="chart-container">
                  {renderSentimentChart(analysisResult.analysis.overallSentiment)}
                </div>
              </div>

              {/* Individual Question Analysis */}
              {analysisResult.analysis.questions.map((question) => (
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
              ))}

              {/* Common Themes */}
              <div className="common-themes">
                <h4>Common Themes</h4>
                <ul>
                  {analysisResult.analysis.commonThemes.map((theme, index) => (
                    <li key={index}>{theme}</li>
                  ))}
                </ul>
              </div>

              {/* Actionable Insights */}
              <div className="actionable-insights">
                <h4>Actionable Insights</h4>
                <ul>
                  {analysisResult.analysis.actionableInsights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p>No sentiment analysis results yet.</p>
          )}
        </div>
      )}
    </section>
  );
  // return (
  //   <section className="analysis-section">
  //     <h3>Sentiment Analysis</h3>
  //     {loading ? (
  //       <p>Analyzing responses...</p>
  //     ) : (
  //       <div>
  //         {analysisResult ? (
  //           <div className="sentiment-analysis-result">
  //             <h4>Overall Sentiment:</h4>
  //             <p>{analysisResult.analysis.overallSentiment}</p>
  //             <h4>Details:</h4>
  //             {analysisResult.analysis.details.map((detail, index) => (
  //               <div key={index} className="response-details">
  //                 <h5>Question {index + 1}:</h5>
  //                 <p><strong>{formQuestions[index]?.question}</strong></p>
  //                 <p>Response: {responses[index]}</p>
  //                 <p>Sentiment: {detail.sentiment}</p>
  //               </div>
  //             ))}
  //           </div>
  //         ) : (
  //           <p>No sentiment analysis results yet.</p>
  //         )}
  //       </div>
  //     )}
  //   </section>
  // );  
};

export default AnalysisTab;