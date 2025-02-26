/**
 * LogViewer.js
 * React component for viewing application logs.
 * Provides a user interface to display logs retrieved from the backend and clear them.
 */

import React, { useState, useEffect } from 'react';
import { get, del } from '../services/api';

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Fetches logs from the backend when the component mounts.
   */
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await get('/logs');
        setLogs(response.logs || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch logs.');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  /**
   * Clears all logs by sending a DELETE request to the backend.
   */
  const handleClearLogs = async () => {
    setLoading(true);
    setError('');
    try {
      await del('/logs');
      setLogs([]);
    } catch (err) {
      setError(err.message || 'Failed to clear logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="log-viewer">
      <h2>Application Logs</h2>
      {error && <p className="error">{error}</p>}
      <div className="logs-container">
        {loading ? (
          <p>Loading...</p>
        ) : logs.length > 0 ? (
          <ul>
            {logs.map((log, index) => (
              <li key={index}>
                <p><strong>Timestamp:</strong> {log.timestamp}</p>
                <p><strong>Message:</strong> {log.message}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No logs available.</p>
        )}
      </div>
      <button onClick={handleClearLogs} disabled={loading}>
        {loading ? 'Clearing...' : 'Clear Logs'}
      </button>
    </div>
  );
};

export default LogViewer;
