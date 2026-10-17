import React, { useState } from 'react';
import { X, ShoppingBag, Calendar, Clock, CheckCircle2, MapPin } from 'lucide-react';
import { Order, Reservation } from '../types';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  reservations: Reservation[];
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  reservations,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'orders' | 'reservations'>('orders');

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 className="font-extrabold text-base sm:text-lg text-slate-800">
            Lịch sử hoạt động của tôi
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-white">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'border-red-600 text-red-600 bg-red-50/20'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Đơn hàng món ăn ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'reservations'
                ? 'border-red-600 text-red-600 bg-red-50/20'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Bàn đã đặt ({reservations.length})</span>
          </button>
        </div>

        {/* List Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'orders' && (
            <>
              {orders.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-semibold text-slate-600">Bạn chưa có đơn đặt món nào</p>
                  <p className="text-xs text-slate-400 mt-1">Các món bạn đặt sẽ được lưu và hiển thị tại đây.</p>
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800">
                          {ord.id}
                        </span>
                        <span className="text-[11px] text-slate-400">· {ord.createdAt}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                        {ord.status}
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="py-1.5 flex justify-between text-xs text-slate-700">
                          <span>
                            {it.quantity}x {it.item.name} ({it.restaurantName})
                          </span>
                          <span className="font-semibold text-slate-900">
                            {formatVND(it.item.price * it.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        Thanh toán: <b>{ord.paymentMethod}</b>
                      </span>
                      <span className="text-sm font-extrabold text-red-600">
                        {formatVND(ord.finalAmount)}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{ord.deliveryAddress}</span>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'reservations' && (
            <>
              {reservations.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-semibold text-slate-600">Bạn chưa có lịch đặt bàn nào</p>
                  <p className="text-xs text-slate-400 mt-1">Chọn nhà hàng yêu thích và đặt bàn trực tuyến dễ dàng.</p>
                </div>
              ) : (
                reservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900">{res.restaurantName}</h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{res.status}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Ngày: <b>{res.date}</b></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Giờ: <b>{res.time}</b></span>
                      </div>
                      <div className="col-span-2">
                        <span>Số lượng: <b>{res.guests} người</b> (Tên: {res.customerName} - {res.phone})</span>
                      </div>
                      {res.notes && (
                        <div className="col-span-2 text-[11px] text-slate-500 italic">
                          Lưu ý: {res.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
