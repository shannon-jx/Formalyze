// // src/sections/Dashboard/components/Sidebar.js
// import React from 'react';
// import SurveyList from './SurveyList';
// import FormNavigation from './FormNavigation';
// // import './Sidebar.css'; // Optional: Additional styles specific to Sidebar

// function Sidebar({ selectedFormId, setSelectedFormId, setCurrentView, userId }) {
//   return (
//     <div className="sidebar">
//       {/* Your Forms Navigation Card */}
//       <div className="nav-card">
//         <h2>Your Forms</h2>
//         <SurveyList 
//           selectedFormId={selectedFormId} 
//           setSelectedFormId={setSelectedFormId} 
//           userId={userId}
//         />
//       </div>

//       {/* Current Form Navigation Card */}
//       {selectedFormId && (
//         <div className="nav-card">
//           <FormNavigation setCurrentView={setCurrentView} />
//         </div>
//       )}
//     </div>
//   );
// }

// export default Sidebar;

// src/sections/Dashboard/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import SurveyList from './SurveyList';
import FormNavigation from './FormNavigation';
// import './Sidebar.css'; // Optional: Additional styles specific to Sidebar

function Sidebar({ selectedFormId, setSelectedFormId, setCurrentView, userId }) {
  
  // Handler for creating a new form
  const handleCreateForm = () => {
    // Example: Set the current view to 'createForm'
    setCurrentView('createForm');
    
    // Alternatively, if using routing, you might use:
    // history.push('/create-form');
    
    // If you need to reset the selected form
    setSelectedFormId(null);
  };

  return (
    <div className="sidebar">
      {/* Your Forms Navigation Card */}
      <div className="nav-card">
        <h2>Your Forms</h2>
        <SurveyList 
          selectedFormId={selectedFormId} 
          setSelectedFormId={setSelectedFormId} 
          userId={userId}
        />
        
        {/* Create Form Link as a Button */}
        <Link 
          to="/create-form" 
          className="create-form-button-link" 
          style={{
            display: 'inline-block',
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            textAlign: 'center'
          }}
        >
          Create Form
        </Link>
      </div>

      {/* Current Form Navigation Card */}
      {selectedFormId && (
        <div className="nav-card">
          <FormNavigation setCurrentView={setCurrentView} />
        </div>
      )}
    </div>
  );
}

export default Sidebar;
