// User Roles
export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
};

// Session Types
export const SESSIONS = {
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
};

// Attendance Actions
export const ATTENDANCE_ACTIONS = {
  IN: 'IN',
  OUT: 'OUT',
};

// Session Windows
export const SESSION_WINDOWS = {
  MORNING: {
    START: '09:00',
    END: '12:30',
  },
  AFTERNOON: {
    START: '13:30',
    END: '16:30',
  },
};

// Academic Years
export const YEARS = [1, 2, 3, 4];

// Default Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 50,
  DEFAULT_SKIP: 0,
};

// Device Models
export const DEVICE_MODELS = {
  R307: 'R307',
  R305: 'R305',
};

// Report Types
export const REPORT_TYPES = {
  STUDENT: 'student',
  CLASS: 'class',
  DAILY: 'daily',
};

// Date Format
export const DATE_FORMAT = 'YYYY-MM-DD';

// Status Colors (for Tailwind)
export const STATUS_COLORS = {
  ONLINE: 'text-green-600 bg-green-100',
  OFFLINE: 'text-gray-600 bg-gray-100',
  ACTIVE: 'text-green-600 bg-green-100',
  INACTIVE: 'text-red-600 bg-red-100',
  PRESENT: 'text-green-600 bg-green-100',
  ABSENT: 'text-red-600 bg-red-100',
  PARTIAL: 'text-yellow-600 bg-yellow-100',
};
