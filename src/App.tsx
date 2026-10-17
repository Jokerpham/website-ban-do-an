import React, { useState, useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { QuickSearchSection } from './components/QuickSearchSection';
import { RestaurantExplorer } from './components/RestaurantExplorer';
import { CategoryListingPage } from './components/CategoryListingPage';
import { RestaurantDetailModal } from './components/RestaurantDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { OrdersModal } from './components/OrdersModal';
import { Footer } from './components/Footer';
import { RESTAURANTS_DATA, MEAL_CATEGORIES } from './data/mockData';
import { Restaurant, MenuItem, CartItem, Order, Reservation, UserProfile, Review, MealCategory } from './types';
import { ShoppingBag, ArrowUp, CheckCircle, Utensils } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'category'>('home');
  const [restaurants, setRestaurants] = useState<Restaurant[]>(RESTAURANTS_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [locationQuery, setLocationQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals & Drawers state
  const [activeRestaurant, setActiveRestaurant] = useState<{
    restaurant: Restaurant;
    initialTab: 'menu' | 'reservation' | 'reviews';
  } | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [authModalState, setAuthModalState] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState<boolean>(false);

  // User state - defaults to null so the header always displays "Đăng nhập" and "Tạo tài khoản" exactly as in the demo screenshot
  const [user, setUser] = useState<UserProfile | null>(null);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      restaurantId: 'rest-1',
      restaurantName: 'Phở Bát Đàn Gia Truyền & Điểm Tâm',
      item: RESTAURANTS_DATA[0].menu[0],
      quantity: 1,
      notes: 'Thịt bò tái vừa chín tới, nhiều hành lá',
    },
  ]);

  // Orders and Reservations history
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'FZ-ORD-90214',
      items: [
        {
          restaurantId: 'rest-1',
          restaurantName: 'Phở Bát Đàn Gia Truyền & Điểm Tâm',
          item: RESTAURANTS_DATA[0].menu[0],
          quantity: 2,
        },
      ],
      totalAmount: 150000,
      discount: 20000,
      finalAmount: 148000,
      deliveryAddress: '45 Lý Thường Kiệt, P. Hàng Bài, Hoàn Kiếm, Hà Nội',
      customerName: 'Nguyễn Minh Tuấn',
      phone: '0912 345 678',
      paymentMethod: 'Chuyển khoản QR',
      status: 'Đang giao hàng',
      createdAt: '10:45',
    },
  ]);

  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 'FZ-RES-5582',
      restaurantId: 'rest-7',
      restaurantName: 'Steakhouse & Hầm Rượu Vang The Cellar 88',
      date: '2026-10-18',
      time: '19:30',
      guests: 2,
      customerName: 'Nguyễn Minh Tuấn',
      phone: '0912 345 678',
      notes: 'Bàn view đẹp kỷ niệm ngày cưới',
      status: 'Đã xác nhận',
      createdAt: 'Hôm nay',
    },
  ]);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Category select handler - switches to dedicated Category Listing page
  const handleSelectCategory = (catId: string | null) => {
    if (!catId) {
      setSelectedCategory(null);
      setCurrentView('home');
      return;
    }
    setSelectedCategory(catId);
    setCurrentView('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = () => {
    setCurrentView('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToTop = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const handleAddToCart = (
    restaurant: Restaurant,
    item: MenuItem,
    quantity: number,
    notes?: string
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (ci) => ci.restaurantId === restaurant.id && ci.item.id === item.id
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
          notes: notes || next[existingIndex].notes,
        };
        return next;
      }
      return [
        ...prev,
        {
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          item,
          quantity,
          notes,
        },
      ];
    });
  };

  const handleUpdateCartQuantity = (restaurantId: string, itemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((ci) => {
          if (ci.restaurantId === restaurantId && ci.item.id === itemId) {
            const nextQty = ci.quantity + delta;
            return nextQty > 0 ? { ...ci, quantity: nextQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (restaurantId: string, itemId: string) => {
    setCartItems((prev) =>
      prev.filter((ci) => !(ci.restaurantId === restaurantId && ci.item.id === itemId))
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Checkout success
  const handleCheckoutSuccess = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    showToast(`Đặt đơn hàng #${order.id} thành công! Nhà hàng đang chuẩn bị món.`);
  };

  // Reservation handler
  const handleMakeReservation = (
    restaurantId: string,
    restaurantName: string,
    date: string,
    time: string,
    guests: number,
    name: string,
    phone: string,
    notes: string
  ) => {
    const newReservation: Reservation = {
      id: `FZ-RES-${Date.now().toString().slice(-4)}`,
      restaurantId,
      restaurantName,
      date,
      time,
      guests,
      customerName: name,
      phone,
      notes,
      status: 'Đã xác nhận',
      createdAt: 'Vừa xong',
    };
    setReservations((prev) => [newReservation, ...prev]);
    showToast(`Đặt bàn tại ${restaurantName} thành công!`);
  };

  // Add review handler
  const handleAddReview = (restaurantId: string, review: Review) => {
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === restaurantId) {
          const updatedReviews = [review, ...r.reviews];
          const newAvg =
            updatedReviews.reduce((sum, rev) => sum + rev.rating, 0) / updatedReviews.length;
          return {
            ...r,
            rating: Number(newAvg.toFixed(1)),
            reviewCount: r.reviewCount + 1,
            reviews: updatedReviews,
          };
        }
        return r;
      })
    );
    showToast('Đã gửi đánh giá thành công! Cảm ơn đóng góp của bạn.');
  };

  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-60 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-top-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Conditional View Rendering */}
      {currentView === 'home' ? (
        <>
          {/* 1. HERO SECTION (Exact pixel replica of reference image) */}
          <HeroSection
            locationQuery={locationQuery}
            onLocationChange={setLocationQuery}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            restaurants={restaurants}
            onSelectRestaurant={(restaurant) =>
              setActiveRestaurant({ restaurant, initialTab: 'menu' })
            }
            user={user}
            onOpenAuth={(mode) => setAuthModalState({ isOpen: true, mode })}
            onLogout={() => {
              setUser(null);
              showToast('Đã đăng xuất khỏi tài khoản.');
            }}
            onOpenOrders={() => setIsOrdersModalOpen(true)}
            onScrollToTop={handleScrollToTop}
          />

          {/* 2. QUICK SEARCH SECTION ("Tìm kiếm nhanh") */}
          <main className="flex-1">
            <QuickSearchSection
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />
          </main>
        </>
      ) : (
        /* Dedicated Category Listing Page */
        <CategoryListingPage
          currentCategory={
            MEAL_CATEGORIES.find((c) => c.id === selectedCategory) || MEAL_CATEGORIES[0]
          }
          allCategories={MEAL_CATEGORIES}
          onSelectCategory={(cat) => setSelectedCategory(cat.id)}
          restaurants={restaurants}
          locationFilter={locationQuery}
          onLocationChange={setLocationQuery}
          searchFilter={searchQuery}
          onSearchChange={setSearchQuery}
          onBackToHome={handleBackToHome}
          onOpenRestaurant={(restaurant, initialTab = 'menu') =>
            setActiveRestaurant({ restaurant, initialTab })
          }
          user={user}
          cartItems={cartItems}
          onOpenAuth={(mode) => setAuthModalState({ isOpen: true, mode })}
          onLogout={() => {
            setUser(null);
            showToast('Đã đăng xuất khỏi tài khoản.');
          }}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenOrders={() => setIsOrdersModalOpen(true)}
        />
      )}

      {/* Floating Cart Button for quick checkout in category browsing */}
      {totalCartCount > 0 && currentView === 'category' && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-red-600 hover:bg-red-700 text-white py-3 px-5 rounded-full shadow-2xl flex items-center gap-3 font-bold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer border-2 border-white"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white text-red-600 text-[10px] font-black flex items-center justify-center">
              {totalCartCount}
            </span>
          </div>
          <span>Xem giỏ hàng</span>
        </button>
      )}

      {/* 4. FOOTER (Exact copy of reference image) */}
      <Footer />

      {/* MODALS */}
      {/* Restaurant Detail Modal (Menu, Booking, Reviews) */}
      {activeRestaurant && (
        <RestaurantDetailModal
          restaurant={activeRestaurant.restaurant}
          initialTab={activeRestaurant.initialTab}
          onClose={() => setActiveRestaurant(null)}
          onAddToCart={handleAddToCart}
          onMakeReservation={handleMakeReservation}
          onAddReview={handleAddReview}
        />
      )}

      {/* Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={authModalState.isOpen}
        initialMode={authModalState.mode}
        onClose={() => setAuthModalState({ isOpen: false, mode: 'login' })}
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          showToast(`Đăng nhập thành công! Chào mừng ${loggedInUser.name}.`);
        }}
      />

      {/* Orders & Reservations History Modal */}
      <OrdersModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
        orders={orders}
        reservations={reservations}
      />
    </div>
  );
}
