import api from '@/utils/api';

/**
 * Get all devices
 * @param {Object} params - { department, year, section, isActive, isOnline, search, limit, skip }
 */
export const getDevices = async (params = {}) => {
  const response = await api.get('/devices', { params });
  return response.data;
};

/**
 * Get device by ID
 * @param {string} id - Device ID
 */
export const getDeviceById = async (id) => {
  const response = await api.get(`/devices/${id}`);
  return response.data;
};

/**
 * Create new device
 * @param {Object} data - { deviceId, name, department, year, section, model, maxFingerprints }
 */
export const createDevice = async (data) => {
  const response = await api.post('/devices', data);
  return response.data;
};

/**
 * Update device
 * @param {string} id - Device ID
 * @param {Object} data - { name, department, year, section, isActive }
 */
export const updateDevice = async (id, data) => {
  const response = await api.put(`/devices/${id}`, data);
  return response.data;
};

/**
 * Delete device
 * @param {string} id - Device ID
 */
export const deleteDevice = async (id) => {
  const response = await api.delete(`/devices/${id}`);
  return response.data;
};

/**
 * Update device status
 * @param {string} deviceId - Device ID
 * @param {Object} data - { isOnline, lastSeen }
 */
export const updateDeviceStatus = async (deviceId, data) => {
  const response = await api.patch(`/devices/${deviceId}/status`, data);
  return response.data;
};
