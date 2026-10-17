import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MapPin, UtensilsCrossed, X, Star } from 'lucide-react';
import { POPULAR_LOCATIONS, HERO_IMAGE } from '../data/mockData';
import { UserProfile, Restaurant } from '../types';

interface HeroSectionProps {
  locationQuery: string;
  onLocationChange: (loc: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
  restaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
  user: UserProfile | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onOpenOrders: () => void;
  onScrollToTop: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  locationQuery,
  onLocationChange,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  restaurants,
  onSelectRestaurant,
  user,
  onOpenAuth,
  onLogout,
  onOpenOrders,
  onScrollToTop,
}) => {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered restaurants for search autocomplete dropdown
  const matchingRestaurants = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)) ||
        r.categoryName.toLowerCase().includes(q) ||
        r.menu.some((m) => m.name.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [restaurants, searchQuery]);

  const handleSelectLocation = (loc: string) => {
    onLocationChange(loc);
    setShowLocationDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setShowSearchDropdown(false);
      onSearchSubmit();
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-slate-900 min-h-[460px] sm:min-h-[500px] md:min-h-[550px] lg:min-h-[580px] flex flex-col justify-between">
      {/* Background Image: flatlay feast matching demo */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="FoodZY Background Feast"
          className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-[1.05]"
          referrerPolicy="no-referrer"
        />
        {/* Soft dark vignette */}
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* Top Header inside Hero (Pixel-perfect matching demo image) */}
      <header className="relative z-20 w-full pt-6 sm:pt-8 px-6 sm:px-12 max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo FoodZY: red rounded rectangle with white outline border matching screenshot */}
        <button
          onClick={onScrollToTop}
          className="group flex items-center cursor-pointer focus-visible:outline-hidden"
          aria-label="FoodZY Logo"
        >
          <div className="px-5 py-1.5 rounded-full bg-[#e22a2a] border-2 border-white shadow-md hover:scale-102 transition-transform duration-150">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-wide text-white font-sans italic">
              FoodZY
            </span>
          </div>
        </button>

        {/* Top Right: Đăng nhập & Tạo tài khoản */}
        <div className="flex items-center gap-4 sm:gap-6">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/30 transition-all cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-semibold max-w-[120px] truncate">
                  {user.name}
                </span>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-white/50"
                />
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 text-slate-800">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Xin chào</p>
                      <p className="text-sm font-bold truncate">{user.name}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenOrders();
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-700 hover:text-red-600 cursor-pointer"
                    >
                      Lịch sử đơn & đặt bàn
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-rose-50 flex items-center gap-2 text-red-600 cursor-pointer"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-5 sm:gap-7">
              <button
                onClick={() => onOpenAuth('login')}
                className="text-white hover:text-white/90 font-bold text-base sm:text-lg transition-colors whitespace-nowrap cursor-pointer drop-shadow-sm"
              >
                Đăng nhập
              </button>
              {/* White rounded rectangle button with red bold text */}
              <button
                onClick={() => onOpenAuth('register')}
                className="px-6 py-2 sm:px-7 sm:py-2.5 rounded-lg font-bold text-base sm:text-lg text-[#d32f2f] bg-white hover:bg-slate-50 transition-all duration-150 shadow-md hover:shadow-lg active:scale-98 whitespace-nowrap cursor-pointer"
              >
                Tạo tài khoản
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Body Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center flex flex-col items-center justify-center flex-1">
        {/* Main Title: exact phrasing and color accent from demo */}
        <h1 className="text-3xl sm:text-4xl md:text-[44px] lg:text-[48px] font-bold text-white tracking-tight leading-tight max-w-4xl drop-shadow-md">
          Tìm những nhà hàng, quán cà phê và quán bar{' '}
          <span className="text-[#e22a2a] font-extrabold">tốt nhất</span>
        </h1>

        {/* Dual Search Input Box: TWO SEPARATE WHITE BOXES side by side matching demo */}
        <div className="w-full max-w-3xl mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-3.5">
          {/* Left Box: Location */}
          <div
            ref={locationRef}
            className="relative w-full sm:w-[42%] bg-white rounded-md shadow-lg h-12 sm:h-13 px-4 flex items-center"
          >
            <MapPin className="w-5 h-5 text-[#e22a2a] shrink-0 mr-3" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => onLocationChange(e.target.value)}
              onFocus={() => setShowLocationDropdown(true)}
              placeholder="Vui lòng nhập vị trí"
              className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-hidden font-medium"
            />
            {locationQuery && (
              <button
                onClick={() => onLocationChange('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Location Suggestions Dropdown */}
            {showLocationDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-slate-200 z-50 py-2 text-left max-h-64 overflow-y-auto">
                <div className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Địa điểm phổ biến
                </div>
                {POPULAR_LOCATIONS.map((loc, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectLocation(loc.full)}
                    className="w-full px-3.5 py-2 hover:bg-slate-50 text-left flex items-center justify-between text-xs sm:text-sm text-slate-700 transition-colors cursor-pointer"
                  >
                    <span>{loc.district}</span>
                    <span className="text-xs text-slate-400">{loc.city}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Box: Search restaurant name */}
          <div
            ref={searchRef}
            className="relative w-full sm:w-[58%] bg-white rounded-md shadow-lg h-12 sm:h-13 px-4 flex items-center"
          >
            <UtensilsCrossed className="w-5 h-5 text-[#e22a2a] shrink-0 mr-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              onKeyDown={handleKeyDown}
              placeholder="Tìm kiếm theo tên nhà hàng"
              className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-hidden font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  onSearchChange('');
                  setShowSearchDropdown(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Autocomplete Dropdown */}
            {showSearchDropdown && matchingRestaurants.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-slate-200 z-50 py-2 text-left max-h-72 overflow-y-auto">
                <div className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Nhà hàng gợi ý ({matchingRestaurants.length})
                </div>
                {matchingRestaurants.map((rest) => (
                  <div
                    key={rest.id}
                    onClick={() => {
                      onSelectRestaurant(rest);
                      setShowSearchDropdown(false);
                    }}
                    className="px-3.5 py-2.5 hover:bg-slate-50 flex items-center gap-3 cursor-pointer border-b border-slate-100 last:border-b-0"
                  >
                    <img
                      src={rest.heroImage}
                      alt={rest.name}
                      className="w-10 h-10 rounded-md object-cover bg-slate-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                          {rest.name}
                        </p>
                        <div className="flex items-center gap-0.5 text-xs text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{rest.rating}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{rest.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clean bottom transition */}
      <div className="w-full h-2" />
    </div>
  );
};
