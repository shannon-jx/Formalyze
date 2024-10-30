// src/sections/Dashboard/components/MainContent.js
import React from 'react';
import EditView from './EditView';
import AnalyzeView from './AnalyzeView';
import ResponsesView from './ResponsesView';
// import './MainContent.css'; // Create and style as needed

function MainContent({ currentView, selectedFormId, userId }) {
  if (!selectedFormId) {
    return <div>Please select a form to view its details.</div>;
  }

  switch (currentView) {
    case 'Edit':
      return <EditView formId={selectedFormId} userId={userId} />;
    case 'Analyze':
      return <AnalyzeView formId={selectedFormId} userId={userId} />;
    case 'Responses':
      return <ResponsesView formId={selectedFormId} userId={userId} />;
    default:
      return <div>Select a view.</div>;
  }
}

export default MainContent;
