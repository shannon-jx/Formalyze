import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { getAuth } from 'firebase/auth';

function SurveyView() {
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          throw new Error('User not authenticated');
        }

        const surveyDoc = await getDoc(doc(db, 'users', user.uid, 'forms', id));
        
        if (surveyDoc.exists()) {
          setSurvey({ id: surveyDoc.id, ...surveyDoc.data() });
        } else {
          throw new Error('Survey not found');
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching survey: ", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [id]);

  if (loading) {
    return <div>Loading survey...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="survey-view">
      <h1>{survey.title || 'Untitled Survey'}</h1>
      <div className="questions">
        {survey.questions && survey.questions.map((question, index) => (
          <div key={index} className="question">
            <h3>Question {index + 1}: {question.text}</h3>
            <p>Type: {question.type}</p>
            {question.options && (
              <ul>
                {question.options.map((option, optionIndex) => (
                  <li key={optionIndex}>{option}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SurveyView;
