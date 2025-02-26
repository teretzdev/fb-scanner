/**
 * api.js
 * Provides utility functions for interacting with the Node.js backend API.
 * Includes methods for GET, POST, and DELETE requests with error handling.
 */

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Performs a GET request to the specified endpoint.
 * @param {string} endpoint - The API endpoint to send the request to.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the request fails.
 */
async function get(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`GET request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in GET request to ${endpoint}:`, error.message);
    throw error;
  }
}

/**
 * Performs a POST request to the specified endpoint with the given payload.
 * @param {string} endpoint - The API endpoint to send the request to.
 * @param {Object} payload - The data to send in the request body.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the request fails.
 */
async function post(endpoint, payload) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`POST request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in POST request to ${endpoint}:`, error.message);
    throw error;
  }
}

/**
 * Performs a DELETE request to the specified endpoint.
 * @param {string} endpoint - The API endpoint to send the request to.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the request fails.
 */
async function del(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`DELETE request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in DELETE request to ${endpoint}:`, error.message);
    throw error;
  }
}

export { get, post, del };
```

### Step 4: Review the Code
- **Purpose Fulfilled**: The file provides utility functions (`get`, `post`, `del`) for interacting with the backend API, aligning with the requirements.
- **Conventions Followed**: The code uses `fetch` for API requests and follows the error-handling conventions seen in the codebase.
- **Completeness**: The file is fully functional and ready for integration into the frontend.
- **Error Handling**: Proper error handling is implemented for all request types.

### Final Output
The complete `frontend/src/services/api.js` file is as follows:
```
/**
 * api.js
 * Provides utility functions for interacting with the Node.js backend API.
 * Includes methods for GET, POST, and DELETE requests with error handling.
 */

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Performs a GET request to the specified endpoint.
 * @param {string} endpoint - The API endpoint to send the request to.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the request fails.
 */
async function get(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`GET request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in GET request to ${endpoint}:`, error.message);
    throw error;
  }
}

/**
 * Performs a POST request to the specified endpoint with the given payload.
 * @param {string} endpoint - The API endpoint to send the request to.
 * @param {Object} payload - The data to send in the request body.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the request fails.
 */
async function post(endpoint, payload) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`POST request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in POST request to ${endpoint}:`, error.message);
    throw error;
  }
}

/**
 * Performs a DELETE request to the specified endpoint.
 * @param {string} endpoint - The API endpoint to send the request to.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - If the request fails.
 */
async function del(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`DELETE request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in DELETE request to ${endpoint}:`, error.message);
    throw error;
  }
}

export { get, post, del };