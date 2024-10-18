import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './SurveyList.css';

function SurveyList() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          throw new Error('User not authenticated');
        }

        const q = query(collection(db, 'users', user.uid, 'forms'));
        const querySnapshot = await getDocs(q);
        const surveyList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSurveys(surveyList);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching surveys: ", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  const handleView = (id) => {
    navigate(`/survey/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/survey/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          throw new Error('User not authenticated');
        }

        await deleteDoc(doc(db, 'users', user.uid, 'forms', id));
        setSurveys(surveys.filter(survey => survey.id !== id));
      } catch (err) {
        console.error("Error deleting survey: ", err);
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading surveys...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="survey-list-container">
      <h1>Your Surveys</h1>
      {surveys.length === 0 ? (
        <div className="no-surveys">You haven't created any surveys yet.</div>
      ) : (
        <div className="survey-grid">
          {surveys.map(survey => (
            <div key={survey.id} className="survey-card">
              <h2>{survey.title || 'Untitled Survey'}</h2>
              <div className="survey-stats">
                <span>{survey.questions?.length || 0} questions</span>
                <span>{survey.responses?.length || 0} responses</span>
              </div>
              <div className="survey-actions">
                <button onClick={() => handleView(survey.id)}>View</button>
                <button onClick={() => handleEdit(survey.id)}>Edit</button>
                <button onClick={() => handleDelete(survey.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SurveyList;
