/**
 * GroupUrlManager.js
 * React component for managing Facebook group URLs.
 * Provides a user interface for adding, listing, and deleting group URLs.
 */

import React, { useState, useEffect } from 'react';
import { get, post, del } from '../services/api';

const GroupUrlManager = () => {
  const [groupUrls, setGroupUrls] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Fetches the list of group URLs from the backend on component mount.
   */
  useEffect(() => {
    const fetchGroupUrls = async () => {
      try {
        setLoading(true);
        const response = await get('/group-urls');
        setGroupUrls(response.groupUrls || []);
      } catch (error) {
        setMessage(error.message || 'Failed to fetch group URLs.');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupUrls();
  }, []);

  /**
   * Handles the addition of a new group URL.
   */
  const handleAddUrl = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!newUrl) {
      setMessage('Group URL cannot be empty.');
      setLoading(false);
      return;
    }

    try {
      const response = await post('/group-urls', { url: newUrl });
      setGroupUrls(response.groupUrls || []);
      setNewUrl('');
      setMessage('Group URL added successfully.');
    } catch (error) {
      setMessage(error.message || 'Failed to add group URL.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the deletion of a group URL.
   */
  const handleDeleteUrl = async (url) => {
    setMessage('');
    setLoading(true);

    try {
      const response = await del(`/group-urls?url=${encodeURIComponent(url)}`);
      setGroupUrls(response.groupUrls || []);
      setMessage('Group URL deleted successfully.');
    } catch (error) {
      setMessage(error.message || 'Failed to delete group URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group-url-manager">
      <h2>Manage Facebook Group URLs</h2>
      <form onSubmit={handleAddUrl}>
        <label htmlFor="new-url">Add New Group URL:</label>
        <input
          type="url"
          id="new-url"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Enter Facebook group URL"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add URL'}
        </button>
      </form>

      {message && <p className="message">{message}</p>}

      <h3>Existing Group URLs</h3>
      <ul className="group-url-list">
        {groupUrls.map((url, index) => (
          <li key={index} className="group-url-item">
            <span>{url}</span>
            <button
              onClick={() => handleDeleteUrl(url)}
              disabled={loading}
              className="delete-button"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupUrlManager;
