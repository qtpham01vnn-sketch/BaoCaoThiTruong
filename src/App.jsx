import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CreateReportPage from './pages/CreateReportPage';
import ReportDetailPage from './pages/ReportDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<DashboardPage />} />
        <Route path="/create" element={<CreateReportPage />} />
        <Route path="/report/:id" element={<ReportDetailPage />} />
        <Route path="/settings" element={<SettingsPlaceholder />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function SettingsPlaceholder() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-4 block">settings</span>
        <h2 className="text-xl font-semibold text-on-surface">Cài đặt</h2>
        <p className="text-sm text-on-surface-variant mt-2">Tính năng đang được phát triển.</p>
      </div>
    </div>
  );
}
