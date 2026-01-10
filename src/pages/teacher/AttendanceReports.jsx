import { useState } from 'react';
import { getAttendanceReport } from '@/services/attendanceService';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Table from '@/components/common/Table';
import Badge from '@/components/common/Badge';
import { formatDate, getTodayDate } from '@/utils/helpers';
import { YEARS } from '@/utils/constants';
import toast from 'react-hot-toast';

const AttendanceReports = () => {
  const [reportType, setReportType] = useState('daily');
  const [filters, setFilters] = useState({
    date: getTodayDate(),
    startDate: '',
    endDate: '',
    studentId: '',
    department: '',
    year: '',
    section: '',
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      let params = {};

      if (reportType === 'daily') {
        params = {
          date: filters.date,
          department: filters.department,
          year: filters.year,
          section: filters.section,
        };
      } else if (reportType === 'class') {
        params = {
          groupBy: 'class',
          date: filters.date,
        };
      } else if (reportType === 'student') {
        params = {
          studentId: filters.studentId,
          startDate: filters.startDate,
          endDate: filters.endDate,
        };
      }

      const response = await getAttendanceReport(params);
      setReportData(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const renderDailyReport = () => {
    if (!reportData || reportData.type !== 'daily') return null;

    const columns = [
      { key: 'studentId', label: 'Student ID', sortable: true },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'department', label: 'Department' },
      { key: 'year', label: 'Year', render: (v) => `Year ${v}` },
      { key: 'section', label: 'Section' },
      {
        key: 'morning',
        label: 'Morning',
        render: (value) => (
          <Badge variant={value?.present ? 'success' : 'danger'}>
            {value?.present ? 'Present' : 'Absent'}
          </Badge>
        ),
      },
      {
        key: 'afternoon',
        label: 'Afternoon',
        render: (value) => (
          <Badge variant={value?.present ? 'success' : 'danger'}>
            {value?.present ? 'Present' : 'Absent'}
          </Badge>
        ),
      },
      {
        key: 'fullyPresent',
        label: 'Status',
        render: (value) => (
          <Badge variant={value ? 'success' : 'warning'}>
            {value ? 'Full Day' : 'Partial'}
          </Badge>
        ),
      },
    ];

    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold">{reportData.summary.totalStudents}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fully Present</p>
              <p className="text-2xl font-bold text-green-600">{reportData.summary.fullyPresent}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Partial</p>
              <p className="text-2xl font-bold text-yellow-600">{reportData.summary.partialPresent}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-red-600">{reportData.summary.absent}</p>
            </div>
          </div>
        </div>
        <Table columns={columns} data={reportData.students || []} />
      </div>
    );
  };

  const renderClassReport = () => {
    if (!reportData || reportData.type !== 'class') return null;

    const columns = [
      { key: 'class', label: 'Class', sortable: true },
      { key: 'totalStudents', label: 'Total' },
      {
        key: 'fullyPresent',
        label: 'Full Day',
        render: (value, row) => (
          <span className="text-green-600 font-semibold">
            {value} ({((value / row.totalStudents) * 100).toFixed(1)}%)
          </span>
        ),
      },
      {
        key: 'morningPresent',
        label: 'Morning',
        render: (value, row) => `${value} / ${row.totalStudents}`,
      },
      {
        key: 'afternoonPresent',
        label: 'Afternoon',
        render: (value, row) => `${value} / ${row.totalStudents}`,
      },
      {
        key: 'absent',
        label: 'Absent',
        render: (value) => <span className="text-red-600 font-semibold">{value}</span>,
      },
    ];

    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Overall Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold">{reportData.overallSummary.totalStudents}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fully Present</p>
              <p className="text-2xl font-bold text-green-600">{reportData.overallSummary.fullyPresent}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-indigo-600">
                {((reportData.overallSummary.fullyPresent / reportData.overallSummary.totalStudents) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        <Table columns={columns} data={reportData.classes || []} />
      </div>
    );
  };

  const renderStudentReport = () => {
    if (!reportData || reportData.type !== 'student') return null;

    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Student Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold">{reportData.student.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Student ID</p>
              <p className="font-semibold">{reportData.student.studentId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Department</p>
              <p className="font-semibold">{reportData.student.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Year & Section</p>
              <p className="font-semibold">Year {reportData.student.year} - Section {reportData.student.section}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Attendance Summary</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Days</p>
              <p className="text-2xl font-bold">{reportData.dateRange.totalDays}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Days Present</p>
              <p className="text-2xl font-bold text-green-600">{reportData.summary.totalDaysPresent}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Attendance</p>
              <p className="text-2xl font-bold text-indigo-600">{reportData.summary.attendancePercentage}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Sessions</p>
              <p className="text-sm font-semibold">M: {reportData.summary.morningPresent} / A: {reportData.summary.afternoonPresent}</p>
            </div>
          </div>
        </div>

        <Card title="Daily Attendance">
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {reportData.dailyAttendance.map((day) => (
              <div key={day.date} className="border rounded p-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{formatDate(day.date)}</p>
                </div>
                <div className="flex space-x-4">
                  <Badge variant={day.morning?.present ? 'success' : 'danger'}>
                    Morning: {day.morning?.present ? 'Present' : 'Absent'}
                  </Badge>
                  <Badge variant={day.afternoon?.present ? 'success' : 'danger'}>
                    Afternoon: {day.afternoon?.present ? 'Present' : 'Absent'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Attendance Reports</h1>

      <Card title="Report Configuration">
        <div className="space-y-4">
          <Select
            label="Report Type"
            name="reportType"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            options={[
              { value: 'daily', label: 'Daily Report (by Class)' },
              { value: 'class', label: 'Class-wise Summary' },
              { value: 'student', label: 'Individual Student Report' },
            ]}
          />

          {reportType === 'daily' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                label="Date"
                type="date"
                name="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
              />
              <Input
                label="Department"
                name="department"
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                placeholder="Optional"
              />
              <Select
                label="Year"
                name="year"
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                options={YEARS.map((y) => ({ value: y, label: `Year ${y}` }))}
                placeholder="All Years"
              />
              <Input
                label="Section"
                name="section"
                value={filters.section}
                onChange={(e) => handleFilterChange('section', e.target.value)}
                placeholder="Optional"
              />
            </div>
          )}

          {reportType === 'class' && (
            <Input
              label="Date"
              type="date"
              name="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
            />
          )}

          {reportType === 'student' && (
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Student ID"
                name="studentId"
                value={filters.studentId}
                onChange={(e) => handleFilterChange('studentId', e.target.value)}
                placeholder="CS2024001"
                required
              />
              <Input
                label="Start Date"
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
              <Input
                label="End Date"
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
          )}

          <Button onClick={handleGenerateReport} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </Card>

      {reportData && (
        <Card title={`Report: ${reportData.type.toUpperCase()}`}>
          {reportData.type === 'daily' && renderDailyReport()}
          {reportData.type === 'class' && renderClassReport()}
          {reportData.type === 'student' && renderStudentReport()}
        </Card>
      )}
    </div>
  );
};

export default AttendanceReports;
