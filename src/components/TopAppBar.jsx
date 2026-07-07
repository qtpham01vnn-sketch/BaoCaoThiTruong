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
              className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                location.pathname === '/' ? 'text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container'
              }`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Home
            </button>
            <button
              onClick={() => navigate('/create')}
              className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                location.pathname === '/create' ? 'text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container'
              }`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              New Report
            </button>
          </nav>
        )}
        {rightContent}
      </div>
    </header>
  );
}
