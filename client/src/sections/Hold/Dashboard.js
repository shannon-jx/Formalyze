// sections/Dashboard/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import './Dashboard.css';
import NavigationCard from './NavigationCard';
import SurveysList from './SurveysList';

// Import your existing view components
import SurveyEdit from '../SurveyList/SurveyEdit';
import Responses from '../ResponseAnalysis/Responses';
import UserResponse from '../UserResponse/ListContent';

// sections/Dashboard/Dashboard.js
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';


const Dashboard = () => {
  const navigate = useNavigate();
  const { formId } = useParams(); // Extract formId from URL
  const location = useLocation();

  const [currentFormName, setCurrentFormName] = useState("Loading...");

  useEffect(() => {
    const fetchFormName = async () => {
      try {
        const formDocRef = doc(db, 'forms', formId);
        const formDoc = await getDoc(formDocRef);
        if (formDoc.exists()) {
          setCurrentFormName(formDoc.data().title);
        } else {
          setCurrentFormName("Form Not Found");
        }
      } catch (error) {
        console.error("Error fetching form name:", error);
        setCurrentFormName("Error Loading Form");
      }
    };

    if (formId) {
      fetchFormName();
    }
  }, [formId]);

  const handleNavigation = (view) => {
    navigate(`/survey/${formId}/${view}`);
  };

  // Determine the current active view based on the URL
  const getCurrentView = () => {
    const pathParts = location.pathname.split('/');
    return pathParts[pathParts.length - 1];
  };

  const currentView = getCurrentView();

  return (
    <div className="dashboard-container">
      <div className="navigation-cards">
        {/* Top Navigation Card for Views */}
        <NavigationCard title={currentFormName}>
          <div className="nav-options">
            {['Edit', 'Analyse', 'Responses'].map((option) => {
              const optionKey = option.toLowerCase();
              const isActive = currentView === optionKey;
              return (
                <button
                  key={optionKey}
                  onClick={() => handleNavigation(optionKey)}
                  className={`nav-button ${isActive ? 'active' : ''}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          <div className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to={`edit`} />} />
          <Route path="edit" element={<SurveyEdit />} />
          <Route path="analyse" element={<Responses />} />
          <Route path="responses" element={<UserResponse />} />
          {/* Add more nested routes as needed */}
        </Routes>
      </div>
        </NavigationCard>

        {/* Second Navigation Card for "Your surveys" */}
        <NavigationCard title="Your surveys">
          <SurveysList />
        </NavigationCard>
      </div>
    </div>
  );
};

export default Dashboard;
