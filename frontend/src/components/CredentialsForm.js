/**
 * CredentialsForm.js
 * React component for managing Facebook credentials.
 * Provides a user interface for saving, retrieving, and deleting credentials.
 */

import React, { useState, useEffect } from 'react';
import { get, post, del } from '../services/api';

const CredentialsForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Fetches existing credentials from the backend on component mount.
   */
  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        setLoading(true);
        const response = await get('/credentials');
        if (response.data) {
          setUsername(response.data.username);
          setPassword(response.data.password);
        }
      } catch (error) {
        setMessage(error.message || 'Failed to fetch credentials.');
      } finally {
        setLoading(false);
      }
    };

    fetchCredentials();
  }, []);

  /**
   * Handles the form submission to save credentials.
   */
  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!username || !password) {
      setMessage('Username and password are required.');
      setLoading(false);
      return;
    }

    try {
      await post('/credentials', { username, password });
      setMessage('Credentials saved successfully.');
    } catch (error) {
      setMessage(error.message || 'Failed to save credentials.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the deletion of credentials.
   */
  const handleDelete = async () => {
    setMessage('');
    setLoading(true);

    try {
      await del('/credentials');
      setUsername('');
      setPassword('');
      setMessage('Credentials deleted successfully.');
    } catch (error) {
      setMessage(error.message || 'Failed to delete credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="credentials-form">
      <h2>Manage Facebook Credentials</h2>
      <form onSubmit={handleSave}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your Facebook username"
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your Facebook password"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Credentials'}
        </button>
      </form>

      <button onClick={handleDelete} disabled={loading || (!username && !password)}>
        {loading ? 'Deleting...' : 'Delete Credentials'}
      </button>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default CredentialsForm;
