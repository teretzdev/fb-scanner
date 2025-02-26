/**
 * App.js
 * Main App component for the React application.
 * Serves as the root component and sets up routing and layout.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ProfileScanner from './components/ProfileScanner';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile-scanner" element={<ProfileScanner />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
