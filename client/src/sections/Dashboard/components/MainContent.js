// src/sections/Dashboard/components/MainContent.js
import React, { useEffect, useState } from 'react';
import EditView from './EditView';
import ResponsesView from './ResponsesView';
import AnalyzeView from './AnalyzeView';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
// import './MainContent.css'; // Create and style as needed

function MainContent({ currentView, selectedFormId, userId }) {
  const navigate = useNavigate();
  const [formQuestions, setFormQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch form questions and responses
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedFormId || !userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch form questions
        const formDocRef = doc(db, 'users', userId, 'forms', selectedFormId);
        const formDoc = await getDoc(formDocRef);
        if (formDoc.exists()) {
          const formData = formDoc.data();
          setFormQuestions(formData.questions || []);
        } else {
          throw new Error('Form not found');
        }

        // Fetch responses
        const responsesCollectionRef = collection(db, 'users', userId, 'forms', selectedFormId, 'responses');
        const responsesSnapshot = await getDocs(responsesCollectionRef);
        const fetchedResponses = responsesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResponses(fetchedResponses);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedFormId, userId]);

  if (loading) {
    return <div className="main-content-loading">Loading data...</div>;
  }

  if (error) {
    return <div className="main-content-error">Error: {error}</div>;
  }

  if (!selectedFormId) {
    return <div>Please select a form to view its details.</div>;
  }

  switch (currentView) {
    case 'Edit':
      return <EditView formId={selectedFormId} userId={userId} navigate={navigate} />;
    case 'Responses':
      return <ResponsesView formQuestions={formQuestions} responses={responses} />;
    case 'Analyze':
      return <AnalyzeView formQuestions={formQuestions} responses={responses} />;
    default:
      return <div>Select a view.</div>;
  }
}

export default MainContent;
