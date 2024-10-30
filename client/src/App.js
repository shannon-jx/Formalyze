// import React from 'react';
// import './App.css';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from './sections/Header/Header';
// import Home from './sections/Home/Home';
// import Features from './sections/Features/Features';
// import Pricing from './sections/Pricing/Pricing';
// import Contact from './sections/Contact/Contact';
// import FAQ from './sections/FAQ/FAQ';
// import Login from './sections/Login/Login';
// import Register from './sections/Register/Register';
// import CreateForm from './sections/CreateForm/CreateForm';
// import SurveyList from './sections/SurveyList/SurveyList';
// import SurveyEdit from './sections/SurveyList/SurveyEdit';
// import Responses from './sections/ResponseAnalysis/Responses';
// import UserReponse from './sections/UserResponse/ListContent';
// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Header />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/home" element={<Home />} />
//           <Route path="/features" element={<Features />} />
//           <Route path="/pricing" element={<Pricing />} />
//           <Route path="/contact" element={<Contact />} />
//           <Route path="/faq" element={<FAQ />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/create-form" element={<CreateForm />} />
//           <Route path="/forms" element={<SurveyList />} />
//           <Route path="/forms/edit/:id" element={<SurveyEdit />} />
//           <Route path="/forms/:formId" element={<Responses />} />
//           <Route path="/user-response/:userId/:formId" element={<UserReponse />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './sections/Header/Header';
import Home from './sections/Home/Home';
import Features from './sections/Features/Features';
import Pricing from './sections/Pricing/Pricing';
import Contact from './sections/Contact/Contact';
import FAQ from './sections/FAQ/FAQ';
import Login from './sections/Login/Login';
import Register from './sections/Register/Register';
import CreateForm from './sections/CreateForm/CreateForm';
import SurveyList from './sections/SurveyList/SurveyList';
import SurveyEdit from './sections/SurveyList/SurveyEdit';
import Responses from './sections/ResponseAnalysis/Responses';
import UserResponse from './sections/UserResponse/ListContent';
import Dashboard from './sections/Dashboard/Dashboard'; // Import Dashboard

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-form" element={<CreateForm />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* New Dashboard Route */}
          {/* Existing Routes */}
          <Route path="/forms" element={<SurveyList />} />
          <Route path="/forms/edit/:id" element={<SurveyEdit />} />
          <Route path="/forms/:formId" element={<Responses />} />
          <Route path="/user-response/:userId/:formId" element={<UserResponse />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
