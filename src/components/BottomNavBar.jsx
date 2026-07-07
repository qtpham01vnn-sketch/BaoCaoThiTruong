import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', icon: 'home', label: 'Trang chủ' },
  { path: '/create', icon: 'add_circle', label: 'Tạo mới' },
  { path: '/settings', icon: 'settings', label: 'Cài đặt' },
];

export default function BottomNavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 bg-surface border-t border-outline-variant">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-2xl transition-all duration-300 active:scale-90 ${
              isActive
                ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/30'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="text-[11px] mt-0.5 font-medium" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
