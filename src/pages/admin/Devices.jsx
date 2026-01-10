import { useState, useEffect } from 'react';
import { getDevices, deleteDevice } from '@/services/deviceService';
import Table from '@/components/common/Table';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Pagination from '@/components/common/Pagination';
import DeviceModal from './DeviceModal';
import { formatDateTime } from '@/utils/helpers';
import toast from 'react-hot-toast';

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    fetchDevices();
  }, [search, currentPage, itemsPerPage]);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await getDevices({
        search,
        limit: itemsPerPage,
        skip: (currentPage - 1) * itemsPerPage,
      });
      setDevices(response.data.devices || []);
      setTotal(response.data.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedDevice(null);
    setIsModalOpen(true);
  };

  const handleEdit = (device) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  const handleDelete = async (device) => {
    if (!window.confirm(`Are you sure you want to delete ${device.name}?`)) {
      return;
    }

    try {
      await deleteDevice(device._id);
      toast.success('Device deleted successfully');
      fetchDevices();
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  const handleModalClose = (shouldRefresh) => {
    setIsModalOpen(false);
    setSelectedDevice(null);
    if (shouldRefresh) {
      fetchDevices();
    }
  };

  const columns = [
    {
      key: 'deviceId',
      label: 'Device ID',
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
      key: 'isOnline',
      label: 'Status',
      render: (value) => (
        <Badge variant={value ? 'success' : 'default'}>
          {value ? 'Online' : 'Offline'}
        </Badge>
      ),
    },
    {
      key: 'enrolledCount',
      label: 'Enrolled',
      render: (value, device) => `${value}/${device.maxFingerprints}`,
    },
    {
      key: 'lastSeen',
      label: 'Last Seen',
      render: (value) => (value ? formatDateTime(value) : 'Never'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, device) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(device)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(device)}
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
        <h1 className="text-3xl font-bold text-gray-900">Devices</h1>
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
          Add Device
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by device ID or name..."
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
          data={devices}
          loading={loading}
          emptyMessage="No devices found"
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
        <DeviceModal
          device={selectedDevice}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Devices;
