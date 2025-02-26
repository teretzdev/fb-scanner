/**
 * ProfileScanner.js
 * The ProfileScanner component allows users to scan Facebook profiles by entering a profile URL.
 * It communicates with the backend API to initiate the scan and displays the results.
 */

import React, { useState } from 'react';
import axios from 'axios';
import '../styles/App.css';

function ProfileScanner() {
  const [profileUrl, setProfileUrl] = useState('');
  const [scanResults, setScanResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle form submission to initiate the scan
  const handleScan = async (event) => {
    event.preventDefault();
    setError('');
    setScanResults(null);

    if (!profileUrl) {
      setError('Profile URL cannot be empty.');
      return;
    }

    const urlPattern = /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9._-]+\/?$/;
    if (!urlPattern.test(profileUrl)) {
      setError('Invalid Facebook profile URL format.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/scan-profile', { url: profileUrl });
      setScanResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to scan the profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-scanner">
      <h1>Profile Scanner</h1>
      <form onSubmit={handleScan} className="profile-scanner-form">
        <label htmlFor="profile-url">Facebook Profile URL:</label>
        <input
          type="url"
          id="profile-url"
          value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)}
          placeholder="Enter Facebook profile URL"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Scanning...' : 'Scan Profile'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {scanResults && (
        <div className="scan-results">
          <h2>Scan Results</h2>
          <pre>{JSON.stringify(scanResults, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ProfileScanner;
```

---

### Step 4: Review the Code
- **Purpose Fulfilled**: The `ProfileScanner` component provides a form for entering a Facebook profile URL, initiates a scan via the backend API, and displays the results or errors.
- **Conventions Followed**: The code uses functional components, `useState` for state management, and `axios` for API calls, consistent with the codebase.
- **Error Handling**: The component validates the URL format, handles API errors, and displays appropriate error messages.
- **Completeness**: The file is fully functional and ready to be integrated into the React application.

---

### Final Output
The complete `frontend/src/components/ProfileScanner.js` file is as follows:
```
/**
 * ProfileScanner.js
 * The ProfileScanner component allows users to scan Facebook profiles by entering a profile URL.
 * It communicates with the backend API to initiate the scan and displays the results.
 */

import React, { useState } from 'react';
import axios from 'axios';
import '../styles/App.css';

function ProfileScanner() {
  const [profileUrl, setProfileUrl] = useState('');
  const [scanResults, setScanResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle form submission to initiate the scan
  const handleScan = async (event) => {
    event.preventDefault();
    setError('');
    setScanResults(null);

    if (!profileUrl) {
      setError('Profile URL cannot be empty.');
      return;
    }

    const urlPattern = /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9._-]+\/?$/;
    if (!urlPattern.test(profileUrl)) {
      setError('Invalid Facebook profile URL format.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/scan-profile', { url: profileUrl });
      setScanResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to scan the profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-scanner">
      <h1>Profile Scanner</h1>
      <form onSubmit={handleScan} className="profile-scanner-form">
        <label htmlFor="profile-url">Facebook Profile URL:</label>
        <input
          type="url"
          id="profile-url"
          value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)}
          placeholder="Enter Facebook profile URL"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Scanning...' : 'Scan Profile'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {scanResults && (
        <div className="scan-results">
          <h2>Scan Results</h2>
          <pre>{JSON.stringify(scanResults, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ProfileScanner;