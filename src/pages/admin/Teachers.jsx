import { useState, useEffect } from 'react';
import { getTeachers, deleteTeacher } from '@/services/teacherService';
import Table from '@/components/common/Table';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Pagination from '@/components/common/Pagination';
import TeacherModal from './TeacherModal';
import { formatDateTime } from '@/utils/helpers';
import toast from 'react-hot-toast';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, [search, currentPage, itemsPerPage]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await getTeachers({
        search,
        limit: itemsPerPage,
        skip: (currentPage - 1) * itemsPerPage,
      });
      setTeachers(response.data.teachers);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedTeacher(null);
    setIsModalOpen(true);
  };

  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleDelete = async (teacher) => {
    if (!window.confirm(`Are you sure you want to delete ${teacher.name}?`)) {
      return;
    }

    try {
      await deleteTeacher(teacher._id);
      toast.success('Teacher deleted successfully');
      fetchTeachers();
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  const handleModalClose = (shouldRefresh) => {
    setIsModalOpen(false);
    setSelectedTeacher(null);
    if (shouldRefresh) {
      fetchTeachers();
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value) => (
        <Badge variant={value ? 'success' : 'danger'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created At',
      sortable: true,
      render: (value) => formatDateTime(value),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, teacher) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(teacher)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(teacher)}
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
        <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
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
          Add Teacher
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>

        <Table
          columns={columns}
          data={teachers}
          loading={loading}
          emptyMessage="No teachers found"
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
        <TeacherModal
          teacher={selectedTeacher}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Teachers;
