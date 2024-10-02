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
        </Routes>
      </div>
    </Router>
  );
}

export default App;