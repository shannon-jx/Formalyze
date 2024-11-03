// src/sections/Dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import './Dashboard.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Lenis from '@studio-freight/lenis';

function Dashboard() {
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [currentView, setCurrentView] = useState('Edit');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid);
      } else {
        setUserId(null);
        // Optionally, redirect to login or display a message
      }
    });

    return () => unsubscribe();
  }, []);

  // Persist selectedFormId using localStorage
  useEffect(() => {
    if (selectedFormId) {
      localStorage.setItem('selectedFormId', selectedFormId);
    } else {
      localStorage.removeItem('selectedFormId');
    }
  }, [selectedFormId]);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function animate(time) {
      lenis.raf(time);
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      lenis.destroy();
    };
  }, []);
  
  return (
    <div className="dashboard-container">
      <Sidebar 
        selectedFormId={selectedFormId} 
        setSelectedFormId={setSelectedFormId} 
        setCurrentView={setCurrentView} 
        userId={userId}
      />
      <MainContent 
        currentView={currentView} 
        selectedFormId={selectedFormId} 
        userId={userId}
      />
    </div>
  );
}

export default Dashboard;
