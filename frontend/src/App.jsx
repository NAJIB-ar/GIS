import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GuestRoute, ProtectedRoute, AdminRoute } from './components/RouteGuards';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ReportFormPage from './pages/ReportFormPage';

import ProviderManagementPage from './pages/ProviderManagementPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Guest only */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Admin only */}
          <Route element={<AdminRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/providers" element={<ProviderManagementPage />} />
          </Route>

          {/* Any authenticated user */}
          <Route element={<ProtectedRoute />}>
            <Route path="/report" element={<ReportFormPage />} />
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
