// src/sections/Dashboard/components/FormNavigation.js
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the path based on actual location
import { getAuth } from 'firebase/auth';
import './FormNavigation.css';

function FormNavigation({ setCurrentView }) {
  const [formName, setFormName] = useState('');
  const [currentFormId, setCurrentFormId] = useState(null);
  const [activeButton, setActiveButton] = useState('Edit');

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      // Retrieve selectedFormId from localStorage
      const selectedFormId = localStorage.getItem('selectedFormId');
      setCurrentFormId(selectedFormId);
      if (selectedFormId) {
        fetchFormName(user.uid, selectedFormId);
      }
    }
  }, []);

  const fetchFormName = async (uid, formId) => {
    try {
      const formRef = doc(db, 'users', uid, 'forms', formId);
      const formSnap = await getDoc(formRef);
      if (formSnap.exists()) {
        setFormName(formSnap.data().title || 'Untitled Form');
      } else {
        setFormName('Form Not Found');
      }
    } catch (error) {
      console.error("Error fetching form name:", error);
      setFormName('Error');
    }
  };

  const handleViewChange = (view) => {
    setActiveButton(view);
    setCurrentView(view);
  };

  return (
    <div className="form-navigation">
      <h2>{formName}</h2>
      <div className="button-group">
        {['Edit', 'Analyze', 'Responses'].map(view => (
          <button
            key={view}
            className={activeButton === view ? 'active' : ''}
            onClick={() => handleViewChange(view)}
          >
            {view}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FormNavigation;
