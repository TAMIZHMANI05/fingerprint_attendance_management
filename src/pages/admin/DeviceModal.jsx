import { useState, useEffect } from 'react';
import { createDevice, updateDevice } from '@/services/deviceService';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Button from '@/components/common/Button';
import { YEARS } from '@/utils/constants';
import toast from 'react-hot-toast';

const DeviceModal = ({ device, onClose }) => {
  const isEdit = !!device;
  const [formData, setFormData] = useState({
    deviceId: '',
    name: '',
    department: '',
    year: '',
    section: '',
    model: 'R307',
    maxFingerprints: 200,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (device) {
      setFormData({
        deviceId: device.deviceId || '',
        name: device.name || '',
        department: device.department || '',
        year: device.year || '',
        section: device.section || '',
        model: device.model || 'R307',
        maxFingerprints: device.maxFingerprints || 200,
      });
    }
  }, [device]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.deviceId.trim()) newErrors.deviceId = 'Device ID is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
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
        deviceId: formData.deviceId.toUpperCase(),
        name: formData.name,
        department: formData.department,
        year: parseInt(formData.year),
        section: formData.section.toUpperCase(),
        model: formData.model,
        maxFingerprints: parseInt(formData.maxFingerprints),
      };

      if (isEdit) {
        await updateDevice(device._id, data);
        toast.success('Device updated successfully');
      } else {
        await createDevice(data);
        toast.success('Device created successfully');
      }
      onClose(true);
    } catch (error) {
      console.error('Error saving device:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={() => onClose(false)}
      title={isEdit ? 'Edit Device' : 'Add Device'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Device ID"
            name="deviceId"
            value={formData.deviceId}
            onChange={handleChange}
            error={errors.deviceId}
            required
            disabled={isEdit}
            placeholder="ESP32_001"
          />

          <Input
            label="Device Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder="CS Department - Year 2A"
          />
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

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            options={[
              { value: 'R307', label: 'R307' },
              { value: 'R305', label: 'R305' },
            ]}
          />

          <Input
            label="Max Fingerprints"
            type="number"
            name="maxFingerprints"
            value={formData.maxFingerprints}
            onChange={handleChange}
            min="1"
            max="1000"
          />
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

export default DeviceModal;
