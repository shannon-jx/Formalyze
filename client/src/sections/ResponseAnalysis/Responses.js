import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useParams } from 'react-router-dom';
import './Responses.css';
import ResultsTab from './Components/ResultsTab';
import AnalysisTab from './Components/AnalysisTab';

const Responses = () => {
  const { formId } = useParams();
  const [formQuestions, setFormQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('results');

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        console.log('User is logged out');
        alert('Please log in to view the form responses.');
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchFormData = async () => {
      if (!user) return;
      try {
        const formDocRef = doc(db, 'users', user.uid, 'forms', formId);
        const formDoc = await getDoc(formDocRef);
        if (formDoc.exists()) {
          const formData = formDoc.data();
          setFormQuestions(formData.questions || []);
        } else {
          console.error('Form not found');
        }

        const responsesCollectionRef = collection(db, 'users', user.uid, 'forms', formId, 'responses');
        const responsesSnapshot = await getDocs(responsesCollectionRef);
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

    if (user) {
      fetchFormData();
    }
  }, [formId, user]);

  if (loading) {
    return <p>Loading form data...</p>;
  }

  if (!user) {
    return <p>Please log in to view the form responses.</p>;
  }

  if (formQuestions.length === 0) {
    return <p>No questions available in this form.</p>;
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="admin-overview-container">
      <header className="admin-header">
        <h1>Form Overview</h1>
        <p>Total Responses: {responses.length}</p>
      </header>

      <div className="tab-navigation">
        <div className={`tab-item ${activeTab === 'results' ? 'active' : ''}`} onClick={() => handleTabClick('results')}>
          Results
        </div>
        <div className={`tab-item ${activeTab === 'analysis' ? 'active' : ''}`} onClick={() => handleTabClick('analysis')}>
          Analysis
        </div>
        <div className={`tab-slider ${activeTab}`} />
      </div>

      <div className="tab-content">
        {activeTab === 'results' && (
          <ResultsTab formQuestions={formQuestions} responses={responses} />
        )}

        {activeTab === 'analysis' && (
          <AnalysisTab />
        )}
      </div>
    </div>
  );
};

export default Responses;