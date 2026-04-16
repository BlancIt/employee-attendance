import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/employee/ProfilePage';
import AttendancePage from './pages/employee/AttendancePage';
import AttendanceSummaryPage from './pages/employee/AttendanceSummaryPage';
import EmployeeLayout from './layouts/EmployeeLayout';
import AdminLayout from './layouts/AdminLayout';

// Protects routes - redirects to login if not authenticated
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
};

// Protects admin routes - redirects to profile if not admin
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/profile" />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={isAdmin ? '/admin/employees' : '/profile'} /> : <LoginPage />}
      />

      {/* Employee Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/profile" />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="attendance-summary" element={<AttendanceSummaryPage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/employees" />} />
        <Route path="employees" element={<div>Employee Management (coming soon)</div>} />
        <Route path="attendance" element={<div>Attendance Monitoring (coming soon)</div>} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
        },
      }}
    >
      <AntApp>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </AntApp>
    </ConfigProvider>
  );
};

export default App;