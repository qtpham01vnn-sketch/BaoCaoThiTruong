import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import { getReports, seedDemoData } from '../lib/storage';

const STATUS_MAP = {
  approved: { label: 'Đã duyệt', bg: 'bg-tertiary-fixed', text: 'text-on-tertiary-fixed-variant' },
  completed: { label: 'Hoàn thành', bg: 'bg-tertiary-fixed', text: 'text-on-tertiary-fixed-variant' },
  in_progress: { label: 'Đang xử lý', bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
  needs_review: { label: 'Cần duyệt', bg: 'bg-error-container', text: 'text-on-error-container' },
  draft: { label: 'Bản nháp', bg: 'bg-surface-container-high', text: 'text-on-surface-variant' },
};

function formatDate(isoString) {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    seedDemoData();
    setReports(getReports());
  }, []);

  const filtered = reports.filter(
    (r) =>
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.route?.toLowerCase().includes(search.toLowerCase()) ||
      r.agentName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalReports = reports.length;

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <TopAppBar />

      <main className="pt-20 pb-24 px-4 md:px-8 max-w-[1200px] mx-auto page-enter">
        {/* Search and Filter */}
        <section className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-on-surface">Tổng Quan Thị Trường</h2>
              <p className="text-sm text-on-surface-variant">Xem và quản lý các báo cáo thị trường.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-grow md:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                <input
                  className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-0 text-sm outline-none"
                  placeholder="Tìm tuyến, đại lý..."
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* AI Summary Card */}
        <section className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-primary-fixed rounded-lg text-primary material-symbols-outlined">auto_awesome</span>
                <span className="text-lg font-semibold">Nhịp Đập Thị Trường</span>
              </div>
              <span className="text-xs text-outline" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Cập nhật 2h trước</span>
            </div>
            <p className="text-base text-on-surface-variant mb-6">
              Hoạt động thị trường tại khu vực <span className="font-bold text-on-surface">Bình Dương</span> ghi nhận tăng trưởng 14% sản lượng tiêu thụ tại hệ thống đại lý. Giá cạnh tranh từ đối thủ đang dần ổn định.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/create')}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-sm hover:opacity-90 active:scale-95"
              >
                <span className="group-hover:animate-pulse">✨ Phân Tích Bằng AI</span>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-200 rounded-xl p-4 flex flex-col justify-center items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <span className="text-5xl font-extrabold text-teal-600 mb-1 drop-shadow-sm">{totalReports}</span>
            <span className="text-xs text-on-surface-variant uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Báo cáo tháng này
            </span>
            <div className="mt-4 w-full bg-outline-variant h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((totalReports / 56) * 100, 100)}%` }}></div>
            </div>
            <span className="mt-2 text-sm text-on-surface-variant">{Math.round((totalReports / 56) * 100)}% mục tiêu tháng</span>
          </div>
        </section>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((report) => {
            const status = STATUS_MAP[report.status] || STATUS_MAP.draft;
            return (
              <div
                key={report.id}
                onClick={() => navigate(`/report/${report.id}`)}
                className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] hover:-translate-y-2 transition-all duration-300 group cursor-pointer active:scale-[0.98]"
              >
                <div className="h-28 bg-surface-container relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-tertiary-fixed/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary/20 text-6xl">description</span>
                  </div>
                  <div className={`absolute top-3 right-3 ${status.bg} ${status.text} px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider`}>
                    {status.label}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-on-surface-variant" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {formatDate(report.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                    {report.title || report.route}
                  </h3>
                  <p className="text-sm text-on-surface-variant mt-1 line-clamp-1">{report.route}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-outline-variant pt-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-base">person</span>
                      <span className="text-sm text-on-surface-variant">{report.agentName}</span>
                    </div>
                    <span className="material-symbols-outlined text-primary">chevron_right</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add New Placeholder */}
          <div
            onClick={() => navigate('/create')}
            className="bg-surface border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center p-10 hover:border-primary hover:bg-primary/5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer text-center group active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors mb-4" style={{ fontSize: '48px' }}>
              add_circle
            </span>
            <p className="text-lg font-semibold text-on-surface-variant">Tạo Báo Cáo Mới</p>
            <p className="text-sm text-outline">Nhấn để bắt đầu khảo sát</p>
          </div>
        </div>
      </main>

      <BottomNavBar />
    </div>
  );
}
