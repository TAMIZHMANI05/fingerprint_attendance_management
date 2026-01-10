import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import Layout from '@/components/layout/Layout';
import Login from '@/pages/Login';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import TeacherDashboard from '@/pages/teacher/TeacherDashboard';
import StudentDashboard from '@/pages/student/StudentDashboard';
import { ROLES } from '@/utils/constants';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes with Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Admin Routes */}
            <Route
              path="admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Teacher Routes */}
            <Route
              path="teacher/dashboard"
              element={
                <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="student/dashboard"
              element={
                <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 404 - Redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;