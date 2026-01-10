import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getTeachers } from '@/services/teacherService';
import { getStudents } from '@/services/studentService';
import { getDevices } from '@/services/deviceService';
import { getAttendanceReport } from '@/services/attendanceService';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { getTodayDate, getDateRange } from '@/utils/helpers';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalStudents: 0,
    totalDevices: 0,
    onlineDevices: 0,
    enrolledStudents: 0,
  });
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [classAttendance, setClassAttendance] = useState([]);
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch basic stats
      const [teachersRes, studentsRes, devicesRes] = await Promise.all([
        getTeachers({ limit: 1 }),
        getStudents({ limit: 1 }),
        getDevices({ limit: 100 }),
      ]);

      const allStudents = await getStudents({ limit: 1000 });
      const enrolledCount = allStudents.data.students.filter(s => s.fingerprintId).length;

      setStats({
        totalTeachers: teachersRes.data.total,
        totalStudents: studentsRes.data.total,
        totalDevices: devicesRes.data.pagination?.total || 0,
        onlineDevices: devicesRes.data.devices.filter(d => d.isOnline).length,
        enrolledStudents: enrolledCount,
      });

      // Fetch today's attendance
      const todayReport = await getAttendanceReport({
        groupBy: 'class',
        date: getTodayDate(),
      });

      if (todayReport.data.type === 'class') {
        setTodayAttendance(todayReport.data.overallSummary);
        setClassAttendance(todayReport.data.classes.slice(0, 5));
      }

      // Fetch weekly attendance trend
      const weekData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        try {
          const dayReport = await getAttendanceReport({
            groupBy: 'class',
            date: dateStr,
          });
          
          if (dayReport.data.type === 'class' && dayReport.data.overallSummary) {
            weekData.push({
              date: date.toLocaleDateString('en-US', { weekday: 'short' }),
              present: dayReport.data.overallSummary.fullyPresent || 0,
              absent: (dayReport.data.overallSummary.totalStudents || 0) - (dayReport.data.overallSummary.fullyPresent || 0),
            });
          } else {
            // No data for this day
            weekData.push({
              date: date.toLocaleDateString('en-US', { weekday: 'short' }),
              present: 0,
              absent: 0,
            });
          }
        } catch (error) {
          console.error(`Error fetching data for ${dateStr}:`, error);
          weekData.push({
            date: date.toLocaleDateString('en-US', { weekday: 'short' }),
            present: 0,
            absent: 0,
          });
        }
      }
      setWeeklyTrend(weekData);
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

  const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  const attendanceRate = todayAttendance
    ? ((todayAttendance.fullyPresent / todayAttendance.totalStudents) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.enrolledStudents} enrolled
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Teachers</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTeachers}</p>
              <p className="text-xs text-green-600 mt-1">Active</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Devices</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalDevices}</p>
              <p className="text-xs text-cyan-600 mt-1">
                {stats.onlineDevices} online
              </p>
            </div>
            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Attendance</p>
              <p className="text-3xl font-bold text-gray-900">{attendanceRate}%</p>
              <p className="text-xs text-gray-500 mt-1">
                {todayAttendance?.fullyPresent || 0} / {todayAttendance?.totalStudents || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Enrollment Rate</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalStudents > 0 ? ((stats.enrolledStudents / stats.totalStudents) * 100).toFixed(0) : 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Fingerprints</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Attendance Trend */}
        <Card title="Weekly Attendance Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2} name="Present" />
              <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} name="Absent" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Class-wise Attendance */}
        <Card title="Today's Class Attendance">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={classAttendance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" angle={-15} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="fullyPresent" fill="#4f46e5" name="Present" />
              <Bar dataKey="absent" fill="#ef4444" name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Today's Class Summary */}
      {classAttendance.length > 0 && (
        <Card title="Today's Class Summary">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance %</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classAttendance.map((cls, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cls.class}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.totalStudents}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Badge variant="success">{cls.fullyPresent}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Badge variant="danger">{cls.absent}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">
                      {((cls.fullyPresent / cls.totalStudents) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
