import React from 'react';
import './ResultsTab.css';

const ResultsTab = ({ formQuestions, responses }) => {
  return (
    <div className="results-tab">
      <section className="overview-section">
        <div className="overview-card">
          <h2>{responses.length}</h2>
          <p>Total Responses</p>
        </div>
        <div className="overview-card">
          <h2>{formQuestions.length}</h2>
          <p>Total Questions</p>
        </div>
      </section>

      <section className="results-section">
        <h3>Collected Responses</h3>
        {responses.length > 0 ? (
          <table className="responses-table">
            <thead>
              <tr>
                {formQuestions.map((question, index) => (
                  <th key={question.id}>Q{index + 1}: {question.question}</th>
                ))}
                <th>User ID</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((response) => (
                <tr key={response.id}>
                  {formQuestions.map((question, index) => (
                    <td key={index}>
                      {Array.isArray(response[`Q${index + 1}`]) ? (
                        question.type === 'checkbox' ? (
                          <ul>
                            {response[`Q${index + 1}`].map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          response[`Q${index + 1}`][0] || 'No response'
                        )
                      ) : (
                        response[`Q${index + 1}`] || 'No response'
                      )}
                    </td>
                  ))}
                  <td>{response.userId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No responses available for this form.</p>
        )}
      </section>
    </div>
  );
};

export default ResultsTab;