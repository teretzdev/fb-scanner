/**
 * Navbar.js
 * The Navbar component provides navigation links for the React application.
 * Includes links to the Home page and the Profile Scanner page.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          FB Scanner
        </Link>
        <ul className="navbar-links">
          <li>
            <Link to="/" className="navbar-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/profile-scanner" className="navbar-link">
              Profile Scanner
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
