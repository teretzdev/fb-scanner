/**
 * ScanResults.js
 * React component for displaying the results of Facebook group scans.
 * Shows extracted posts and comments in a structured format.
 */

import React, { useState, useEffect } from 'react';
import { get } from '../services/api';
import './ScanResults.css'; // Import styles specific to the ScanResults component

const ScanResults = () => {
  const [scanResults, setScanResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Fetches scan results from the backend when the component mounts.
   */
  useEffect(() => {
    const fetchScanResults = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await get('/scan-results');
        setScanResults(response.results || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch scan results.');
      } finally {
        setLoading(false);
      }
    };

    fetchScanResults();
  }, []);

  return (
    <div className="scan-results">
      <h2>Facebook Group Scan Results</h2>
      {error && <p className="error">{error}</p>}
      <div className="results-container">
        {loading ? (
          <p>Loading...</p>
        ) : scanResults.length > 0 ? (
          <ul>
            {scanResults.map((result, index) => (
              <li key={index} className="result-item">
                <div className="post">
                  <p><strong>Post:</strong> {result.content}</p>
                  <p><strong>Author:</strong> {result.author || 'Unknown'}</p>
                  <p><strong>Timestamp:</strong> {result.timestamp || 'Unknown'}</p>
                  <p><strong>Reactions:</strong> {result.reactions || 'None'}</p>
                </div>
                {result.comments && result.comments.length > 0 && (
                  <div className="comments">
                    <h4>Comments:</h4>
                    <ul>
                      {result.comments.map((comment, commentIndex) => (
                        <li key={commentIndex} className="comment-item">
                          <p><strong>Commenter:</strong> {comment.commenter || 'Unknown'}</p>
                          <p>{comment.commentText}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No scan results available.</p>
        )}
      </div>
    </div>
  );
};

export default ScanResults;
```

### Explanation of the Implementation

1. **Component Structure**:
   - The `ScanResults` component fetches and displays the results of Facebook group scans.
   - It uses `useState` to manage the state for scan results, loading status, and errors.
   - It uses `useEffect` to fetch scan results from the backend when the component mounts.

2. **Styling**:
   - The component imports a CSS file (`ScanResults.css`) for styling. This ensures that the styles are scoped to the `ScanResults` component.

3. **Error Handling**:
   - Errors encountered during the fetch operation are displayed to the user.

4. **Content**:
   - Each scan result is displayed with details such as the post content, author, timestamp, reactions, and associated comments.
   - Comments are nested under their respective posts.

5. **Loading State**:
   - A loading message is displayed while the scan results are being fetched.

6. **Empty State**:
   - A message is displayed if no scan results are available.

### Review Checklist
- **Purpose Fulfilled**: The component displays the results of Facebook group scans, including posts and comments, as required.
- **Conventions Followed**: The code uses React functional components, `useState` and `useEffect` hooks, and scoped CSS for styling, consistent with the codebase.
- **Completeness**: The file is fully functional, with no placeholders or incomplete code.
- **Error Handling**: Errors during the fetch operation are handled and displayed to the user.
- **Styling**: The component is styled using a dedicated CSS file (`ScanResults.css`), ensuring maintainability and consistency.
