import { useNavigate, useLocation } from 'react-router-dom';

export default function TopAppBar({ title = 'BaoCaoThiTruong', showBack = false, rightContent = null }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="bg-surface border-b border-outline-variant flex justify-between items-center w-full px-4 h-16 z-50 fixed top-0 left-0 right-0">
      <div className="flex items-center gap-4">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="material-symbols-outlined text-primary hover:bg-surface-container p-2 rounded-full transition-colors active:scale-95"
          >
            arrow_back
          </button>
        )}
        <h1 className="font-bold text-xl text-primary" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
          {title}
        </h1>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex gap-6 items-center">
        {!showBack && (
          <nav className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-all duration-300 ${
                location.pathname === '/' ? 'bg-gradient-to-r from-teal-500 to-indigo-500 text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
              }`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Trang Chủ
            </button>
            <button
              onClick={() => navigate('/create')}
              className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-all duration-300 ${
                location.pathname === '/create' ? 'bg-gradient-to-r from-teal-500 to-indigo-500 text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
              }`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Tạo Báo Cáo
            </button>
          </nav>
        )}
        {rightContent}
      </div>
    </header>
  );
}
