import { useState, useEffect } from 'react';
import { getStudents, deleteStudent } from '@/services/studentService';
import Table from '@/components/common/Table';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Select from '@/components/common/Select';
import Pagination from '@/components/common/Pagination';
import StudentModal from './StudentModal';
import { YEARS } from '@/utils/constants';
import toast from 'react-hot-toast';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    year: '',
    section: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, [filters, currentPage, itemsPerPage]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        limit: itemsPerPage,
        skip: (currentPage - 1) * itemsPerPage,
      };
      const response = await getStudents(params);
      setStudents(response.data.students);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleCreate = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = async (student) => {
    if (!window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      return;
    }

    try {
      await deleteStudent(student._id);
      toast.success('Student deleted successfully');
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleModalClose = (shouldRefresh) => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    if (shouldRefresh) {
      fetchStudents();
    }
  };

  const columns = [
    {
      key: 'studentId',
      label: 'Student ID',
      sortable: true,
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true,
    },
    {
      key: 'year',
      label: 'Year',
      render: (value) => `Year ${value}`,
    },
    {
      key: 'section',
      label: 'Section',
    },
    {
      key: 'fingerprintId',
      label: 'Fingerprint',
      render: (value, student) =>
        value ? (
          <Badge variant="success">
            ID: {value} ({student.deviceId})
          </Badge>
        ) : (
          <Badge variant="warning">Not Enrolled</Badge>
        ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, student) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(student)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(student)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <Button onClick={handleCreate}>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Student
        </Button>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />

          <input
            type="text"
            placeholder="Department..."
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />

          <Select
            name="year"
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            options={YEARS.map((y) => ({ value: y, label: `Year ${y}` }))}
            placeholder="All Years"
          />

          <input
            type="text"
            placeholder="Section..."
            value={filters.section}
            onChange={(e) => handleFilterChange('section', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>

        <Table
          columns={columns}
          data={students}
          loading={loading}
          emptyMessage="No students found"
        />

        <Pagination
          currentPage={currentPage}
          totalItems={total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value);
            setCurrentPage(1);
          }}
        />
      </Card>

      {isModalOpen && (
        <StudentModal
          student={selectedStudent}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Students;
