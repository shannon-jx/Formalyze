import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AnalysisTab.css';

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
        // if (response.data && response.data.analysis) {
        //   setAnalysisResult(response.data.analysis);
        // } else {
        //   console.error('Unexpected response structure:', response);
        // }
      } catch (error) {
        console.error('Error fetching sentiment analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    analyzeSentiment();
  }, [responses, formQuestions]);

//   const renderResponse = (response, question, index) => {
//     if (Array.isArray(response[`Q${index + 1}`])) {
//       if (question.type === 'checkbox') {
//         return (
//           <ul>
//             {response[`Q${index + 1}`].map((item, i) => (
//               <li key={i}>{item}</li>
//             ))}
//           </ul>
//         );
//       }
//       return response[`Q${index + 1}`][0] || 'No response';
//     }
//     return 'No response';
//   };

  return (
    <section className="analysis-section">
      <h3>Sentiment Analysis</h3>
      {loading ? (
        <p>Analyzing responses...</p>
      ) : (
        <div>
          {analysisResult ? (
            <div className="sentiment-analysis-result">
              <h4>Overall Sentiment:</h4>
              <p>{analysisResult.overallSentiment}</p>
              <h4>Details:</h4>
              {/* {analysisResult.details.map((detail, index) => (
                <div key={index} className="response-details">
                  <h5>Response {index + 1}:</h5>
                  {detail.questions.map((question, qIndex) => (
                    <div key={qIndex}>
                      <strong>Q{qIndex + 1}: {question.question}</strong>
                      <div className="response-content">
                        {renderResponse(detail.responses, question, qIndex)}
                      </div>
                    </div>
                  ))}
                </div>
              ))} */}
              {JSON.stringify(analysisResult)}
            </div>
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