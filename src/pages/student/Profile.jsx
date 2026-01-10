import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>

      {/* Personal Information */}
      <Card title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student ID
            </label>
            <p className="text-lg font-semibold text-gray-900">{user?.studentId}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <p className="text-lg text-gray-900">{user?.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <Badge variant="primary">{user?.role?.toUpperCase()}</Badge>
          </div>
        </div>
      </Card>

      {/* Academic Information */}
      <Card title="Academic Information">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <p className="text-lg font-semibold text-gray-900">{user?.department}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <p className="text-lg font-semibold text-gray-900">Year {user?.year}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <p className="text-lg font-semibold text-gray-900">Section {user?.section}</p>
          </div>
        </div>
      </Card>

      {/* Fingerprint Enrollment */}
      <Card title="Fingerprint Enrollment">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                user?.fingerprintId ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">
                  Enrollment Status
                </p>
                <Badge variant={user?.fingerprintId ? 'success' : 'warning'} className="mt-1">
                  {user?.fingerprintId ? 'Enrolled' : 'Not Enrolled'}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              {user?.fingerprintId ? (
                <>
                  <p className="text-sm text-gray-600">Fingerprint ID</p>
                  <p className="text-2xl font-bold text-gray-900">{user.fingerprintId}</p>
                </>
              ) : (
                <p className="text-sm text-gray-600 max-w-xs">
                  Contact your teacher or admin to enroll your fingerprint
                </p>
              )}
            </div>
          </div>

          {user?.fingerprintId && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Device ID
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {user.deviceId || 'Not assigned'}
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enrollment Date
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {user.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>
          )}

          {!user?.fingerprintId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Fingerprint Enrollment Required
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      To use the fingerprint attendance system, you need to enroll your fingerprint.
                      Please contact your teacher or the admin office to schedule an enrollment session.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Account Security */}
      <Card title="Account Security">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">Password</p>
              <p className="text-sm text-gray-600">Last changed: Not available</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition">
              Change Password
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Note:</span> If you need to update any personal information or have issues with your account, 
              please contact the administration office.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
