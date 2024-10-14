import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import './Responses.css';

const Responses = ({ formId }) => {
  const [formQuestions, setFormQuestions] = useState([]);
  const [Responses, setResponses] = useState([]);
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
        if (formDoc.exists()) {
          const formData = formDoc.data();
          setFormQuestions(formData.questions || []);
        } else {
          console.error('Form not found');
        }

        // Fetch form responses
        const responsesCollectionRef = collection(db, 'users', user.uid, 'forms', formId, 'responses');
        const responsesSnapshot = await getDocs(responsesCollectionRef);
        const responses = responsesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
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
    <div className="form-responses-container">
      <h3>Form Questions</h3>
      <ul className="questions-list">
        {formQuestions.map((question, index) => (
          <li key={question.id} className="question-item">
            <strong>Q{index + 1}: {question.question}</strong>
          </li>
        ))}
      </ul>

      <h3>Responses</h3>
      {Responses.length > 0 ? (
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
            {Responses.map((response) => (
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
    </div>
  );
};

export default Responses;