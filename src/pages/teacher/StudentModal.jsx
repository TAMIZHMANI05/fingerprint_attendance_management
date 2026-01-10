import { useState, useEffect } from 'react';
import { createStudent, updateStudent } from '@/services/studentService';
import { getDevices } from '@/services/deviceService';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Button from '@/components/common/Button';
import { isValidEmail } from '@/utils/helpers';
import { YEARS } from '@/utils/constants';
import toast from 'react-hot-toast';

const StudentModal = ({ student, onClose }) => {
  const isEdit = !!student;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    department: '',
    year: '',
    section: '',
    fingerprintId: '',
    deviceId: '',
  });
  const [devices, setDevices] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDevices();
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        password: '',
        studentId: student.studentId || '',
        department: student.department || '',
        year: student.year || '',
        section: student.section || '',
        fingerprintId: student.fingerprintId || '',
        deviceId: student.deviceId || '',
      });
    }
  }, [student]);

  const fetchDevices = async () => {
    try {
      const response = await getDevices({ limit: 100 });
      setDevices(response.data.devices || []);
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!isEdit && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isEdit && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.section.trim()) newErrors.section = 'Section is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const data = {
        name: formData.name,
        email: formData.email,
        studentId: formData.studentId.toUpperCase(),
        department: formData.department,
        year: parseInt(formData.year),
        section: formData.section.toUpperCase(),
      };

      if (!isEdit) {
        data.password = formData.password;
      }

      if (formData.fingerprintId) {
        data.fingerprintId = parseInt(formData.fingerprintId);
      }
      if (formData.deviceId) {
        data.deviceId = formData.deviceId;
      }

      if (isEdit) {
        await updateStudent(student._id, data);
        toast.success('Student updated successfully');
      } else {
        await createStudent(data);
        toast.success('Student created successfully');
      }
      onClose(true);
    } catch (error) {
      console.error('Error saving student:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={() => onClose(false)}
      title={isEdit ? 'Edit Student' : 'Add Student'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Student ID"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            error={errors.studentId}
            required
            disabled={isEdit}
            placeholder="CS2024001"
          />

          {!isEdit && (
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              placeholder="Minimum 6 characters"
            />
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            error={errors.department}
            required
            placeholder="Computer Science"
          />

          <Select
            label="Year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            error={errors.year}
            options={YEARS.map((y) => ({ value: y, label: `Year ${y}` }))}
            required
          />

          <Input
            label="Section"
            name="section"
            value={formData.section}
            onChange={handleChange}
            error={errors.section}
            required
            placeholder="A"
          />
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-900 mb-3">Fingerprint Enrollment (Optional)</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fingerprint ID"
              type="number"
              name="fingerprintId"
              value={formData.fingerprintId}
              onChange={handleChange}
              placeholder="1-200"
              min="1"
              max="200"
            />

            <Select
              label="Device"
              name="deviceId"
              value={formData.deviceId}
              onChange={handleChange}
              options={devices.map((d) => ({ value: d.deviceId, label: `${d.deviceId} - ${d.name}` }))}
              placeholder="Select device"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onClose(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StudentModal;
