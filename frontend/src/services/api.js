/**
 * api.js
 * Provides a centralized API service for communicating with the backend.
 * Handles HTTP requests to interact with the server-side endpoints.
 */

import axios from 'axios';

/**
 * API base URL
 * Adjust this URL based on the backend server's configuration.
 */
const API_BASE_URL = '/api';

/**
 * Handles GET requests to the specified endpoint.
 * @param {string} endpoint - The API endpoint to send the GET request to.
 * @returns {Promise<Object>} - The response data from the server.
 */
export async function getRequest(endpoint) {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Handles POST requests to the specified endpoint.
 * @param {string} endpoint - The API endpoint to send the POST request to.
 * @param {Object} data - The data to include in the POST request body.
 * @returns {Promise<Object>} - The response data from the server.
 */
export async function postRequest(endpoint, data) {
  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Handles DELETE requests to the specified endpoint.
 * @param {string} endpoint - The API endpoint to send the DELETE request to.
 * @returns {Promise<Object>} - The response data from the server.
 */
export async function deleteRequest(endpoint) {
  try {
    const response = await axios.delete(`${API_BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Handles API errors by logging them and throwing an appropriate error message.
 * @param {Object} error - The error object from the failed API request.
 * @throws {Error} - A new error with a user-friendly message.
 */
function handleApiError(error) {
  const errorMessage =
    error.response?.data?.message || 'An error occurred while communicating with the server.';
  console.error(`API Error: ${errorMessage}`, error);
  throw new Error(errorMessage);
}
