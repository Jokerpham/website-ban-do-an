import React, { useState } from 'react';
import { X } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    const fullName = mode === 'register' 
      ? `${lastName} ${firstName}`.trim() || 'Người dùng mới'
      : 'Nguyễn Minh Tuấn';

    const loggedUser: UserProfile = {
      name: fullName,
      email: email,
      phone: '0912 345 678',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    };

    onLoginSuccess(loggedUser);
    onClose();
  };

  const handleQuickDemo = () => {
    onLoginSuccess({
      name: 'Nguyễn Minh Tuấn',
      email: 'nguyenminhtuan@gmail.com',
      phone: '0912 345 678',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Modal Container matching screenshot */}
      <div className="relative w-full max-w-[380px] bg-white rounded-2xl shadow-2xl p-6 sm:p-7 border border-slate-100 animate-in zoom-in-95 duration-150">
        
        {/* Header: Title and Close button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-[26px] font-bold text-[#192f60] tracking-tight">
            {mode === 'register' ? 'Đăng ký' : 'Đăng nhập'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#192f60] hover:text-slate-600 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-6 h-6 stroke-[2.2]" />
          </button>
        </div>

        {/* Error notification if any */}
        {error && (
          <div className="mb-4 p-2.5 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
            {error}
          </div>
        )}

        {/* Form Inputs matching screenshot */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <>
              {/* Tên */}
              <div>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Tên"
                  className="w-full px-4 py-3 text-sm text-slate-800 placeholder-slate-400 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-red-500 transition-colors"
                />
              </div>

              {/* Họ */}
              <div>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Họ"
                  className="w-full px-4 py-3 text-sm text-slate-800 placeholder-slate-400 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-red-500 transition-colors"
                />
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 text-sm text-slate-800 placeholder-slate-400 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-red-500 transition-colors"
            />
          </div>

          {/* Mật khẩu */}
          <div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              className="w-full px-4 py-3 text-sm text-slate-800 placeholder-slate-400 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-red-500 transition-colors"
            />
          </div>

          {/* Submit Button (Solid Red button matching screenshot) */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#cb202d] hover:bg-[#b01b26] active:scale-98 text-white rounded-lg text-base font-bold shadow-sm transition-all duration-150 cursor-pointer text-center"
            >
              {mode === 'register' ? 'Đăng ký' : 'Đăng nhập'}
            </button>
          </div>
        </form>

        {/* Quick 1-click test login link */}
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="text-[11px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
          >
            Đăng nhập nhanh 1 chạm (Tài khoản mẫu)
          </button>
        </div>

        {/* Divider subtle line */}
        <div className="w-full h-[1px] bg-slate-100 my-5" />

        {/* Bottom switch mode line */}
        <div className="text-center text-xs sm:text-sm text-slate-600">
          {mode === 'register' ? (
            <span>
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="font-bold text-[#cb202d] hover:underline cursor-pointer"
              >
                Đăng nhập
              </button>
            </span>
          ) : (
            <span>
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className="font-bold text-[#cb202d] hover:underline cursor-pointer"
              >
                Đăng ký
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
