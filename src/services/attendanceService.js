import api from '@/utils/api';

/**
 * Get attendance events
 * @param {Object} params - { studentId, date, session, startDate, endDate, limit, skip }
 */
export const getAttendanceEvents = async (params = {}) => {
  const response = await api.get('/attendance/events', { params });
  return response.data;
};

/**
 * Get attendance report
 * @param {Object} params - { studentId, date, startDate, endDate, groupBy, department, year, section }
 */
export const getAttendanceReport = async (params = {}) => {
  const response = await api.get('/attendance/report', { params });
  return response.data;
};

/**
 * Get attendance for a specific student
 * @param {string} studentId - Student ID
 * @param {Object} params - { startDate, endDate }
 */
export const getAttendanceByStudent = async (studentId, params = {}) => {
  const response = await api.get(`/attendance/report`, {
    params: { studentId, ...params },
  });
  return response.data;
};

/**
 * Create manual attendance entry
 * @param {Object} data - { studentId, action, session, timestamp, deviceId }
 */
export const createManualAttendance = async (data) => {
  const response = await api.post('/attendance/manual', data);
  return response.data;
};

/**
 * Process attendance (simulate fingerprint scan)
 * @param {Object} data - { fingerprintId, deviceId, timestamp }
 */
export const processAttendance = async (data) => {
  const response = await api.post('/attendance/process', data);
  return response.data;
};
