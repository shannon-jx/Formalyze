import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { useParams } from 'react-router-dom';
import './Responses.css';

const Responses = () => {
  const { formId } = useParams();
  const [formQuestions, setFormQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchFormData = async () => {
      if (!user) return;
      try {
        // Fetch form questions
        const formDocRef = doc(db, 'users', user.uid, 'forms', formId);
        const formDoc = await getDoc(formDocRef);
        console.log('Form Document:', formDoc.data());  // Log form document data
  
        if (formDoc.exists()) {
          const formData = formDoc.data();
          setFormQuestions(formData.questions || []);
        } else {
          console.error('Form not found');
        }
  
        // Fetch form responses
        const responsesCollectionRef = collection(db, 'users', user.uid, 'forms', formId, 'responses');
        const responsesSnapshot = await getDocs(responsesCollectionRef);
        console.log('Responses Snapshot:', responsesSnapshot.docs.map(doc => doc.data()));  // Log response documents
  
        const responses = responsesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResponses(responses);
  
      } catch (error) {
        console.error('Error fetching form data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchFormData();
  }, [formId, user]);
  

  if (loading) {
    return <p>Loading form data...</p>;
  }

  if (formQuestions.length === 0) {
    return <p>No questions available in this form.</p>;
  }

  return (
    <div className="admin-overview-container">
      <header className="admin-header">
        <h1>Form Overview</h1>
        <p>Total Responses: {responses.length}</p>
      </header>

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

      <section className="responses-section">
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
                    <td key={index}>{response[`Q${index + 1}`] || 'No response'}</td>
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

export default Responses;