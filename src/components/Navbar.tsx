import React, { useState } from 'react';
import { ShoppingBag, User, LogOut, CalendarCheck, Utensils, Search, MapPin } from 'lucide-react';
import { UserProfile, CartItem } from '../types';

interface NavbarProps {
  user: UserProfile | null;
  cartItems: CartItem[];
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onScrollToExplore: () => void;
  onScrollToTop: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  cartItems,
  onOpenAuth,
  onLogout,
  onOpenCart,
  onOpenOrders,
  onScrollToExplore,
  onScrollToTop,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200 backdrop-blur-md bg-white/90 border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo Zone */}
        <div className="flex items-center gap-6">
          <button
            onClick={onScrollToTop}
            className="group flex items-center gap-2 cursor-pointer focus-visible:outline-hidden"
            aria-label="FoodZY Trang chủ"
          >
            {/* Logo pill matching screenshot */}
            <div className="relative flex items-center justify-center px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 shadow-md group-hover:scale-105 transition-transform duration-200 border-2 border-white/60">
              <span className="text-xl sm:text-2xl font-black tracking-wide text-white font-sans italic drop-shadow-sm">
                Food<span className="text-amber-200">ZY</span>
              </span>
            </div>
          </button>

          {/* Quick Nav desktop links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <button
              onClick={onScrollToExplore}
              className="hover:text-red-600 transition-colors cursor-pointer"
            >
              Khám phá món ngon
            </button>
            <button
              onClick={onScrollToExplore}
              className="hover:text-red-600 transition-colors cursor-pointer"
            >
              Nhà hàng nổi bật
            </button>
          </nav>
        </div>

        {/* Right Zone: Cart, Auth buttons */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Cart button with floating badge */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-full text-slate-700 hover:text-red-600 hover:bg-slate-100 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-red-500"
            title="Xem giỏ hàng"
            aria-label="Giỏ hàng"
          >
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold text-white bg-red-600 rounded-full animate-bounce shadow-sm">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* User state */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full border border-slate-200 hover:border-slate-300 hover:shadow-xs bg-white transition-all cursor-pointer focus-visible:outline-hidden"
              >
                <span className="hidden sm:inline-block text-xs font-semibold text-slate-700 max-w-[120px] truncate">
                  {user.name}
                </span>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-red-500/20"
                />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Đã đăng nhập là</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenOrders();
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-red-600 flex items-center gap-2.5 cursor-pointer transition-colors"
                    >
                      <CalendarCheck className="w-4 h-4 text-slate-400" />
                      Lịch sử đơn & đặt bàn
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onScrollToExplore();
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-red-600 flex items-center gap-2.5 cursor-pointer transition-colors"
                    >
                      <Utensils className="w-4 h-4 text-slate-400" />
                      Khám phá danh sách quán
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-red-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-bold text-red-600 bg-white border border-red-500/30 hover:border-red-600 hover:bg-red-50/70 rounded-full shadow-xs hover:shadow-sm transition-all duration-150 whitespace-nowrap cursor-pointer"
              >
                Tạo tài khoản
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
