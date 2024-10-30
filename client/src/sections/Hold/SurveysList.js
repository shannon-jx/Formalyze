// // sections/Dashboard/SurveysList.js
// import React, { useEffect, useState } from 'react';
// import { db } from '../firebase';
// import { collection, getDocs } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';
// import './SurveysList.css';

// const SurveysList = () => {
//   const [surveys, setSurveys] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchSurveys = async () => {
//       try {
//         const surveysRef = collection(db, 'forms');
//         const querySnapshot = await getDocs(surveysRef);
//         const surveysData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         setSurveys(surveysData);
//       } catch (error) {
//         console.error("Error fetching surveys: ", error);
//       }
//     };

//     fetchSurveys();
//   }, []);

//   const handleSurveySelect = (surveyId) => {
//     navigate(`/survey/${surveyId}/edit`);
//   };

//   return (
//     <div className="surveys-list">
//       {surveys.length === 0 ? (
//         <p>No surveys found. <a href="/create-form">Create a new survey</a>.</p>
//       ) : (
//         <ul>
//           {surveys.map((survey) => (
//             <li key={survey.id} onClick={() => handleSurveySelect(survey.id)}>
//               {survey.title}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default SurveysList;

// src/sections/SurveyList/components/SurveyList.js
import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path based on actual location
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './SurveysList.css'; // Ensure correct path

function SurveysList({ selectedFormId, setSelectedFormId, userId }) {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchSurveys = async () => {
      if (!userId) return;
      try {
        const q = query(collection(db, 'users', userId, 'forms'));
        const querySnapshot = await getDocs(q);
        const surveysWithResponses = await Promise.all(
          querySnapshot.docs.map(async (formDoc) => {
            const formData = { id: formDoc.id, ...formDoc.data() };
            const responsesQuery = query(collection(db, 'users', userId, 'forms', formDoc.id, 'responses'));
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
  }, [userId]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      try {
        await deleteDoc(doc(db, 'users', userId, 'forms', id));
        setSurveys(surveys.filter(survey => survey.id !== id));
        if (selectedFormId === id) {
          setSelectedFormId(null);
        }
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
    <ul className="form-list">
      {surveys.length === 0 ? (
        <li className="no-surveys">You haven't created any forms yet.</li>
      ) : (
        surveys.map(survey => (
          <li
            key={survey.id}
            className={selectedFormId === survey.id ? 'active' : ''}
            onClick={() => setSelectedFormId(survey.id)}
          >
            {survey.title || 'Untitled Form'}
            <div className="survey-actions">
              <button onClick={(e) => { e.stopPropagation(); /* Implement edit functionality if needed */ }}>Edit</button>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(survey.id); }}>Delete</button>
            </div>
          </li>
        ))
      )}
    </ul>
  );
}

export default SurveysList;
