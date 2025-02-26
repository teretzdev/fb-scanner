/**
 * ScanResults.js
 * React component to display Facebook group scan results, including posts and comments.
 * This component renders the data returned from scanning operations.
 */

import React from 'react';
import PropTypes from 'prop-types';
import './Dashboard.css'; // Reusing styles for consistent design

const ScanResults = ({ results }) => {
  /**
   * Renders a list of posts with their content and comments.
   * @param {Array} posts - Array of post objects containing content and comments.
   */
  const renderPosts = (posts) => {
    if (!posts || posts.length === 0) {
      return <p>No posts available.</p>;
    }

    return (
      <ul className="dashboard-table">
        {posts.map((post, index) => (
          <li key={index} className="dashboard-card">
            <p><strong>Post Content:</strong> {post.content}</p>
            <p><strong>Timestamp:</strong> {post.timestamp}</p>
            {post.comments && post.comments.length > 0 && (
              <div>
                <h4>Comments:</h4>
                <ul>
                  {post.comments.map((comment, idx) => (
                    <li key={idx}>
                      <p><strong>Comment:</strong> {comment.text}</p>
                      <p><strong>By:</strong> {comment.author}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="dashboard-container">
      <h2>Scan Results</h2>
      {results ? (
        <div>
          <h3>Group Details</h3>
          <p><strong>Group Name:</strong> {results.groupName}</p>
          <p><strong>Total Posts:</strong> {results.posts.length}</p>
          <h3>Posts</h3>
          {renderPosts(results.posts)}
        </div>
      ) : (
        <p>No results to display. Please initiate a scan.</p>
      )}
    </div>
  );
};

ScanResults.propTypes = {
  results: PropTypes.shape({
    groupName: PropTypes.string.isRequired,
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        content: PropTypes.string.isRequired,
        timestamp: PropTypes.string.isRequired,
        comments: PropTypes.arrayOf(
          PropTypes.shape({
            text: PropTypes.string.isRequired,
            author: PropTypes.string.isRequired,
          })
        ),
      })
    ).isRequired,
  }),
};

export default ScanResults;
```

### Explanation of the Implementation

1. **Component Purpose**:
   - The `ScanResults` component is designed to display the results of a Facebook group scan, including posts and their associated comments.

2. **Props**:
   - The component accepts a `results` prop, which contains the group name, an array of posts, and each post's comments.

3. **Rendering Logic**:
   - If no results are available, a message prompts the user to initiate a scan.
   - If results are available, the group name and total number of posts are displayed.
   - Posts are rendered in a list format, with each post showing its content, timestamp, and associated comments (if any).

4. **Styling**:
   - The component reuses styles from `Dashboard.css` for consistent design, such as card and table styles.

5. **Prop Validation**:
   - The `PropTypes` library is used to enforce the structure of the `results` prop, ensuring that the component receives the expected data format.

6. **Error Handling**:
   - The component gracefully handles cases where no posts or comments are available, displaying appropriate messages.

### Review Checklist
- **Purpose Fulfilled**: The component displays Facebook group scan results, including posts and comments, as required.
- **Conventions Followed**: The code uses React functional components, PropTypes for validation, and existing styles from `Dashboard.css`.
- **Completeness**: The file is fully functional, with no placeholders or incomplete code.
- **Error Handling**: Proper error handling is implemented for missing or empty data.
- **Styling**: The component integrates seamlessly with the existing design system.

### Final Output
The complete `frontend/src/components/ScanResults.js` file is as follows:

```
/**
 * ScanResults.js
 * React component to display Facebook group scan results, including posts and comments.
 * This component renders the data returned from scanning operations.
 */

import React from 'react';
import PropTypes from 'prop-types';
import './Dashboard.css'; // Reusing styles for consistent design

const ScanResults = ({ results }) => {
  /**
   * Renders a list of posts with their content and comments.
   * @param {Array} posts - Array of post objects containing content and comments.
   */
  const renderPosts = (posts) => {
    if (!posts || posts.length === 0) {
      return <p>No posts available.</p>;
    }

    return (
      <ul className="dashboard-table">
        {posts.map((post, index) => (
          <li key={index} className="dashboard-card">
            <p><strong>Post Content:</strong> {post.content}</p>
            <p><strong>Timestamp:</strong> {post.timestamp}</p>
            {post.comments && post.comments.length > 0 && (
              <div>
                <h4>Comments:</h4>
                <ul>
                  {post.comments.map((comment, idx) => (
                    <li key={idx}>
                      <p><strong>Comment:</strong> {comment.text}</p>
                      <p><strong>By:</strong> {comment.author}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="dashboard-container">
      <h2>Scan Results</h2>
      {results ? (
        <div>
          <h3>Group Details</h3>
          <p><strong>Group Name:</strong> {results.groupName}</p>
          <p><strong>Total Posts:</strong> {results.posts.length}</p>
          <h3>Posts</h3>
          {renderPosts(results.posts)}
        </div>
      ) : (
        <p>No results to display. Please initiate a scan.</p>
      )}
    </div>
  );
};

ScanResults.propTypes = {
  results: PropTypes.shape({
    groupName: PropTypes.string.isRequired,
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        content: PropTypes.string.isRequired,
        timestamp: PropTypes.string.isRequired,
        comments: PropTypes.arrayOf(
          PropTypes.shape({
            text: PropTypes.string.isRequired,
            author: PropTypes.string.isRequired,
          })
        ),
      })
    ).isRequired,
  }),
};

export default ScanResults;
