import api from '@/utils/api';

/**
 * Get all teachers
 * @param {Object} params - { search, limit, skip }
 */
export const getTeachers = async (params = {}) => {
  const response = await api.get('/auth/teachers', { params });
  return response.data;
};

/**
 * Get teacher by ID
 * @param {string} id - Teacher ID
 */
export const getTeacherById = async (id) => {
  const response = await api.get(`/auth/teachers/${id}`);
  return response.data;
};

/**
 * Create new teacher
 * @param {Object} data - { email, password, name }
 */
export const createTeacher = async (data) => {
  const response = await api.post('/auth/teachers', data);
  return response.data;
};

/**
 * Update teacher
 * @param {string} id - Teacher ID
 * @param {Object} data - { name, email }
 */
export const updateTeacher = async (id, data) => {
  const response = await api.put(`/auth/teachers/${id}`, data);
  return response.data;
};

/**
 * Delete teacher
 * @param {string} id - Teacher ID
 */
export const deleteTeacher = async (id) => {
  const response = await api.delete(`/auth/teachers/${id}`);
  return response.data;
};
