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

  /**
   * Handles the form submission to initiate a profile scan.
   * Sends the URL to the backend API and updates the state with the results.
   */
  const handleScan = async (e) => {
    e.preventDefault();
    setError('');
    setScanResults(null);
    setLoading(true);

    if (!url) {
      setError('Please enter a valid Facebook profile URL.');
      setLoading(false);
      return;
    }

    try {
      const response = await post('/scan', { url });
      setScanResults(response.data);
    } catch (err) {
      setError(err.message || 'An error occurred while scanning the profile.');
    } finally {
      setLoading(false);
    }
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
```

### Explanation of the Implementation

1. **State Management**:
   - `url`: Stores the user-inputted Facebook profile URL.
   - `scanResults`: Stores the results of the profile scan.
   - `error`: Stores any error messages encountered during the scan.
   - `loading`: Indicates whether the scan is in progress.

2. **Form Submission**:
   - The `handleScan` function validates the input, sends a POST request to the `/scan` endpoint using the `post` utility from `api.js`, and updates the state with the results or error.

3. **Rendering Results**:
   - The `renderResults` function displays the profile details (name, bio, and posts) in a structured format if the scan is successful.

4. **Error Handling**:
   - Errors are displayed to the user in a user-friendly manner.

5. **Loading State**:
   - The button text changes to "Scanning..." while the scan is in progress, and the button is disabled to prevent duplicate submissions.

6. **Styling**:
   - The component uses semantic HTML elements and class names (`profile-scanner`, `scan-results`, `error`) for easy integration with CSS.

### Review Checklist
- **Purpose Fulfilled**: The component provides a UI for scanning Facebook profiles and displays the results, as required.
- **Conventions Followed**: The code uses React functional components, hooks (`useState`), and the `post` utility from `api.js`, consistent with the codebase.
- **Completeness**: The file is fully functional, with no placeholders or incomplete code.
- **Error Handling**: Proper error handling is implemented for invalid input and API errors.
- **Loading State**: The UI reflects the loading state during the scan.

### Final Output
The complete `frontend/src/components/ProfileScanner.js` file is as follows:

```
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

  /**
   * Handles the form submission to initiate a profile scan.
   * Sends the URL to the backend API and updates the state with the results.
   */
  const handleScan = async (e) => {
    e.preventDefault();
    setError('');
    setScanResults(null);
    setLoading(true);

    if (!url) {
      setError('Please enter a valid Facebook profile URL.');
      setLoading(false);
      return;
    }

    try {
      const response = await post('/scan', { url });
      setScanResults(response.data);
    } catch (err) {
      setError(err.message || 'An error occurred while scanning the profile.');
    } finally {
      setLoading(false);
    }
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
