import api from '@/utils/api';

/**
 * Login user and get JWT token
 * @param {Object} credentials - { email, password }
 * @returns {Promise} User data and token
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * Get current user profile
 * @returns {Promise} User profile data
 */
export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

/**
 * Logout user (client-side only)
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
