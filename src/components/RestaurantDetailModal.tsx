import React, { useState } from 'react';
import {
  X,
  Star,
  MapPin,
  Phone,
  Clock,
  Plus,
  Minus,
  Check,
  Calendar,
  Users,
  Utensils,
  MessageSquare,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { Restaurant, MenuItem, Review } from '../types';

interface RestaurantDetailModalProps {
  restaurant: Restaurant | null;
  initialTab?: 'menu' | 'reservation' | 'reviews';
  onClose: () => void;
  onAddToCart: (restaurant: Restaurant, item: MenuItem, quantity: number, notes?: string) => void;
  onMakeReservation: (
    restaurantId: string,
    restaurantName: string,
    date: string,
    time: string,
    guests: number,
    name: string,
    phone: string,
    notes: string
  ) => void;
  onAddReview: (restaurantId: string, review: Review) => void;
}

export const RestaurantDetailModal: React.FC<RestaurantDetailModalProps> = ({
  restaurant,
  initialTab = 'menu',
  onClose,
  onAddToCart,
  onMakeReservation,
  onAddReview,
}) => {
  if (!restaurant) return null;

  const [activeTab, setActiveTab] = useState<'menu' | 'reservation' | 'reviews'>(initialTab);
  const [selectedMenuCategory, setSelectedMenuCategory] = useState<string>('all');
  
  // Customizing item modal state
  const [selectedItemToOrder, setSelectedItemToOrder] = useState<MenuItem | null>(null);
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [itemNote, setItemNote] = useState<string>('');
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Reservation form state
  const [resDate, setResDate] = useState<string>('2026-10-18');
  const [resTime, setResTime] = useState<string>('19:00');
  const [resGuests, setResGuests] = useState<number>(2);
  const [resName, setResName] = useState<string>('Nguyễn Minh Tuấn');
  const [resPhone, setResPhone] = useState<string>('0912 345 678');
  const [resNote, setResNote] = useState<string>('');
  const [reservationSuccess, setReservationSuccess] = useState<boolean>(false);

  // Review form state
  const [userRating, setUserRating] = useState<number>(5);
  const [reviewName, setReviewName] = useState<string>('Khách hàng FoodZY');
  const [reviewText, setReviewText] = useState<string>('');
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const menuCategories = ['all', ...Array.from(new Set(restaurant.menu.map((m) => m.category)))];

  const filteredMenuItems =
    selectedMenuCategory === 'all'
      ? restaurant.menu
      : restaurant.menu.filter((m) => m.category === selectedMenuCategory);

  const handleOpenAddModal = (item: MenuItem) => {
    setSelectedItemToOrder(item);
    setItemQuantity(1);
    setItemNote('');
  };

  const handleConfirmAddToCart = () => {
    if (!selectedItemToOrder) return;
    onAddToCart(restaurant, selectedItemToOrder, itemQuantity, itemNote);
    const itemName = selectedItemToOrder.name;
    setSelectedItemToOrder(null);
    setAddedToast(`Đã thêm "${itemName}" vào giỏ hàng`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resName || !resPhone) return;
    onMakeReservation(
      restaurant.id,
      restaurant.name,
      resDate,
      resTime,
      resGuests,
      resName,
      resPhone,
      resNote
    );
    setReservationSuccess(true);
    setTimeout(() => {
      setReservationSuccess(false);
      setActiveTab('menu');
    }, 2500);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      userName: reviewName.trim() || 'Người dùng ẩn danh',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      rating: userRating,
      date: 'Vừa xong',
      comment: reviewText.trim(),
    };
    onAddReview(restaurant.id, newReview);
    setReviewText('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header Banner */}
        <div className="relative h-48 sm:h-60 w-full overflow-hidden bg-slate-900 shrink-0">
          <img
            src={restaurant.heroImage}
            alt={restaurant.name}
            className="w-full h-full object-cover filter brightness-[0.75]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white transition-colors cursor-pointer z-10"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Restaurant details over image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-xs font-bold">
                {restaurant.categoryName}
              </span>
              <div className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded text-xs font-bold text-amber-300">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{restaurant.rating.toFixed(1)}</span>
                <span className="text-white/70 font-normal">({restaurant.reviewCount} đánh giá)</span>
              </div>
              <span className="text-xs bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded text-white/90">
                {restaurant.priceRange}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold drop-shadow-md">
              {restaurant.name}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-white/90">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                {restaurant.address}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                {restaurant.openHours}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                {restaurant.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 sm:px-6 shrink-0">
          <button
            onClick={() => setActiveTab('menu')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'menu'
                ? 'border-red-600 text-red-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Thực đơn ({restaurant.menu.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reservation')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'reservation'
                ? 'border-red-600 text-red-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Đặt bàn trước</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-red-600 text-red-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Đánh giá ({restaurant.reviews.length})</span>
          </button>
        </div>

        {/* Toast alert */}
        {addedToast && (
          <div className="bg-emerald-600 text-white text-xs font-semibold py-2 px-4 flex items-center justify-between animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{addedToast}</span>
            </div>
            <span className="text-emerald-100 text-[11px]">Đã cập nhật giỏ</span>
          </div>
        )}

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {/* TAB 1: MENU */}
          {activeTab === 'menu' && (
            <div>
              {/* Category selector pills */}
              <div className="flex flex-wrap items-center gap-1.5 mb-6">
                {menuCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedMenuCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      selectedMenuCategory === cat
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cat === 'all' ? 'Tất cả món' : cat}
                  </button>
                ))}
              </div>

              {/* Menu items list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMenuItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-red-200 hover:shadow-sm transition-all flex items-center gap-3 bg-white"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover bg-slate-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {item.name}
                        </h4>
                        {item.popular && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded shrink-0">
                            Bán chạy
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                        {item.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-extrabold text-red-600">
                          {formatVND(item.price)}
                        </span>
                        <button
                          onClick={() => handleOpenAddModal(item)}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Thêm</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: RESERVATION */}
          {activeTab === 'reservation' && (
            <div className="max-w-xl mx-auto py-2">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Đặt bàn trực tuyến FoodZY</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Đặt bàn trước nhanh chóng, giữ chỗ trong 15 phút, không mất phí hủy
                </p>
              </div>

              {reservationSuccess ? (
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center animate-in zoom-in-95">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-emerald-900">Đặt bàn thành công!</h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    Nhà hàng <b>{restaurant.name}</b> đã nhận yêu cầu đặt bàn cho <b>{resGuests} khách</b> vào lúc <b>{resTime} ngày {resDate}</b>.
                  </p>
                  <p className="text-[11px] text-emerald-600 mt-2">
                    Mã đặt bàn: <span className="font-mono font-bold">FZ-TAB-{Date.now().toString().slice(-4)}</span>. Nhân viên sẽ liên hệ xác nhận trong 5 phút.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReservationSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Ngày đặt bàn *
                      </label>
                      <input
                        type="date"
                        required
                        value={resDate}
                        onChange={(e) => setResDate(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Giờ đến *
                      </label>
                      <select
                        value={resTime}
                        onChange={(e) => setResTime(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-hidden bg-white"
                      >
                        <option value="11:30">11:30 - Trưa</option>
                        <option value="12:00">12:00 - Trưa</option>
                        <option value="12:30">12:30 - Trưa</option>
                        <option value="18:00">18:00 - Tối</option>
                        <option value="18:30">18:30 - Tối</option>
                        <option value="19:00">19:00 - Tối (Cao điểm)</option>
                        <option value="19:30">19:30 - Tối</option>
                        <option value="20:00">20:00 - Tối</option>
                        <option value="21:00">21:00 - Đêm</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Số lượng khách *
                      </label>
                      <div className="flex items-center gap-3 border border-slate-300 rounded-lg p-1.5 bg-white">
                        <button
                          type="button"
                          onClick={() => setResGuests(Math.max(1, resGuests - 1))}
                          className="p-1 hover:bg-slate-100 rounded text-slate-600"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="flex-1 text-center font-bold text-sm text-slate-800">
                          {resGuests} người
                        </span>
                        <button
                          type="button"
                          onClick={() => setResGuests(resGuests + 1)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-600"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Số điện thoại liên hệ *
                      </label>
                      <input
                        type="tel"
                        required
                        value={resPhone}
                        onChange={(e) => setResPhone(e.target.value)}
                        placeholder="0912 345 678"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Họ và tên người đặt *
                    </label>
                    <input
                      type="text"
                      required
                      value={resName}
                      onChange={(e) => setResName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ghi chú đặc biệt cho nhà hàng
                    </label>
                    <textarea
                      rows={2}
                      value={resNote}
                      onChange={(e) => setResNote(e.target.value)}
                      placeholder="Ví dụ: Bàn gần cửa sổ, tiệc sinh nhật, có trẻ nhỏ..."
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md transition-colors cursor-pointer"
                  >
                    Xác nhận đặt bàn ngay
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Form submit review */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-800 mb-2">
                  Viết đánh giá của bạn cho {restaurant.name}
                </h4>

                {reviewSuccess ? (
                  <p className="text-xs text-emerald-600 font-semibold py-2">
                    ✓ Cảm ơn bạn! Đánh giá đã được ghi nhận.
                  </p>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 font-semibold">Chấm sao:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setUserRating(s)}
                            className="cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                s <= userRating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="Họ tên của bạn"
                        className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                      <input
                        type="text"
                        required
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm món ăn, không gian, phục vụ..."
                        className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      Gửi đánh giá
                    </button>
                  </form>
                )}
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {restaurant.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-white rounded-xl border border-slate-100 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.userAvatar}
                          alt={rev.userName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{rev.userName}</p>
                          <p className="text-[10px] text-slate-400">{rev.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal footer summary */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <span>Hỗ trợ đặt món & đặt bàn: <b className="text-slate-800">{restaurant.phone}</b></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>

      {/* Item Customization & Add Drawer/Popup */}
      {selectedItemToOrder && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-5 max-w-sm w-full border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-base font-bold text-slate-900">{selectedItemToOrder.name}</h4>
                <p className="text-sm font-extrabold text-red-600 mt-0.5">
                  {formatVND(selectedItemToOrder.price)}
                </p>
              </div>
              <button
                onClick={() => setSelectedItemToOrder(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Số lượng:
              </label>
              <div className="flex items-center justify-center gap-4 py-2 border border-slate-200 rounded-xl bg-slate-50">
                <button
                  onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                  className="p-1.5 rounded-lg bg-white shadow-xs hover:bg-slate-100 text-slate-700"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-extrabold text-base text-slate-900 w-8 text-center">
                  {itemQuantity}
                </span>
                <button
                  onClick={() => setItemQuantity(itemQuantity + 1)}
                  className="p-1.5 rounded-lg bg-white shadow-xs hover:bg-slate-100 text-slate-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ghi chú cho bếp (tùy chọn):
              </label>
              <input
                type="text"
                value={itemNote}
                onChange={(e) => setItemNote(e.target.value)}
                placeholder="Ít cay, không hành tây, v.v..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <button
              onClick={handleConfirmAddToCart}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Thêm vào giỏ · {formatVND(selectedItemToOrder.price * itemQuantity)}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
