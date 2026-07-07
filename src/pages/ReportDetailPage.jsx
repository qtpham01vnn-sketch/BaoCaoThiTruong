import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import { getReportById, updateReport } from '../lib/storage';

const STATUS_MAP = {
  approved: { label: 'Đã phê duyệt', bg: 'bg-tertiary-fixed', text: 'text-on-tertiary-fixed-variant' },
  completed: { label: 'Hoàn thành', bg: 'bg-tertiary-fixed', text: 'text-on-tertiary-fixed-variant' },
  in_progress: { label: 'Đang xử lý', bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
  needs_review: { label: 'Cần duyệt', bg: 'bg-error-container', text: 'text-on-error-container' },
  draft: { label: 'Bản nháp', bg: 'bg-surface-container-high', text: 'text-on-surface-variant' },
};

function formatDate(isoString) {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    const data = getReportById(id);
    if (!data) {
      navigate('/');
      return;
    }
    setReport(data);
  }, [id, navigate]);

  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const textToCopy = report.aiReport || report.rawNotes;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    alert('Đã copy nội dung báo cáo!');
  };

  const handleStatusUpdate = (newStatus) => {
    const updated = updateReport(report.id, { status: newStatus });
    if (updated) {
      setReport(updated);
      alert(newStatus === 'approved' ? 'Đã phê duyệt báo cáo!' : 'Đã yêu cầu bổ sung thông tin!');
    }
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackText.trim()) return;
    const newFeedback = {
      author: 'Quản lý (Bạn)',
      initials: 'QL',
      time: 'Vừa xong',
      message: feedbackText.trim()
    };
    const updated = updateReport(report.id, { feedback: newFeedback });
    if (updated) {
      setReport(updated);
      setFeedbackText('');
      alert('Đã gửi góp ý thành công!');
    }
  };

  const status = STATUS_MAP[report.status] || STATUS_MAP.draft;

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <div className="print:hidden">
        <TopAppBar
          title="BaoCaoThiTruong"
          showBack
          rightContent={
            <div className="flex gap-4 items-center">
              <span className="text-on-surface-variant text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                ID: RPT-{report.id}
              </span>
              <div className={`${status.bg} ${status.text} px-3 py-1 rounded-full text-xs font-medium`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {status.label}
              </div>
            </div>
          }
        />
      </div>

      <main className="mt-20 mb-24 max-w-[1200px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-4 page-enter">
        {/* Left Column: Primary Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Card */}
          <section className="bg-white border border-outline-variant p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
            <div>
              <h2 className="text-2xl font-semibold text-on-surface">{report.title}</h2>
              <div className="flex items-center gap-4 mt-2 text-on-surface-variant">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{formatDate(report.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">route</span>
                  <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Tuyến: {report.route}</span>
                </div>
                {report.vehicleNumber && (
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">directions_car</span>
                    <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Số xe: {report.vehicleNumber}</span>
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold text-sm hover:opacity-90 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Xuất PDF
            </button>
          </section>

          {/* AI Finalized Report */}
          <article className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-4 md:p-10 relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 flex items-center">
              <button 
                onClick={handleCopy}
                className="px-4 py-1.5 bg-surface-container-high text-primary text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:bg-surface-dim transition-colors"
              >
                <span className="material-symbols-outlined text-[12px]">content_copy</span>
                Copy
              </button>
              <div className="px-4 py-1.5 bg-gradient-to-r from-primary to-primary-container text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 rounded-bl-lg">
                <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                AI Optimized
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <div className="pb-4">
                <p className="text-base text-on-surface leading-relaxed whitespace-pre-wrap font-medium">
                  {report.aiReport || report.rawNotes}
                </p>
              </div>
            </div>
          </article>

          {/* Feedback Section */}
          <section className="bg-white border border-outline-variant overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="bg-surface-container px-4 py-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">chat_bubble</span>
              <h3 className="text-lg font-semibold text-on-surface">Góp ý từ quản lý</h3>
            </div>
            <div className="p-4 space-y-4">
              {/* Existing feedback */}
              {report.feedback && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold shrink-0 text-sm">
                    {report.feedback.initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-on-surface">{report.feedback.author}</span>
                      <span className="text-on-surface-variant text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>• {report.feedback.time}</span>
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-lg text-base text-on-surface">
                      {report.feedback.message}
                    </div>
                  </div>
                </div>
              )}

              {/* Add Feedback */}
              <div className="pt-4 border-t border-outline-variant">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <textarea
                      className="w-full bg-surface border border-outline-variant rounded-lg p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none min-h-[80px] text-base"
                      placeholder="Nhập ý kiến phản hồi hoặc chỉ đạo mới..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setFeedbackText('')}
                        className="px-4 py-2 font-semibold text-sm text-on-surface-variant hover:bg-surface-container rounded-lg"
                      >
                        Hủy
                      </button>
                      <button 
                        onClick={handleFeedbackSubmit}
                        disabled={!feedbackText.trim()}
                        className="px-6 py-2 bg-primary text-on-primary font-semibold text-sm rounded-lg hover:opacity-90 active:scale-95 disabled:opacity-50"
                      >
                        Gửi phản hồi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Meta */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Agent Details */}
          <section className="bg-white border border-outline-variant p-4 space-y-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <h4 className="text-xs uppercase font-bold text-on-surface-variant" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Thông tin nhân sự
            </h4>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-lg">
                {report.agentName?.charAt(0) || 'N'}
              </div>
              <div>
                <div className="font-semibold text-sm text-on-surface">{report.agentName}</div>
                <div className="text-on-surface-variant text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  Nhân viên thị trường (Field Agent)
                </div>
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-outline-variant">
              <div className="flex justify-between text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                <span className="text-on-surface-variant">Thời gian bắt đầu:</span>
                <span className="text-on-surface">{report.startTime || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                <span className="text-on-surface-variant">Thời gian kết thúc:</span>
                <span className="text-on-surface">{report.endTime || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                <span className="text-on-surface-variant">Thời lượng:</span>
                <span className="text-on-surface">{report.duration || 'N/A'}</span>
              </div>
            </div>
          </section>

          {/* Dealer Info */}
          <section className="bg-white border border-outline-variant p-4 space-y-2 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <h4 className="text-xs uppercase font-bold text-on-surface-variant" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Thông tin đại lý
            </h4>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">storefront</span>
              <span className="text-base font-medium">{report.dealer}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">route</span>
              <span className="text-sm text-on-surface-variant">{report.route}</span>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="space-y-2 print:hidden">
            <button 
              onClick={() => handleStatusUpdate('needs_review')}
              className="w-full py-3 border border-primary text-primary font-semibold text-sm rounded-xl hover:bg-surface-container flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined">edit</span>
              Yêu cầu bổ sung thông tin
            </button>
            <button 
              onClick={() => handleStatusUpdate('approved')}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm rounded-xl hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all duration-300"
            >
              <span className="material-symbols-outlined">check_circle</span>
              Phê duyệt báo cáo
            </button>
          </section>
        </aside>
      </main>

      <div className="print:hidden">
        <BottomNavBar />
      </div>
    </div>
  );
}
