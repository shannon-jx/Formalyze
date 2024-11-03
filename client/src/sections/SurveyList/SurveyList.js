import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './SurveyList.css';

function SurveyList() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); 
      } else {
        setUser(null);
        setLoading(false);
        setError('User not authenticated');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchSurveys = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'users', user.uid, 'forms'));
        const querySnapshot = await getDocs(q);
        const surveysWithResponses = await Promise.all(
          querySnapshot.docs.map(async (formDoc) => {
            const formData = { id: formDoc.id, ...formDoc.data() };
            const responsesQuery = query(collection(db, 'users', user.uid, 'forms', formDoc.id, 'responses'));
            const responsesSnapshot = await getDocs(responsesQuery);
            const responses = responsesSnapshot.docs.map(doc => doc.data());
            return { ...formData, responses: responses || [] }; 
          })
        );
        setSurveys(surveysWithResponses);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching surveys: ", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [user]);

  const handleView = (id) => {
    navigate(`/forms/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/forms/edit/${id}`);
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
    return <div className="loading">Loading forms...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="survey-list-container">
      <h1>Your Forms</h1>
      {surveys.length === 0 ? (
        <div className="no-surveys">You haven't created any forms yet.</div>
      ) : (
        <div className="survey-grid">
          {surveys.map(survey => (
            <div
              key={survey.id}
              className="survey-card"
              onClick={() => handleView(survey.id)}
              style={{ cursor: 'pointer' }}
            >
              <h2>{survey.title || 'Untitled Form'}</h2>
              <div className="survey-stats">
                <span>{survey.questions?.length || 0} questions</span>
                <span>{survey.responses?.length || 0} responses</span> 
              </div>
              <div className="survey-actions">
                <button onClick={(e) => { e.stopPropagation(); handleEdit(survey.id); }}>Edit</button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(survey.id); }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SurveyList;