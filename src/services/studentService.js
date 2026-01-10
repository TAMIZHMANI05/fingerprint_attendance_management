import api from '@/utils/api';

/**
 * Get all students
 * @param {Object} params - { department, year, section, search, limit, skip }
 */
export const getStudents = async (params = {}) => {
  const response = await api.get('/auth/students', { params });
  return response.data;
};

/**
 * Get student by ID
 * @param {string} id - Student ID
 */
export const getStudentById = async (id) => {
  const response = await api.get(`/auth/students/${id}`);
  return response.data;
};

/**
 * Create new student
 * @param {Object} data - { email, password, name, studentId, department, year, section }
 */
export const createStudent = async (data) => {
  const response = await api.post('/auth/students', data);
  return response.data;
};

/**
 * Update student
 * @param {string} id - Student ID
 * @param {Object} data - { name, email, department, year, section, fingerprintId, deviceId }
 */
export const updateStudent = async (id, data) => {
  const response = await api.put(`/auth/students/${id}`, data);
  return response.data;
};

/**
 * Delete student
 * @param {string} id - Student ID
 */
export const deleteStudent = async (id) => {
  const response = await api.delete(`/auth/students/${id}`);
  return response.data;
};
