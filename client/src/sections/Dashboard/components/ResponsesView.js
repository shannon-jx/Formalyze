// src/sections/Dashboard/components/ResponsesView.js
import React, { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the path based on actual location
// import './ResponsesView.css'; // Create and style as needed

function ResponsesView({ formId, userId }) {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        if (!userId) {
          throw new Error('User not authenticated');
        }
        const responsesRef = collection(db, 'users', userId, 'forms', formId, 'responses');
        const q = query(responsesRef);
        const querySnapshot = await getDocs(q);
        const responsesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setResponses(responsesData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching responses: ", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (userId && formId) {
      fetchResponses();
    }
  }, [formId, userId]);

  if (loading) {
    return <div>Loading responses...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="responses-view">
      <h3>Responses</h3>
      {responses.length === 0 ? (
        <p>No responses yet.</p>
      ) : (
        <ul className="responses-list">
          {responses.map(response => (
            <li key={response.id}>
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ResponsesView;
