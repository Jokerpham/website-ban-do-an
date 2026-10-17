import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Check, QrCode, Tag, ArrowRight } from 'lucide-react';
import { CartItem, Order } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (restaurantId: string, itemId: string, delta: number) => void;
  onRemoveItem: (restaurantId: string, itemId: string) => void;
  onClearCart: () => void;
  onCheckoutSuccess: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckoutSuccess,
}) => {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const [name, setName] = useState<string>('Nguyễn Minh Tuấn');
  const [phone, setPhone] = useState<string>('0912 345 678');
  const [address, setAddress] = useState<string>('45 Lý Thường Kiệt, P. Hàng Bài, Hoàn Kiếm, Hà Nội');
  const [paymentMethod, setPaymentMethod] = useState<'Tiền mặt khi nhận' | 'Chuyển khoản QR' | 'Ví MoMo'>('Chuyển khoản QR');
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const subtotal = cartItems.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 18000 : 0;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'FOODZY2026') {
      setDiscountPercent(20);
      setPromoMessage({ text: 'Áp dụng mã giảm 20% thành công!' });
    } else if (code === 'FREESHIP') {
      setDiscountPercent(10);
      setPromoMessage({ text: 'Áp dụng mã Freeship 10% thành công!' });
    } else {
      setPromoMessage({ text: 'Mã ưu đãi không hợp lệ hoặc đã hết hạn.', error: true });
    }
  };

  const handleConfirmOrder = () => {
    if (cartItems.length === 0) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder: Order = {
        id: `FZ-ORD-${Date.now().toString().slice(-6)}`,
        items: [...cartItems],
        totalAmount: subtotal,
        discount: discountAmount,
        finalAmount: finalTotal,
        deliveryAddress: address,
        customerName: name,
        phone: phone,
        paymentMethod: paymentMethod,
        status: 'Đang chuẩn bị',
        createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      onCheckoutSuccess(newOrder);
      setIsSubmitting(false);
      onClearCart();
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-red-600" />
            <h3 className="font-extrabold text-base sm:text-lg text-slate-800">
              Giỏ hàng ({cartItems.reduce((a, b) => a + b.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <ShoppingBag className="w-8 h-8 text-slate-300" />
              </div>
              <p className="font-bold text-slate-700">Giỏ hàng của bạn đang trống</p>
              <p className="text-xs text-slate-400 mt-1">
                Hãy dạo quanh các nhà hàng yêu thích và chọn những món ăn ngon miệng!
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Khám phá món ngon ngay
              </button>
            </div>
          ) : (
            <>
              {cartItems.map((cartItem, idx) => (
                <div
                  key={`${cartItem.restaurantId}-${cartItem.item.id}-${idx}`}
                  className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3 shadow-2xs"
                >
                  <img
                    src={cartItem.item.image}
                    alt={cartItem.item.name}
                    className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">
                      {cartItem.item.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      {cartItem.restaurantName}
                    </p>
                    <p className="text-xs font-bold text-red-600 mt-0.5">
                      {formatVND(cartItem.item.price)}
                    </p>
                    {cartItem.notes && (
                      <p className="text-[10px] text-amber-700 italic truncate mt-0.5">
                        Lưu ý: {cartItem.notes}
                      </p>
                    )}
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1.5 shrink-0 bg-slate-100 p-1 rounded-lg">
                    <button
                      onClick={() => onUpdateQuantity(cartItem.restaurantId, cartItem.item.id, -1)}
                      className="p-1 hover:bg-white rounded text-slate-600 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-slate-800 w-4 text-center">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(cartItem.restaurantId, cartItem.item.id, 1)}
                      className="p-1 hover:bg-white rounded text-slate-600 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(cartItem.restaurantId, cartItem.item.id)}
                    className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                    title="Xóa món"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Promo code voucher box */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-red-600" />
                  <span>Mã giảm giá FoodZY</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Nhập FOODZY2026"
                    className="flex-1 px-3 py-1.5 text-xs uppercase border border-slate-300 rounded-lg"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>
                {promoMessage && (
                  <p
                    className={`text-[11px] font-semibold mt-1 ${
                      promoMessage.error ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}
              </div>

              {/* Delivery Info form */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800">Thông tin nhận hàng</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Họ tên"
                    className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="SĐT"
                    className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Địa chỉ giao hàng chi tiết"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              {/* Payment selector */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 mb-1.5">Hình thức thanh toán</h4>
                <div className="grid grid-cols-3 gap-1.5 text-[11px] font-semibold">
                  {(['Chuyển khoản QR', 'Ví MoMo', 'Tiền mặt khi nhận'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        paymentMethod === method
                          ? 'border-red-600 bg-red-50 text-red-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Summary */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Tạm tính ({cartItems.length} món):</span>
              <span className="font-semibold text-slate-800">{formatVND(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Phí giao hàng:</span>
              <span className="font-semibold text-slate-800">{formatVND(deliveryFee)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                <span>Ưu đãi giảm giá ({discountPercent}%):</span>
                <span>-{formatVND(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm sm:text-base font-extrabold text-slate-900 pt-1 border-t border-slate-200">
              <span>Tổng thanh toán:</span>
              <span className="text-red-600">{formatVND(finalTotal)}</span>
            </div>

            <button
              onClick={handleConfirmOrder}
              disabled={isSubmitting}
              className="w-full mt-2 py-3 bg-red-600 hover:bg-red-700 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Đang xử lý đơn hàng...</span>
              ) : (
                <>
                  <span>Xác nhận đặt hàng · {formatVND(finalTotal)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
