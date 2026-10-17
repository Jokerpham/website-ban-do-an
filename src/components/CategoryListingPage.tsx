import React, { useState, useMemo } from 'react';
import {
  Star,
  MapPin,
  Clock,
  Filter,
  X,
  Utensils,
  Calendar,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  Search,
  ShoppingBag,
  Home,
  Check,
  Phone,
} from 'lucide-react';
import { Restaurant, MealCategory, UserProfile, CartItem } from '../types';
import { MEAL_CATEGORIES, POPULAR_LOCATIONS } from '../data/mockData';

interface CategoryListingPageProps {
  currentCategory: MealCategory;
  allCategories: MealCategory[];
  onSelectCategory: (category: MealCategory) => void;
  restaurants: Restaurant[];
  locationFilter: string;
  onLocationChange: (loc: string) => void;
  searchFilter: string;
  onSearchChange: (q: string) => void;
  onBackToHome: () => void;
  onOpenRestaurant: (restaurant: Restaurant, initialTab?: 'menu' | 'reservation' | 'reviews') => void;
  user: UserProfile | null;
  cartItems: CartItem[];
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onOpenCart: () => void;
  onOpenOrders: () => void;
}

export const CategoryListingPage: React.FC<CategoryListingPageProps> = ({
  currentCategory,
  allCategories,
  onSelectCategory,
  restaurants,
  locationFilter,
  onLocationChange,
  searchFilter,
  onSearchChange,
  onBackToHome,
  onOpenRestaurant,
  user,
  cartItems,
  onOpenAuth,
  onLogout,
  onOpenCart,
  onOpenOrders,
}) => {
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'priceAsc' | 'priceDesc'>('popularity');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  // Filter & Sort restaurants
  const filteredAndSortedRestaurants = useMemo(() => {
    let result = restaurants.filter((r) => {
      // Must match current category
      if (r.categoryId !== currentCategory.id) return false;

      // Location search
      if (locationFilter) {
        const loc = locationFilter.toLowerCase();
        if (
          !r.address.toLowerCase().includes(loc) &&
          !r.city.toLowerCase().includes(loc) &&
          !r.district.toLowerCase().includes(loc)
        ) {
          return false;
        }
      }

      // Keyword search
      if (searchFilter) {
        const q = searchFilter.toLowerCase();
        if (
          !r.name.toLowerCase().includes(q) &&
          !r.tags.some((t) => t.toLowerCase().includes(q)) &&
          !r.menu.some((m) => m.name.toLowerCase().includes(q))
        ) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.priceLevel.length - b.priceLevel.length);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.priceLevel.length - a.priceLevel.length);
    } else {
      // Popularity (featured first, then review count)
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.reviewCount - a.reviewCount);
    }

    return result;
  }, [restaurants, currentCategory, locationFilter, searchFilter, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar in Category View */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Back to Home */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHome}
              className="group flex items-center gap-2 cursor-pointer focus-visible:outline-hidden"
              title="Quay lại trang chủ FoodZY"
            >
              <div className="px-4 py-1.5 rounded-full bg-[#e22a2a] border-2 border-white shadow-md hover:scale-102 transition-transform duration-150">
                <span className="text-xl sm:text-2xl font-extrabold tracking-wide text-white font-sans italic">
                  FoodZY
                </span>
              </div>
            </button>

            {/* Quick home icon */}
            <button
              onClick={onBackToHome}
              className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Trang chủ</span>
            </button>
          </div>

          {/* Compact Dual Search in Header */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-4 items-center bg-white border border-slate-300 rounded-xl p-1 shadow-2xs">
            <div className="flex items-center px-3 py-1.5 border-r border-slate-200 w-2/5">
              <MapPin className="w-4 h-4 text-red-500 mr-2 shrink-0" />
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => onLocationChange(e.target.value)}
                placeholder="Vị trí..."
                className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
              />
            </div>
            <div className="flex items-center px-3 py-1.5 flex-1">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tìm món hoặc nhà hàng..."
                className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
              />
              {searchFilter && (
                <button
                  onClick={() => onSearchChange('')}
                  className="p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Cart & Auth */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full text-slate-700 hover:text-red-600 hover:bg-slate-100 transition-all cursor-pointer"
              title="Xem giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold text-white bg-red-600 rounded-full animate-bounce shadow-sm">
                  {totalCartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 pl-3 rounded-full border border-slate-200 hover:border-slate-300 bg-white cursor-pointer"
                >
                  <span className="hidden sm:inline-block text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-red-500/20"
                  />
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 text-slate-800 text-xs">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="font-bold truncate">{user.name}</p>
                        <p className="text-slate-400 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenOrders();
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2"
                      >
                        Lịch sử đơn & đặt bàn
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onLogout();
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-rose-50 text-red-600 flex items-center gap-2"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-red-600 cursor-pointer"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-4 py-1.5 text-xs sm:text-sm font-bold text-[#d32f2f] bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs cursor-pointer"
              >
                Tạo tài khoản
              </button>
            </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 font-medium">
          <button onClick={onBackToHome} className="hover:text-red-600 cursor-pointer">
            Trang chủ
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600">
            {locationFilter ? locationFilter.split(',')[0] : 'Việt Nam'}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">{currentCategory.title}</span>
        </div>

        {/* Category Hero / Banner Strip */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white p-6 sm:p-8 mb-8 shadow-md">
          <img
            src={currentCategory.image}
            alt={currentCategory.title}
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.45]"
            referrerPolicy="no-referrer"
          />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-black uppercase tracking-wider rounded-md mb-2 shadow-xs">
              Món ăn & Ẩm thực
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Địa điểm {currentCategory.title} {locationFilter ? `tại ${locationFilter}` : 'ngon nhất'}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-white/90 font-normal leading-relaxed">
              {currentCategory.description}. Khám phá menu phong phú, đặt bàn giữ chỗ trực tuyến và đặt món giao tận nơi nhanh chóng.
            </p>
          </div>
        </div>

        {/* Horizontal Category Switcher Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {allCategories.map((cat) => {
            const isCurrent = cat.id === currentCategory.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-red-300 hover:text-red-600'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span>{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* Main Listings - Full Width Clean Layout (No Sidebar) */}
        <main className="max-w-5xl mx-auto w-full space-y-5">
          {/* Toolbar count & quick sort pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-xs sm:text-sm font-semibold text-slate-700">
              Hiển thị <span className="font-extrabold text-red-600">{filteredAndSortedRestaurants.length}</span> địa điểm phù hợp
            </div>

            {/* Quick sort pills */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium mr-1">Sắp xếp:</span>
              <button
                onClick={() => setSortBy('popularity')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  sortBy === 'popularity' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Phổ biến
              </button>
              <button
                onClick={() => setSortBy('rating')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  sortBy === 'rating' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Đánh giá cao
              </button>
              <button
                onClick={() => setSortBy('priceAsc')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  sortBy === 'priceAsc' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Giá tăng dần
              </button>
            </div>
          </div>

            {/* Restaurant Cards */}
            {filteredAndSortedRestaurants.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">
                  Không tìm thấy quán nào theo tiêu chí
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Hãy thử mở rộng bộ lọc hoặc xóa các tùy chọn đang chọn để xem thêm quán.
                </p>
                <button
                  onClick={() => {
                    onLocationChange('');
                    onSearchChange('');
                    setSortBy('popularity');
                  }}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-red-700"
                >
                  Xóa tìm kiếm
                </button>
              </div>
            ) : (
              filteredAndSortedRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row"
                >
                  {/* Left Restaurant Image */}
                  <div className="md:w-72 h-52 md:h-auto relative overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={restaurant.heroImage}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded">
                      {restaurant.categoryName}
                    </div>
                    {restaurant.featured && (
                      <div className="absolute bottom-3 left-3 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                        Nổi bật
                      </div>
                    )}
                  </div>

                  {/* Right Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Name & Rating */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3
                            onClick={() => onOpenRestaurant(restaurant, 'menu')}
                            className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors cursor-pointer"
                          >
                            {restaurant.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            <span>{restaurant.address}</span>
                          </p>
                        </div>

                        {/* Rating Box */}
                        <div className="bg-emerald-700 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0 shadow-2xs">
                          <span>{restaurant.rating.toFixed(1)}</span>
                          <Star className="w-3 h-3 fill-white text-white" />
                        </div>
                      </div>

                      {/* Tags & Price Range */}
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                          {restaurant.priceRange}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{restaurant.openHours}</span>
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500 font-medium">{restaurant.deliveryTime}</span>
                      </div>

                      {/* Tag Pills */}
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {restaurant.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-medium bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>Hotline: <b className="text-slate-700">{restaurant.phone}</b></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenRestaurant(restaurant, 'reservation')}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Đặt bàn trước</span>
                        </button>

                        <button
                          onClick={() => onOpenRestaurant(restaurant, 'menu')}
                          className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                        >
                          <Utensils className="w-3.5 h-3.5" />
                          <span>Xem Menu & Đặt món</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Pagination Controls */}
            {filteredAndSortedRestaurants.length > 0 && (
              <div className="py-6 flex items-center justify-center gap-2 text-xs font-bold">
                <button
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40"
                >
                  Trang trước
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-red-600 text-white">1</button>
                <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
                  2
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
                  Trang sau
                </button>
              </div>
            )}
          </main>
      </div>
    </div>
  );
};
