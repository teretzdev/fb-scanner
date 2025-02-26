/**
 * App.js
 * Main App component for the React application.
 * Serves as the root component and defines the application's structure and routing.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CredentialsForm from './components/CredentialsForm';
import GroupUrlManager from './components/GroupUrlManager';
import LogViewer from './components/LogViewer';
import './styles/main.css'; // Import global styles

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>FB Scanner</h1>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/credentials" element={<CredentialsForm />} />
            <Route path="/group-urls" element={<GroupUrlManager />} />
            <Route path="/logs" element={<LogViewer />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>&copy; 2023 FB Scanner. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
