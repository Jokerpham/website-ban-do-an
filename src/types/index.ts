export interface MealCategory {
  id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'Khai vị' | 'Món chính' | 'Đồ ăn vặt' | 'Đồ uống' | 'Tráng miệng';
  popular?: boolean;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Restaurant {
  id: string;
  name: string;
  categoryId: string; // matches MealCategory id
  categoryName: string;
  city: string;
  district: string;
  address: string;
  rating: number;
  reviewCount: number;
  priceLevel: '₫' | '₫₫' | '₫₫₫' | '₫₫₫₫';
  priceRange: string;
  heroImage: string;
  tags: string[];
  phone: string;
  openHours: string;
  deliveryTime: string;
  deliveryFee: number;
  featured?: boolean;
  menu: MenuItem[];
  reviews: Review[];
}

export interface CartItem {
  restaurantId: string;
  restaurantName: string;
  item: MenuItem;
  quantity: number;
  notes?: string;
}

export interface Reservation {
  id: string;
  restaurantId: string;
  restaurantName: string;
  date: string;
  time: string;
  guests: number;
  customerName: string;
  phone: string;
  notes?: string;
  status: 'Đã xác nhận' | 'Chờ phản hồi' | 'Hoàn thành';
  createdAt: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  deliveryAddress: string;
  customerName: string;
  phone: string;
  paymentMethod: 'Tiền mặt khi nhận' | 'Chuyển khoản QR' | 'Ví MoMo';
  status: 'Đang chuẩn bị' | 'Đang giao hàng' | 'Đã giao thành công';
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}
