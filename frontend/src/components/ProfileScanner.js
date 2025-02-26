/**
 * ProfileScanner.js
 * React component for scanning Facebook profiles using the new Node.js backend API.
 * Provides a user interface for initiating scans and displaying results.
 */

import React, { useState } from 'react';
import { post } from '../services/api';

const ProfileScanner = () => {
  const [url, setUrl] = useState('');
  const [scanResults, setScanResults] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  /**
   * Validates the format of a Facebook profile URL.
   * @param {string} url - The URL to validate.
   * @returns {boolean} - True if the URL is valid, false otherwise.
   */
  const isValidFacebookUrl = (url) => {
    const facebookUrlPattern = /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9(.?)?]/;
    return facebookUrlPattern.test(url);
  };

  /**
   * Handles the form submission to initiate a profile scan.
   * Sends the URL to the backend API and updates the state with the results.
   */
  const handleScan = async (e, retries = 3) => {
    e.preventDefault();
    setError('');
    setScanResults(null);
    setLoading(true);
    setRetryCount(0);

    if (!isValidFacebookUrl(url)) {
      setError('Invalid URL. Please enter a valid Facebook profile URL.');
      setLoading(false);
      return;
    }

    const attemptScan = async (attempt) => {
      try {
        const response = await post('/scan', { url });
        setScanResults(response.data);
        setRetryCount(0); // Reset retry count on success
      } catch (err) {
        if (attempt < retries) {
          setRetryCount(attempt + 1);
          await attemptScan(attempt + 1); // Retry the request
        } else {
          if (err.response) {
            // Server responded with a status code outside the 2xx range
            switch (err.response.status) {
              case 400:
                setError('Bad Request: Please check the URL and try again.');
                break;
              case 404:
                setError('Profile not found. Please verify the URL.');
                break;
              case 500:
                setError('Server error. Please try again later.');
                break;
              default:
                setError(`Unexpected error: ${err.response.statusText}`);
            }
          } else if (err.request) {
            // Request was made but no response received
            setError('Network error. Please check your connection and try again.');
          } else {
            // Something else caused the error
            setError(err.message || 'An unexpected error occurred.');
          }
        }
      }
    };

    await attemptScan(0);
    setLoading(false);
  };

  /**
   * Renders the scan results in a structured format.
   */
  const renderResults = () => {
    if (!scanResults) return null;

    const { name, bio, posts } = scanResults;

    return (
      <div className="scan-results">
        <h3>Profile Details</h3>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Bio:</strong> {bio}</p>
        <h4>Posts</h4>
        <ul>
          {posts.map((post, index) => (
            <li key={index}>
              <p><strong>Content:</strong> {post.content}</p>
              <p><strong>Timestamp:</strong> {post.timestamp}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="profile-scanner">
      <h2>Facebook Profile Scanner</h2>
      <form onSubmit={handleScan}>
        <label htmlFor="profile-url">Profile URL:</label>
        <input
          type="url"
          id="profile-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Facebook profile URL"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Scanning...' : 'Scan Profile'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {renderResults()}
    </div>
  );
};

export default ProfileScanner;