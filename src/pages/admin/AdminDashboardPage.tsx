import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShoppingBag,
  Truck,
  Box,
  Layers,
  Calendar,
  MessageSquare,
  AlertCircle,
  Check,
  Plus,
  Edit2,
  Trash2,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  getAdminStats,
  getOrders,
  updateOrderStatus,
  updateShipment,
  getAllProductsAdmin,
  updateProductStock,
  upsertProduct,
  getClasses,
  getClassSessions,
  getReservations,
  cancelReservation,
  addClassSession,
  updateSessionCapacity,
  getPosts,
  answerInquiry,
  toggleHidePost,
} from '../../services/api';
import {
  Order,
  OrderStatus,
  Product,
  ClassItem,
  ClassSession,
  Reservation,
  Post,
} from '../../types';
import { usePageMeta } from '../../hooks/usePageMeta';
import ProductImage from '../../components/common/ProductImage';

type AdminTab = 'dashboard' | 'orders' | 'shipment' | 'inventory' | 'products' | 'classes' | 'inquiries';

export const AdminDashboardPage: React.FC = () => {
  usePageMeta('관리자 콘솔', 'MIJE\' 시연용 관리자 관리 시스템입니다.');

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [stats, setStats] = useState({
    newOrdersToday: 0,
    preparingOrders: 0,
    todayReservations: 0,
    lowStockItemsCount: 0,
    pendingInquiriesCount: 0,
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Shipment sub-state
  const [selectedOrderForShipment, setSelectedOrderForShipment] = useState<string>('');
  const [carrier, setCarrier] = useState('우체국택배');
  const [trackingNo, setTrackingNo] = useState('');

  // Product edit modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Inquiry answer state
  const [replyPostId, setReplyPostId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Add Session state
  const [newSessionClassId, setNewSessionClassId] = useState('');
  const [newSessionDate, setNewSessionDate] = useState(new Date().toISOString().slice(0, 10));
  const [newSessionTime, setNewSessionTime] = useState('11:00');
  const [newSessionCapacity, setNewSessionCapacity] = useState(4);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const refreshAllData = async () => {
    try {
      const [st, ords, prods, cls, sess, resvs, psts] = await Promise.all([
        getAdminStats(),
        getOrders(),
        getAllProductsAdmin(),
        getClasses(),
        getClassSessions(),
        getReservations(),
        getPosts(),
      ]);
      setStats(st);
      setOrders(ords);
      setProducts(prods);
      setClasses(cls);
      setSessions(sess);
      setReservations(resvs);
      setPosts(psts);

      if (ords.length > 0 && !selectedOrderForShipment) {
        setSelectedOrderForShipment(ords[0].id);
      }
      if (cls.length > 0 && !newSessionClassId) {
        setNewSessionClassId(cls[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Order status transition handler
  const handleOrderStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    const res = await updateOrderStatus(orderId, nextStatus);
    if (res.success) {
      showToast(`주문 상태가 '${nextStatus}'(으)로 변경되었습니다.`);
      refreshAllData();
    } else {
      showToast(res.message || '상태 변경에 실패했습니다.', 'error');
    }
  };

  // Shipment submit handler
  const handleShipmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForShipment || !trackingNo.trim()) {
      showToast('주문과 송장번호를 모두 입력해 주십시오.', 'error');
      return;
    }
    const res = await updateShipment(selectedOrderForShipment, carrier, trackingNo.trim());
    if (res.success) {
      showToast('배송 정보가 등록되었으며 배송중 상태로 변경되었습니다.');
      setTrackingNo('');
      refreshAllData();
    } else {
      showToast(res.message || '등록 실패', 'error');
    }
  };

  // Stock edit handler
  const handleStockUpdate = async (productId: string, optionId: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    const success = await updateProductStock(productId, optionId, newStock);
    if (success) {
      showToast('재고 수량이 갱신되었습니다.');
      refreshAllData();
    }
  };

  // Inquiry Answer Handler
  const handleReplySubmit = async (postId: string) => {
    if (!replyText.trim()) return;
    const ok = await answerInquiry(postId, replyText.trim());
    if (ok) {
      showToast('문의 답변이 고객에게 정상 등록되었습니다.');
      setReplyPostId(null);
      setReplyText('');
      refreshAllData();
    }
  };

  // Toggle Hide Post Handler
  const handleToggleHide = async (postId: string) => {
    const ok = await toggleHidePost(postId);
    if (ok) {
      showToast('게시물 숨김 상태가 변경되었습니다.');
      refreshAllData();
    }
  };

  // Add Session Handler
  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    await addClassSession(newSessionClassId, newSessionDate, newSessionTime, newSessionCapacity);
    showToast('새 클래스 회차가 등록되었습니다.');
    refreshAllData();
  };

  // Cancel reservation in admin
  const handleCancelReservation = async (resId: string) => {
    if (!window.confirm('해당 예약을 취소하시겠습니까? (회차 잔여석이 자동으로 환원됩니다)')) return;
    const ok = await cancelReservation(resId);
    if (ok) {
      showToast('예약이 취소되었으며 정원이 복구되었습니다.');
      refreshAllData();
    }
  };

  // Save Product (New or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    await upsertProduct(editingProduct);
    showToast('상품 정보가 성공적으로 저장되었습니다.');
    setIsProductModalOpen(false);
    setEditingProduct(null);
    refreshAllData();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-32">
      {/* Top Demo Security Notice */}
      <div className="bg-[#161616] border border-[#C2A878] p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-[#C2A878] flex-shrink-0" />
          <div className="text-xs">
            <span className="text-[#EDEAE4] font-medium block">
              MIJE&apos; 시연용 관리자 백오피스 (통합 관리 콘솔)
            </span>
            <span className="text-[#9A958D]">
              * 실제 서비스 오픈 시 Supabase 인증 및 관리자 역할(RBAC) 보호가 적용될 영역입니다.
            </span>
          </div>
        </div>
        <Link
          to="/"
          className="text-xs px-3 py-1.5 border border-[#2A2A2A] hover:border-[#EDEAE4] text-[#EDEAE4] whitespace-nowrap min-h-[36px] flex items-center"
        >
          쇼핑몰 메인으로 이동
        </Link>
      </div>

      {/* Toast message */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 border text-xs flex items-center gap-2 animate-fadeIn shadow-xl ${
            toastMessage.type === 'success'
              ? 'bg-[#161616] border-[#C2A878] text-[#EDEAE4]'
              : 'bg-[#161616] border-[#C46A5E] text-[#C46A5E]'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <Check className="w-4 h-4 text-[#C2A878]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#C46A5E]" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-[#2A2A2A] scrollbar-none text-xs">
        {[
          { key: 'dashboard', label: '대시보드', icon: Layers },
          { key: 'orders', label: '주문 관리', icon: ShoppingBag },
          { key: 'shipment', label: '배송 처리', icon: Truck },
          { key: 'inventory', label: '재고 관리', icon: Box },
          { key: 'products', label: '상품 등록/수정', icon: Edit2 },
          { key: 'classes', label: '클래스·예약 관리', icon: Calendar },
          { key: 'inquiries', label: '문의·후기 관리', icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as AdminTab)}
              className={`px-4 py-2.5 whitespace-nowrap border transition-colors flex items-center gap-2 min-h-[44px] ${
                isActive
                  ? 'border-[#C2A878] bg-[#161616] text-[#C2A878] font-bold'
                  : 'border-transparent text-[#9A958D] hover:text-[#EDEAE4]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 1. DASHBOARD */}
      {/* ========================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-[#161616] border border-[#2A2A2A] p-5 space-y-1">
              <span className="text-[11px] text-[#9A958D]">오늘 신규 주문</span>
              <div className="text-2xl font-serif text-[#EDEAE4]">{stats.newOrdersToday}건</div>
            </div>
            <div className="bg-[#161616] border border-[#2A2A2A] p-5 space-y-1">
              <span className="text-[11px] text-[#9A958D]">배송 준비 중</span>
              <div className="text-2xl font-serif text-[#C2A878]">{stats.preparingOrders}건</div>
            </div>
            <div className="bg-[#161616] border border-[#2A2A2A] p-5 space-y-1">
              <span className="text-[11px] text-[#9A958D]">오늘 클래스 예약</span>
              <div className="text-2xl font-serif text-[#EDEAE4]">{stats.todayReservations}명</div>
            </div>
            <div className="bg-[#161616] border border-[#2A2A2A] p-5 space-y-1">
              <span className="text-[11px] text-[#9A958D]">재고 부족 상품</span>
              <div className="text-2xl font-serif text-[#C46A5E]">{stats.lowStockItemsCount}건</div>
            </div>
            <div className="bg-[#161616] border border-[#2A2A2A] p-5 space-y-1">
              <span className="text-[11px] text-[#9A958D]">답변 대기 문의</span>
              <div className="text-2xl font-serif text-[#C2A878]">{stats.pendingInquiriesCount}건</div>
            </div>
          </div>

          {/* Quick Overview Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div className="bg-[#161616] border border-[#2A2A2A] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                <h3 className="text-sm font-medium text-[#EDEAE4]">최근 접수 주문</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#C2A878] hover:underline"
                >
                  전체보기
                </button>
              </div>
              <div className="divide-y divide-[#2A2A2A] text-xs">
                {orders.slice(0, 4).map((o) => (
                  <div key={o.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-[#EDEAE4] font-medium">{o.orderNo}</div>
                      <div className="text-[11px] text-[#9A958D]">
                        {o.customerName} · {o.items.length}개 상품 · {o.totalPrice.toLocaleString()}원
                      </div>
                    </div>
                    <span className="px-2 py-0.5 border border-[#2A2A2A] text-[10px] text-[#C2A878]">
                      {o.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Reservations */}
            <div className="bg-[#161616] border border-[#2A2A2A] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                <h3 className="text-sm font-medium text-[#EDEAE4]">최근 클래스 예약 내역</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('classes')}
                  className="text-xs text-[#C2A878] hover:underline"
                >
                  전체보기
                </button>
              </div>
              <div className="divide-y divide-[#2A2A2A] text-xs">
                {reservations.slice(0, 4).map((r) => (
                  <div key={r.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-[#EDEAE4] font-medium">{r.className}</div>
                      <div className="text-[11px] text-[#9A958D]">
                        {r.sessionDate} {r.sessionTime} · {r.name} ({r.headcount}명)
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 border text-[10px] ${
                        r.status === 'confirmed'
                          ? 'border-[#C2A878] text-[#C2A878]'
                          : 'border-[#C46A5E] text-[#C46A5E]'
                      }`}
                    >
                      {r.status === 'confirmed' ? '예약확정' : '취소됨'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. ORDERS MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'orders' && (
        <div className="bg-[#161616] border border-[#2A2A2A] p-6 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2A2A2A] pb-4">
            <div>
              <h3 className="text-base font-medium text-[#EDEAE4]">주문 및 상태 관리</h3>
              <p className="text-xs text-[#9A958D] mt-0.5">
                허용되지 않는 단계 건너뛰기는 방지됩니다. (결제완료 → 상품준비 → 배송중 → 배송완료, 취소)
              </p>
            </div>
            <span className="text-xs text-[#C2A878] font-serif">총 {orders.length}건</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#2A2A2A] text-[#9A958D] pb-2">
                  <th className="py-3 px-2 font-medium">주문번호/일시</th>
                  <th className="py-3 px-2 font-medium">주문자/연락처</th>
                  <th className="py-3 px-2 font-medium">주문 상품</th>
                  <th className="py-3 px-2 font-medium text-right">총액</th>
                  <th className="py-3 px-2 font-medium text-center">현재 상태</th>
                  <th className="py-3 px-2 font-medium text-center">상태 변경 액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]/60">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#0E0E0E]/40">
                    <td className="py-3.5 px-2">
                      <div className="font-serif text-[#EDEAE4] font-medium">{ord.orderNo}</div>
                      <div className="text-[11px] text-[#9A958D]">
                        {new Date(ord.createdAt).toLocaleDateString('ko-KR')}
                      </div>
                    </td>
                    <td className="py-3.5 px-2">
                      <div className="text-[#EDEAE4]">{ord.customerName}</div>
                      <div className="text-[11px] text-[#9A958D]">{ord.phone}</div>
                    </td>
                    <td className="py-3.5 px-2 max-w-xs">
                      {ord.items.map((it, i) => (
                        <div key={i} className="text-[#EDEAE4] line-clamp-1">
                          {it.productName} ({it.optionLabel}) x {it.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="py-3.5 px-2 text-right font-serif text-[#EDEAE4]">
                      {ord.totalPrice.toLocaleString()}원
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 text-[11px] border ${
                          ord.status === 'delivered'
                            ? 'border-[#2A2A2A] text-[#9A958D]'
                            : ord.status === 'shipping'
                            ? 'border-[#C2A878] text-[#C2A878]'
                            : ord.status === 'cancelled'
                            ? 'border-[#C46A5E] text-[#C46A5E]'
                            : 'border-[#EDEAE4] text-[#EDEAE4]'
                        }`}
                      >
                        {ord.status === 'payment_complete' && '결제완료'}
                        {ord.status === 'preparing' && '상품준비'}
                        {ord.status === 'shipping' && '배송중'}
                        {ord.status === 'delivered' && '배송완료'}
                        {ord.status === 'cancelled' && '주문취소'}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {ord.status === 'payment_complete' && (
                          <button
                            type="button"
                            onClick={() => handleOrderStatusChange(ord.id, 'preparing')}
                            className="px-2 py-1 bg-[#0E0E0E] border border-[#2A2A2A] hover:border-[#C2A878] text-[#EDEAE4] text-[11px]"
                          >
                            상품준비 전환
                          </button>
                        )}
                        {ord.status === 'preparing' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrderForShipment(ord.id);
                              setActiveTab('shipment');
                            }}
                            className="px-2 py-1 bg-[#0E0E0E] border border-[#C2A878] text-[#C2A878] text-[11px]"
                          >
                            송장입력 &amp; 출고
                          </button>
                        )}
                        {ord.status === 'shipping' && (
                          <button
                            type="button"
                            onClick={() => handleOrderStatusChange(ord.id, 'delivered')}
                            className="px-2 py-1 bg-[#0E0E0E] border border-[#2A2A2A] hover:border-[#EDEAE4] text-[#EDEAE4] text-[11px]"
                          >
                            배송완료 처리
                          </button>
                        )}
                        {ord.status !== 'cancelled' && ord.status !== 'delivered' && (
                          <button
                            type="button"
                            onClick={() => handleOrderStatusChange(ord.id, 'cancelled')}
                            className="px-2 py-1 bg-[#0E0E0E] border border-[#C46A5E]/60 text-[#C46A5E] hover:border-[#C46A5E] text-[11px]"
                          >
                            주문취소
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. SHIPMENT MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'shipment' && (
        <div className="max-w-2xl bg-[#161616] border border-[#2A2A2A] p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="border-b border-[#2A2A2A] pb-4">
            <h3 className="text-base font-medium text-[#EDEAE4]">배송 정보 등록 및 송장 입력</h3>
            <p className="text-xs text-[#9A958D] mt-1">
              송장번호를 저장하면 해당 주문의 상태가 즉시 &apos;배송중&apos;으로 변경되며 고객 주문조회에 반영됩니다.
            </p>
          </div>

          <form onSubmit={handleShipmentSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[#EDEAE4] mb-1">대상 주문 선택</label>
              <select
                value={selectedOrderForShipment}
                onChange={(e) => setSelectedOrderForShipment(e.target.value)}
                className="w-full bg-[#0E0E0E] border border-[#2A2A2A] px-3.5 py-2.5 text-xs text-[#EDEAE4] focus:border-[#C2A878] focus:outline-none min-h-[44px]"
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.orderNo} | {o.customerName} ({o.status}) - {o.totalPrice.toLocaleString()}원
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#EDEAE4] mb-1">택배사</label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full bg-[#0E0E0E] border border-[#2A2A2A] px-3.5 py-2.5 text-xs text-[#EDEAE4] focus:border-[#C2A878] focus:outline-none min-h-[44px]"
                >
                  <option value="우체국택배">우체국택배 (기본)</option>
                  <option value="CJ대한통운">CJ대한통운</option>
                  <option value="로젠택배">로젠택배</option>
                  <option value="한진택배">한진택배</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#EDEAE4] mb-1">
                  운송장 번호 <span className="text-[#C2A878]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={trackingNo}
                  onChange={(e) => setTrackingNo(e.target.value)}
                  placeholder="예: 6892301988231"
                  className="w-full bg-[#0E0E0E] border border-[#2A2A2A] px-3.5 py-2.5 text-xs text-[#EDEAE4] placeholder-[#9A958D] focus:border-[#C2A878] focus:outline-none min-h-[44px]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#EDEAE4] text-[#0E0E0E] text-xs uppercase tracking-widest font-medium hover:bg-white min-h-[44px]"
            >
              배송 정보 저장 및 출고 완료
            </button>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. INVENTORY MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'inventory' && (
        <div className="bg-[#161616] border border-[#2A2A2A] p-6 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
            <div>
              <h3 className="text-base font-medium text-[#EDEAE4]">재고 관리 및 품절 제어</h3>
              <p className="text-xs text-[#9A958D] mt-0.5">
                옵션별 수량을 직접 수정할 수 있으며, 2개 이하 시 주의 배지가 표기됩니다.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#2A2A2A] text-[#9A958D]">
                  <th className="py-3 px-2 font-medium">상품명</th>
                  <th className="py-3 px-2 font-medium">유형</th>
                  <th className="py-3 px-2 font-medium">옵션명</th>
                  <th className="py-3 px-2 font-medium text-center">현재 재고</th>
                  <th className="py-3 px-2 font-medium text-center">재고 수량 조절</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]/60">
                {products.flatMap((prod) =>
                  prod.options.map((opt) => {
                    const isLow = opt.stock <= 2 && opt.stock > 0;
                    const isSoldOut = opt.stock === 0;

                    return (
                      <tr key={opt.id} className="hover:bg-[#0E0E0E]/40">
                        <td className="py-3 px-2 font-medium text-[#EDEAE4]">{prod.name}</td>
                        <td className="py-3 px-2 text-[#9A958D]">
                          {prod.type === 'handmade' ? '핸드메이드' : '기성품'}
                        </td>
                        <td className="py-3 px-2 text-[#EDEAE4]">{opt.label}</td>
                        <td className="py-3 px-2 text-center">
                          <span
                            className={`px-2 py-0.5 font-serif text-xs ${
                              isSoldOut
                                ? 'text-[#6F6A63] bg-[#0E0E0E] border border-[#2A2A2A]'
                                : isLow
                                ? 'text-[#C46A5E] bg-[#0E0E0E] border border-[#C46A5E]'
                                : 'text-[#EDEAE4]'
                            }`}
                          >
                            {opt.stock}개 {isSoldOut && '(품절)'} {isLow && '(부족)'}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleStockUpdate(prod.id, opt.id, opt.stock, -1)}
                              className="px-2.5 py-1 bg-[#0E0E0E] border border-[#2A2A2A] text-xs hover:border-[#C2A878] text-[#EDEAE4]"
                            >
                              -1
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStockUpdate(prod.id, opt.id, opt.stock, 1)}
                              className="px-2.5 py-1 bg-[#0E0E0E] border border-[#2A2A2A] text-xs hover:border-[#C2A878] text-[#EDEAE4]"
                            >
                              +1
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStockUpdate(prod.id, opt.id, opt.stock, 5)}
                              className="px-2.5 py-1 bg-[#0E0E0E] border border-[#2A2A2A] text-xs hover:border-[#C2A878] text-[#EDEAE4]"
                            >
                              +5
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. PRODUCTS REGISTRATION & EDIT */}
      {/* ========================================================= */}
      {activeTab === 'products' && (
        <div className="bg-[#161616] border border-[#2A2A2A] p-6 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
            <div>
              <h3 className="text-base font-medium text-[#EDEAE4]">상품 목록 및 등록</h3>
              <p className="text-xs text-[#9A958D] mt-0.5">
                이미지 업로드는 4:5 비율의 이미지 URL 입력으로 대체됩니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingProduct({
                  id: `p-${Date.now()}`,
                  slug: `item-${Date.now()}`,
                  type: 'ready-made',
                  category: 'ring',
                  name: '',
                  price: 50000,
                  material: 'Silver 925',
                  weight: '약 3.5g',
                  description: '',
                  images: [],
                  isVisible: true,
                  options: [{ id: `opt-${Date.now()}`, productId: '', label: '기본 규격', stock: 5 }],
                  createdAt: new Date().toISOString(),
                });
                setIsProductModalOpen(true);
              }}
              className="px-4 py-2 bg-[#EDEAE4] text-[#0E0E0E] text-xs uppercase tracking-widest font-medium hover:bg-white flex items-center gap-2 min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>신규 상품 등록</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="p-4 bg-[#0E0E0E] border border-[#2A2A2A] flex gap-3">
                <div className="w-16 h-20 flex-shrink-0 bg-[#161616] overflow-hidden">
                  <ProductImage src={p.images?.[0]} alt="" />
                </div>
                <div className="space-y-1 flex-1 text-xs">
                  <div className="text-[10px] text-[#C2A878] uppercase">{p.type} · {p.category}</div>
                  <div className="text-[#EDEAE4] font-medium line-clamp-1">{p.name}</div>
                  <div className="font-serif text-[#EDEAE4]">{p.price.toLocaleString()}원</div>
                  <div className="text-[#9A958D] text-[11px]">
                    옵션: {p.options.map((o) => `${o.label}(${o.stock})`).join(', ')}
                  </div>
                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct({ ...p });
                        setIsProductModalOpen(true);
                      }}
                      className="px-2.5 py-1 border border-[#2A2A2A] hover:border-[#C2A878] text-[11px] text-[#EDEAE4]"
                    >
                      수정하기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Product Edit / Register Modal */}
          {isProductModalOpen && editingProduct && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
            >
              <div className="bg-[#161616] border border-[#C2A878] max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="border-b border-[#2A2A2A] pb-3 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-[#EDEAE4]">
                    {editingProduct.name ? '상품 정보 수정' : '신규 상품 등록'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="text-xs text-[#9A958D] hover:text-[#EDEAE4]"
                  >
                    닫기
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#EDEAE4] mb-1">상품 구분</label>
                      <select
                        value={editingProduct.type}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            type: e.target.value as 'ready-made' | 'handmade',
                          })
                        }
                        className="w-full bg-[#0E0E0E] border border-[#2A2A2A] p-2 text-[#EDEAE4]"
                      >
                        <option value="ready-made">기성품 (Ready-made)</option>
                        <option value="handmade">핸드메이드 (Handmade)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#EDEAE4] mb-1">착용 부위 (카테고리)</label>
                      <select
                        value={editingProduct.category}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            category: e.target.value as any,
                          })
                        }
                        className="w-full bg-[#0E0E0E] border border-[#2A2A2A] p-2 text-[#EDEAE4]"
                      >
                        <option value="ring">반지 (ring)</option>
                        <option value="necklace">목걸이 (necklace)</option>
                        <option value="earring">귀걸이 (earring)</option>
                        <option value="bracelet">팔찌 (bracelet)</option>
                        <option value="etc">기타 (etc)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#EDEAE4] mb-1">상품명</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, name: e.target.value })
                      }
                      className="w-full bg-[#0E0E0E] border border-[#2A2A2A] p-2 text-[#EDEAE4]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[#EDEAE4] mb-1">판매 가격 (원)</label>
                      <input
                        type="number"
                        required
                        value={editingProduct.price}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            price: Number(e.target.value),
                          })
                        }
                        className="w-full bg-[#0E0E0E] border border-[#2A2A2A] p-2 text-[#EDEAE4]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#EDEAE4] mb-1">소재</label>
                      <input
                        type="text"
                        value={editingProduct.material}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, material: e.target.value })
                        }
                        className="w-full bg-[#0E0E0E] border border-[#2A2A2A] p-2 text-[#EDEAE4]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#EDEAE4] mb-1">중량</label>
                      <input
                        type="text"
                        value={editingProduct.weight}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, weight: e.target.value })
                        }
                        className="w-full bg-[#0E0E0E] border border-[#2A2A2A] p-2 text-[#EDEAE4]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#EDEAE4] mb-1">대표 이미지 URL (4:5 비율)</label>
                    <input
                      type="url"
                      required
                      value={editingProduct.images[0] || ''}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          images: [e.target.value, ...(editingProduct.images.slice(1))],
                        })
                      }
                      className="w-full bg-[#0E0E0E] border border-[#2A2A2A] p-2 text-[#EDEAE4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#EDEAE4] mb-1">상세 설명</label>
                    <textarea
                      rows={3}
                      value={editingProduct.description}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, description: e.target.value })
                      }
                      className="w-full bg-[#0E0E0E] border border-[#2A2A2A] p-2 text-[#EDEAE4]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-[#2A2A2A]">
                    <button
                      type="button"
                      onClick={() => setIsProductModalOpen(false)}
                      className="px-4 py-2 border border-[#2A2A2A] text-[#9A958D]"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#EDEAE4] text-[#0E0E0E] font-medium"
                    >
                      저장하기
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. CLASSES & RESERVATIONS */}
      {/* ========================================================= */}
      {activeTab === 'classes' && (
        <div className="space-y-8 animate-fadeIn">
          {/* New Session Add Form */}
          <div className="bg-[#161616] border border-[#2A2A2A] p-6 space-y-4">
            <h3 className="text-sm font-medium text-[#EDEAE4]">클래스 신규 회차 오픈</h3>
            <form onSubmit={handleAddSession} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[#EDEAE4] mb-1">클래스 선택</label>
                <select
                  value={newSessionClassId}
                  onChange={(e) => setNewSessionClassId(e.target.value)}
                  className="w-full bg-[#0E0E0E] border border-[#2A2A2A] p-2 text-[#EDEAE4]"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#EDEAE4] mb-1">날짜</label>
                <input
                  type="date"
                  required
                  value={newSessionDate}
                  onChange={(e) => setNewSessionDate(e.target.value)}
                  className="w-full bg-[#0E0E0E] border border-[#2A2A2A] p-2 text-[#EDEAE4]"
                />
              </div>

              <div>
                <label className="block text-[#EDEAE4] mb-1">시간</label>
                <select
                  value={newSessionTime}
                  onChange={(e) => setNewSessionTime(e.target.value)}
                  className="w-full bg-[#0E0E0E] border border-[#2A2A2A] p-2 text-[#EDEAE4]"
                >
                  <option value="11:00">11:00</option>
                  <option value="15:00">15:00</option>
                  <option value="19:00">19:00 (저녁 특별반)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-[#EDEAE4] text-[#0E0E0E] font-medium min-h-[38px]"
                >
                  회차 개설
                </button>
              </div>
            </form>
          </div>

          {/* Reservations List */}
          <div className="bg-[#161616] border border-[#2A2A2A] p-6 space-y-4">
            <h3 className="text-sm font-medium text-[#EDEAE4]">전체 예약자 명단</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#2A2A2A] text-[#9A958D]">
                    <th className="py-2.5 px-2">예약번호</th>
                    <th className="py-2.5 px-2">클래스명</th>
                    <th className="py-2.5 px-2">일정</th>
                    <th className="py-2.5 px-2">예약자(인원)</th>
                    <th className="py-2.5 px-2">연락처</th>
                    <th className="py-2.5 px-2">상태</th>
                    <th className="py-2.5 px-2 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]/60">
                  {reservations.map((r) => (
                    <tr key={r.id}>
                      <td className="py-2.5 px-2 font-serif text-[#C2A878]">{r.reservationNo}</td>
                      <td className="py-2.5 px-2 text-[#EDEAE4]">{r.className}</td>
                      <td className="py-2.5 px-2 text-[#9A958D]">
                        {r.sessionDate} {r.sessionTime}
                      </td>
                      <td className="py-2.5 px-2 text-[#EDEAE4]">
                        {r.name} ({r.headcount}명)
                      </td>
                      <td className="py-2.5 px-2 text-[#9A958D]">{r.phone}</td>
                      <td className="py-2.5 px-2">
                        <span
                          className={`px-2 py-0.5 text-[10px] border ${
                            r.status === 'confirmed'
                              ? 'border-[#C2A878] text-[#C2A878]'
                              : 'border-[#C46A5E] text-[#C46A5E]'
                          }`}
                        >
                          {r.status === 'confirmed' ? '예약확정' : '취소됨'}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        {r.status === 'confirmed' && (
                          <button
                            type="button"
                            onClick={() => handleCancelReservation(r.id)}
                            className="px-2 py-1 border border-[#C46A5E] text-[#C46A5E] hover:bg-[#C46A5E] hover:text-[#0E0E0E] text-[10px]"
                          >
                            예약 취소
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. INQUIRIES & REVIEWS MODERATION */}
      {/* ========================================================= */}
      {activeTab === 'inquiries' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Customer Inquiries */}
          <div className="bg-[#161616] border border-[#2A2A2A] p-6 space-y-4">
            <h3 className="text-sm font-medium text-[#EDEAE4]">1:1 고객 문의 답변 관리</h3>
            <div className="space-y-4">
              {posts
                .filter((p) => p.board === 'inquiry')
                .map((inq) => (
                  <div key={inq.id} className="p-4 bg-[#0E0E0E] border border-[#2A2A2A] space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#EDEAE4]">{inq.title}</span>
                        {inq.relatedName && (
                          <span className="text-[#C2A878]">({inq.relatedName})</span>
                        )}
                      </div>
                      <span
                        className={`px-2 py-0.5 text-[10px] border ${
                          inq.answer ? 'border-[#2A2A2A] text-[#9A958D]' : 'border-[#C2A878] text-[#C2A878]'
                        }`}
                      >
                        {inq.answer ? '답변완료' : '답변대기'}
                      </span>
                    </div>

                    <p className="text-[#9A958D] leading-relaxed">{inq.body}</p>

                    {inq.answer && (
                      <div className="p-3 bg-[#161616] border border-[#2A2A2A] text-[#EDEAE4] space-y-1">
                        <span className="text-[#C2A878] font-medium block">등록된 답변:</span>
                        <p>{inq.answer}</p>
                      </div>
                    )}

                    {replyPostId === inq.id ? (
                      <div className="space-y-2 pt-2">
                        <textarea
                          rows={3}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="작가 공식 답변을 입력하세요..."
                          className="w-full bg-[#161616] border border-[#2A2A2A] p-2 text-xs text-[#EDEAE4] focus:border-[#C2A878]"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setReplyPostId(null);
                              setReplyText('');
                            }}
                            className="px-3 py-1 border border-[#2A2A2A] text-[#9A958D]"
                          >
                            취소
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReplySubmit(inq.id)}
                            className="px-4 py-1 bg-[#EDEAE4] text-[#0E0E0E] font-medium"
                          >
                            답변 전송
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setReplyPostId(inq.id);
                          setReplyText(inq.answer || '');
                        }}
                        className="text-[#C2A878] hover:underline pt-1 inline-block"
                      >
                        {inq.answer ? '답변 수정하기' : '답변 작성하기'}
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Customer Reviews Moderation */}
          <div className="bg-[#161616] border border-[#2A2A2A] p-6 space-y-4">
            <h3 className="text-sm font-medium text-[#EDEAE4]">후기 노출/숨김 관리</h3>
            <div className="divide-y divide-[#2A2A2A] text-xs">
              {posts
                .filter((p) => p.board === 'review')
                .map((rev) => (
                  <div key={rev.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-[#EDEAE4] font-medium">
                        {rev.title} (별점 {rev.rating}점)
                      </div>
                      <div className="text-[11px] text-[#9A958D]">
                        작성자: {rev.author} · 대상: {rev.relatedName || '일반'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleHide(rev.id)}
                      className={`px-3 py-1 border flex items-center gap-1 text-[11px] ${
                        rev.isHidden
                          ? 'border-[#C46A5E] text-[#C46A5E]'
                          : 'border-[#2A2A2A] text-[#9A958D] hover:text-[#EDEAE4]'
                      }`}
                    >
                      {rev.isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{rev.isHidden ? '숨김 상태 (클릭시 공개)' : '정상 노출 (클릭시 숨김)'}</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminDashboardPage;
