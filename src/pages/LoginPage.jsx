import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 relative">
      {/* Subtle background */}
      <div className="fixed inset-0 -z-10 bg-surface">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, #003d9b 0%, transparent 50%), radial-gradient(circle at 75% 75%, #71dba6 0%, transparent 50%)',
          }}
        />
      </div>

      <main className="w-full max-w-md page-enter">
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-primary flex items-center justify-center rounded-xl mb-4 login-card">
            <span className="material-symbols-outlined text-on-primary text-4xl">analytics</span>
          </div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            BaoCaoThiTruong
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">Hệ thống phân tích thị trường chuyên sâu</p>
        </div>

        {/* Login Container */}
        <section className="bg-surface-container-lowest p-6 md:p-10 rounded-xl border border-outline-variant login-card">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-on-surface mb-1">Đăng nhập</h2>
            <p className="text-sm text-on-surface-variant">Vui lòng sử dụng tài khoản doanh nghiệp được cấp.</p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="space-y-1">
              <label
                className="block text-xs font-medium text-on-surface-variant uppercase tracking-wider"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                htmlFor="email"
              >
                Email công ty
              </label>
              <div className="relative flex items-center">
                <span className={`material-symbols-outlined absolute left-3 text-xl transition-colors ${focusedField === 'email' ? 'text-primary' : 'text-outline'}`}>
                  corporate_fare
                </span>
                <input
                  className="w-full pl-11 pr-4 py-3 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base outline-none"
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label
                  className="block text-xs font-medium text-on-surface-variant uppercase tracking-wider"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  htmlFor="password"
                >
                  Mật khẩu
                </label>
                <a className="text-xs text-primary hover:underline" style={{ fontFamily: "'JetBrains Mono', monospace" }} href="#">
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative flex items-center">
                <span className={`material-symbols-outlined absolute left-3 text-xl transition-colors ${focusedField === 'password' ? 'text-primary' : 'text-outline'}`}>
                  lock_open
                </span>
                <input
                  className="w-full pl-11 pr-4 py-3 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base outline-none"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2 pt-1">
              <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" id="remember" type="checkbox" />
              <label className="text-sm text-on-surface-variant cursor-pointer" htmlFor="remember">
                Duy trì đăng nhập trong 30 ngày
              </label>
            </div>

            {/* Primary Action */}
            <div className="pt-4">
              <button
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm py-4 rounded-lg flex items-center justify-center space-x-2 active:scale-95 login-card"
                type="submit"
              >
                <span>Đăng nhập</span>
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-outline-variant"></div>
            <span className="px-4 text-xs text-outline" style={{ fontFamily: "'JetBrains Mono', monospace" }}>HOẶC</span>
            <div className="flex-1 border-t border-outline-variant"></div>
          </div>

          {/* SSO Option */}
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center space-x-3 py-3 border border-outline-variant rounded-lg hover:bg-surface-container-low ai-accent-border"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="font-semibold text-sm text-on-surface">Đăng nhập với Google Workspace</span>
          </button>
        </section>

        {/* Footer */}
        <footer className="mt-6 text-center">
          <p className="text-sm text-on-surface-variant">
            Chưa có tài khoản?{' '}
            <a className="text-primary font-bold hover:underline" href="#">Liên hệ quản trị viên</a>
          </p>
          <div className="mt-10 flex justify-center space-x-4 text-outline">
            <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Bảo mật</span>
            <span className="text-xs">•</span>
            <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Điều khoản</span>
            <span className="text-xs">•</span>
            <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Hỗ trợ</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
