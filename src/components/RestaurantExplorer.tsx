import React, { useState, useMemo } from 'react';
import { Star, MapPin, Clock, DollarSign, Filter, X, Utensils, Calendar, ChevronRight, Check } from 'lucide-react';
import { Restaurant } from '../types';
import { MEAL_CATEGORIES } from '../data/mockData';

interface RestaurantExplorerProps {
  restaurants: Restaurant[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  locationFilter: string;
  onClearLocationFilter: () => void;
  searchFilter: string;
  onClearSearchFilter: () => void;
  onOpenRestaurant: (restaurant: Restaurant, initialTab?: 'menu' | 'reservation' | 'reviews') => void;
}

export const RestaurantExplorer: React.FC<RestaurantExplorerProps> = ({
  restaurants,
  selectedCategory,
  onSelectCategory,
  locationFilter,
  onClearLocationFilter,
  searchFilter,
  onClearSearchFilter,
  onOpenRestaurant,
}) => {
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedPrice, setSelectedPrice] = useState<string>('all');
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Filter restaurants logic
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((rest) => {
      // Category filter
      if (selectedCategory && rest.categoryId !== selectedCategory) {
        return false;
      }
      // Location query
      if (locationFilter) {
        const loc = locationFilter.toLowerCase();
        const matchesAddress =
          rest.address.toLowerCase().includes(loc) ||
          rest.city.toLowerCase().includes(loc) ||
          rest.district.toLowerCase().includes(loc);
        if (!matchesAddress) return false;
      }
      // Search query (name, cuisine, tags)
      if (searchFilter) {
        const query = searchFilter.toLowerCase();
        const matchesName = rest.name.toLowerCase().includes(query);
        const matchesTags = rest.tags.some((t) => t.toLowerCase().includes(query));
        const matchesMenu = rest.menu.some((m) => m.name.toLowerCase().includes(query));
        if (!matchesName && !matchesTags && !matchesMenu) return false;
      }
      // Rating filter
      if (minRating > 0 && rest.rating < minRating) {
        return false;
      }
      // City filter
      if (selectedCity !== 'all' && rest.city !== selectedCity) {
        return false;
      }
      // Price filter
      if (selectedPrice !== 'all' && rest.priceLevel !== selectedPrice) {
        return false;
      }
      return true;
    });
  }, [restaurants, selectedCategory, locationFilter, searchFilter, minRating, selectedCity, selectedPrice]);

  const activeCategoryTitle = MEAL_CATEGORIES.find((c) => c.id === selectedCategory)?.title;

  return (
    <section id="restaurant-explorer" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Explorer Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-widest">
            <span>Danh bạ địa điểm</span>
            <span>·</span>
            <span>FoodZY Explorer</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#192f60] mt-1">
            {selectedCategory
              ? `Nhà hàng & Quán cho "${activeCategoryTitle}"`
              : 'Địa điểm ăn uống & Giải trí nổi bật'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Tìm thấy <span className="font-bold text-slate-800">{filteredRestaurants.length}</span> địa điểm phù hợp tiêu chí của bạn
          </p>
        </div>

        {/* Mobile filter toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="flex-1 py-2 px-4 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Filter className="w-4 h-4 text-slate-500" />
            <span>Bộ lọc ({[minRating > 0, selectedCity !== 'all', selectedPrice !== 'all'].filter(Boolean).length})</span>
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(selectedCategory || locationFilter || searchFilter || minRating > 0 || selectedCity !== 'all' || selectedPrice !== 'all') && (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-red-50/50 rounded-xl border border-red-100">
          <span className="text-xs font-semibold text-red-800">Đang lọc theo:</span>

          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-red-200 text-red-700 rounded-full text-xs font-medium shadow-2xs">
              Món: {activeCategoryTitle}
              <button
                onClick={() => onSelectCategory(null)}
                className="hover:text-red-900 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {locationFilter && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-red-200 text-red-700 rounded-full text-xs font-medium shadow-2xs">
              Vị trí: {locationFilter}
              <button
                onClick={onClearLocationFilter}
                className="hover:text-red-900 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {searchFilter && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-red-200 text-red-700 rounded-full text-xs font-medium shadow-2xs">
              Từ khóa: "{searchFilter}"
              <button
                onClick={onClearSearchFilter}
                className="hover:text-red-900 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {minRating > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-red-200 text-red-700 rounded-full text-xs font-medium shadow-2xs">
              ★ {minRating}+ sao
              <button
                onClick={() => setMinRating(0)}
                className="hover:text-red-900 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {selectedCity !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-red-200 text-red-700 rounded-full text-xs font-medium shadow-2xs">
              TP: {selectedCity}
              <button
                onClick={() => setSelectedCity('all')}
                className="hover:text-red-900 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          <button
            onClick={() => {
              onSelectCategory(null);
              onClearLocationFilter();
              onClearSearchFilter();
              setMinRating(0);
              setSelectedCity('all');
              setSelectedPrice('all');
            }}
            className="text-xs font-bold text-red-600 hover:underline ml-auto cursor-pointer"
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      )}

      {/* Filter Toolbar (Desktop & Mobile collapsible) */}
      <div
        className={`mb-8 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs transition-all ${
          showFiltersMobile ? 'block' : 'hidden md:block'
        }`}
      >
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-slate-400 mr-1 font-semibold">Phân loại:</span>
            <button
              onClick={() => onSelectCategory(null)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCategory === null
                  ? 'bg-red-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Tất cả
            </button>
            {MEAL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-red-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          <div className="hidden lg:block h-5 w-[1px] bg-slate-200" />

          {/* Rating filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">Đánh giá:</span>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="bg-slate-100 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value={0}>Tất cả điểm số</option>
              <option value={4.5}>4.5★ trở lên</option>
              <option value={4.8}>4.8★ xuất sắc</option>
            </select>
          </div>

          {/* City filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">Khu vực:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="all">Tất cả thành phố</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
            </select>
          </div>

          {/* Price Level */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">Mức giá:</span>
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="all">Tất cả mức giá</option>
              <option value="₫">₫ (Bình dân)</option>
              <option value="₫₫">₫₫ (Vừa phải)</option>
              <option value="₫₫₫">₫₫₫ (Sang trọng)</option>
              <option value="₫₫₫₫">₫₫₫₫ (Cao cấp)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredRestaurants.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
            <Utensils className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Không tìm thấy địa điểm phù hợp</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Hãy thử tìm kiếm với từ khóa khác hoặc xóa bớt tiêu chí lọc vị trí để khám phá nhiều quán ngon hơn.
          </p>
          <button
            onClick={() => {
              onSelectCategory(null);
              onClearLocationFilter();
              onClearSearchFilter();
              setMinRating(0);
              setSelectedCity('all');
              setSelectedPrice('all');
            }}
            className="mt-5 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Đặt lại tất cả bộ lọc
          </button>
        </div>
      ) : (
        /* Restaurant Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Card Image Banner */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                <img
                  src={restaurant.heroImage}
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                {/* Category Pill Tag */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-xs">
                  {restaurant.categoryName}
                </div>

                {/* Rating badge */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="tabular-nums">{restaurant.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({restaurant.reviewCount})</span>
                </div>

                {/* Price level & Delivery */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white drop-shadow-md">
                  <span className="bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded font-bold text-amber-300">
                    {restaurant.priceRange}
                  </span>
                  <span className="bg-emerald-600/90 backdrop-blur-xs px-2 py-0.5 rounded font-medium">
                    {restaurant.openHours}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => onOpenRestaurant(restaurant, 'menu')}
                    className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1 cursor-pointer"
                  >
                    {restaurant.name}
                  </h3>

                  {/* Address */}
                  <p className="mt-1.5 text-xs text-slate-500 flex items-start gap-1.5 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    <span>{restaurant.address}</span>
                  </p>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {restaurant.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dual Action Buttons */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onOpenRestaurant(restaurant, 'menu')}
                    className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Xem thực đơn</span>
                  </button>

                  <button
                    onClick={() => onOpenRestaurant(restaurant, 'reservation')}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                    title="Đặt bàn trước"
                  >
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Đặt bàn</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
