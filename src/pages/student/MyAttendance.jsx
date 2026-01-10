import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAttendanceReport } from '@/services/attendanceService';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Table from '@/components/common/Table';
import Badge from '@/components/common/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatDate } from '@/utils/helpers';
import toast from 'react-hot-toast';

const MyAttendance = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    // Default to last 30 days
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setDateRange({
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    });

    fetchAttendance(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
  }, []);

  const fetchAttendance = async (startDate, endDate) => {
    setLoading(true);
    try {
      const response = await getAttendanceReport({
        studentId: user.studentId,
        startDate,
        endDate,
      });

      if (response.data && response.data.type === 'student') {
        setAttendanceData(response.data);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      toast.error('Please select both start and end dates');
      return;
    }
    fetchAttendance(dateRange.startDate, dateRange.endDate);
  };

  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (value) => (
        <div>
          <p className="font-semibold">{formatDate(value)}</p>
          <p className="text-xs text-gray-500">
            {new Date(value).toLocaleDateString('en-US', { weekday: 'long' })}
          </p>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'morning',
      label: 'Morning Session',
      render: (value) => {
        if (value?.present && value.inTime) {
          return (
            <div>
              <Badge variant="success">Present</Badge>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(value.inTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          );
        }
        return <Badge variant="danger">Absent</Badge>;
      },
    },
    {
      key: 'afternoon',
      label: 'Afternoon Session',
      render: (value) => {
        if (value?.present && value.inTime) {
          return (
            <div>
              <Badge variant="success">Present</Badge>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(value.inTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          );
        }
        return <Badge variant="danger">Absent</Badge>;
      },
    },
    {
      key: 'status',
      label: 'Day Status',
      render: (_, record) => {
        const morning = record.morning;
        const afternoon = record.afternoon;
        const isFullDay = morning?.present && afternoon?.present;
        const isAbsent = !morning?.present && !afternoon?.present;

        if (isFullDay) {
          return <Badge variant="success">Full Day</Badge>;
        } else if (isAbsent) {
          return <Badge variant="danger">Absent</Badge>;
        } else {
          return <Badge variant="warning">Partial</Badge>;
        }
      },
    },
  ];

  if (loading && !attendanceData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">My Attendance</h1>

      {/* Summary Card */}
      {attendanceData && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Days</p>
              <p className="text-2xl font-bold text-gray-900">
                {attendanceData.dateRange?.totalDays || 0}
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600">Days Present</p>
              <p className="text-2xl font-bold text-green-600">
                {attendanceData.summary?.totalDaysPresent || 0}
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600">Morning</p>
              <p className="text-2xl font-bold text-blue-600">
                {attendanceData.summary?.morningPresent || 0}
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600">Afternoon</p>
              <p className="text-2xl font-bold text-purple-600">
                {attendanceData.summary?.afternoonPresent || 0}
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-indigo-600">
                {attendanceData.summary?.attendancePercentage || 0}%
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card title="Select Date Range">
        <div className="flex items-end space-x-4">
          <Input
            label="Start Date"
            type="date"
            value={dateRange.startDate}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
            }
          />
          <Input
            label="End Date"
            type="date"
            value={dateRange.endDate}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
            }
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? 'Loading...' : 'Search'}
          </Button>
        </div>
      </Card>

      {/* Attendance Table */}
      <Card title="Attendance Records">
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <Table
            columns={columns}
            data={attendanceData?.dailyAttendance || []}
            emptyMessage="No attendance records found for the selected date range"
          />
        )}
      </Card>
    </div>
  );
};

export default MyAttendance;
