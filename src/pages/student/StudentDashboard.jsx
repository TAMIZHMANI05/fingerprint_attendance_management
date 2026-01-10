import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAttendanceReport } from '@/services/attendanceService';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatDate } from '@/utils/helpers';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Get last 30 days attendance
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const response = await getAttendanceReport({
        studentId: user.studentId,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      });

      if (response.data && response.data.type === 'student') {
        setStats(response.data.summary);
        // Get last 7 days for recent attendance
        const recent = response.data.dailyAttendance.slice(-7).reverse();
        setRecentAttendance(recent);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
          <p className="text-gray-600 mt-1">
            {user?.department} - Year {user?.year} - Section {user?.section}
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Attendance Rate</p>
              <p className="text-3xl font-bold text-indigo-600">
                {stats?.attendancePercentage || 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Days Present</p>
              <p className="text-3xl font-bold text-green-600">
                {stats?.totalDaysPresent || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Out of {stats?.totalDays || 0} days</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Morning Sessions</p>
              <p className="text-3xl font-bold text-blue-600">
                {stats?.morningPresent || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Sessions attended</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Afternoon Sessions</p>
              <p className="text-3xl font-bold text-purple-600">
                {stats?.afternoonPresent || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Sessions attended</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Attendance */}
      <Card title="Recent Attendance (Last 7 Days)">
        <div className="space-y-3">
          {recentAttendance.length > 0 ? (
            recentAttendance.map((day, index) => {
              const morning = day.morning;
              const afternoon = day.afternoon;
              const isFullDay = morning?.present && afternoon?.present;
              const isAbsent = !morning?.present && !afternoon?.present;

              return (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isFullDay ? 'bg-green-100' : isAbsent ? 'bg-red-100' : 'bg-yellow-100'
                        }`}>
                          {isFullDay ? (
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : isAbsent ? (
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{formatDate(day.date)}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">Morning</p>
                        <Badge variant={morning?.present ? 'success' : 'danger'}>
                          {morning?.present ? 'Present' : 'Absent'}
                        </Badge>
                        {morning?.present && morning.inTime && (
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(morning.inTime).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        )}
                      </div>

                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">Afternoon</p>
                        <Badge variant={afternoon?.present ? 'success' : 'danger'}>
                          {afternoon?.present ? 'Present' : 'Absent'}
                        </Badge>
                        {afternoon?.present && afternoon.inTime && (
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(afternoon.inTime).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No attendance records found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Fingerprint Status */}
      <Card title="Fingerprint Enrollment Status">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              user?.fingerprintId ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {user?.fingerprintId ? 'Fingerprint Enrolled' : 'Not Enrolled'}
              </p>
              {user?.fingerprintId ? (
                <p className="text-sm text-gray-600">
                  ID: {user.fingerprintId} | Device: {user.deviceId}
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  Contact your teacher or admin to enroll your fingerprint
                </p>
              )}
            </div>
          </div>
          <Badge variant={user?.fingerprintId ? 'success' : 'warning'}>
            {user?.fingerprintId ? 'Active' : 'Pending'}
          </Badge>
        </div>
      </Card>
    </div>
  );
};

export default StudentDashboard;
