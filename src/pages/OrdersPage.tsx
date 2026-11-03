import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { getOrderByNumberAndPhone } from '../services/api';
import { Order, OrderStatus } from '../types';
import SectionTitle from '../components/common/SectionTitle';
import { usePageMeta } from '../hooks/usePageMeta';

const ORDER_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'payment_complete', label: '결제완료' },
  { key: 'preparing', label: '상품준비' },
  { key: 'shipping', label: '배송중' },
  { key: 'delivered', label: '배송완료' },
];

export const OrdersPage: React.FC = () => {
  usePageMeta('주문조회', '주문번호와 연락처로 실시간 주문 및 배송 현황을 조회합니다.');

  const [searchParams] = useSearchParams();
  const [orderNo, setOrderNo] = useState(searchParams.get('orderNo') || '');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (targetOrderNo = orderNo, targetPhone = phone) => {
    if (!targetOrderNo.trim() || !targetPhone.trim()) return;
    setIsLoading(true);
    setHasSearched(true);
    try {
      const order = await getOrderByNumberAndPhone(targetOrderNo, targetPhone);
      setFoundOrder(order);
    } catch (err) {
      console.error(err);
      setFoundOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('orderNo') && searchParams.get('phone')) {
      handleSearch(searchParams.get('orderNo')!, searchParams.get('phone')!);
    }
  }, [searchParams]);

  // Quick fill demo sample orders
  const fillSampleOrder = (sampleOrderNo: string, samplePhone: string) => {
    setOrderNo(sampleOrderNo);
    setPhone(samplePhone);
    handleSearch(sampleOrderNo, samplePhone);
  };

  const currentStepIndex = foundOrder
    ? ORDER_STEPS.findIndex((s) => s.key === foundOrder.status)
    : -1;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 pb-28 max-w-3xl">
      <SectionTitle en="TRACK ORDER" ko="주문 및 배송 조회" />

      {/* Demo sample quick buttons */}
      <div className="bg-[#161616] border border-[#2A2A2A] p-4 sm:p-5 mb-8 text-xs text-[#9A958D] space-y-2.5">
        <div className="text-[#EDEAE4] font-medium flex items-center justify-between">
          <span>시연용 샘플 주문 원클릭 조회</span>
          <span className="text-[11px] text-[#C2A878]">체험용</span>
        </div>
        <p className="text-[11px]">
          아래 버튼을 누르면 미리 등록된 주문 정보를 자동으로 입력하여 조회를 시연합니다.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => fillSampleOrder('ORD-20261028-001', '010-1234-5678')}
            className="px-3 py-1.5 bg-[#0E0E0E] border border-[#2A2A2A] hover:border-[#C2A878] text-[#EDEAE4] text-xs transition-colors"
          >
            샘플 1: 배송완료 (김민준)
          </button>
          <button
            type="button"
            onClick={() => fillSampleOrder('ORD-20261031-002', '010-9876-5432')}
            className="px-3 py-1.5 bg-[#0E0E0E] border border-[#2A2A2A] hover:border-[#C2A878] text-[#EDEAE4] text-xs transition-colors"
          >
            샘플 2: 배송중 (이서연)
          </button>
          <button
            type="button"
            onClick={() => fillSampleOrder('ORD-20261102-003', '010-5555-7777')}
            className="px-3 py-1.5 bg-[#0E0E0E] border border-[#2A2A2A] hover:border-[#C2A878] text-[#EDEAE4] text-xs transition-colors"
          >
            샘플 3: 결제완료 (박지훈)
          </button>
        </div>
      </div>

      {/* Search Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="bg-[#161616] border border-[#2A2A2A] p-6 space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#EDEAE4] mb-1">
              주문 번호 <span className="text-[#C2A878]">*</span>
            </label>
            <input
              type="text"
              required
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value)}
              placeholder="예: ORD-20261028-001"
              className="w-full bg-[#0E0E0E] border border-[#2A2A2A] px-3.5 py-2.5 text-xs text-[#EDEAE4] placeholder-[#9A958D] focus:border-[#C2A878] focus:outline-none min-h-[44px]"
            />
          </div>

          <div>
            <label className="block text-xs text-[#EDEAE4] mb-1">
              주문 시 연락처 <span className="text-[#C2A878]">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              className="w-full bg-[#0E0E0E] border border-[#2A2A2A] px-3.5 py-2.5 text-xs text-[#EDEAE4] placeholder-[#9A958D] focus:border-[#C2A878] focus:outline-none min-h-[44px]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-[#EDEAE4] text-[#0E0E0E] text-xs uppercase tracking-widest font-medium hover:bg-white hover:ring-1 hover:ring-[#C2A878] transition-all min-h-[44px] flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span>{isLoading ? '조회 중...' : '주문 내역 조회하기'}</span>
        </button>
      </form>

      {/* Query Results */}
      {hasSearched && (
        <div className="mt-8">
          {foundOrder ? (
            <div className="bg-[#161616] border border-[#2A2A2A] p-6 sm:p-8 space-y-8 animate-fadeIn">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#2A2A2A] gap-2">
                <div>
                  <span className="text-[11px] text-[#9A958D] block">
                    주문 일시: {new Date(foundOrder.createdAt).toLocaleString('ko-KR')}
                  </span>
                  <div className="font-serif text-lg text-[#EDEAE4] tracking-wide mt-0.5">
                    주문 번호: <span className="text-[#C2A878]">{foundOrder.orderNo}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 text-xs border border-[#C2A878] text-[#C2A878] font-medium">
                    {foundOrder.status === 'cancelled'
                      ? '주문취소'
                      : ORDER_STEPS.find((s) => s.key === foundOrder.status)?.label || foundOrder.status}
                  </span>
                </div>
              </div>

              {/* Status Stepper (if not cancelled) */}
              {foundOrder.status !== 'cancelled' ? (
                <div className="py-2">
                  <div className="grid grid-cols-4 relative text-center">
                    {/* Stepper horizontal line */}
                    <div className="absolute top-4 left-[12%] right-[12%] h-[1px] bg-[#2A2A2A] -z-0" />

                    {ORDER_STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      return (
                        <div key={step.key} className="flex flex-col items-center relative z-10 space-y-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border text-xs transition-colors ${
                              isCurrent
                                ? 'bg-[#C2A878] border-[#C2A878] text-[#0E0E0E] font-bold ring-4 ring-[#C2A878]/20'
                                : isCompleted
                                ? 'bg-[#161616] border-[#C2A878] text-[#C2A878]'
                                : 'bg-[#0E0E0E] border-[#2A2A2A] text-[#9A958D]'
                            }`}
                          >
                            {idx + 1}
                          </div>
                          <span
                            className={`text-xs ${
                              isCurrent ? 'text-[#EDEAE4] font-medium' : 'text-[#9A958D]'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-[#0E0E0E] border border-[#C46A5E] text-[#C46A5E] text-xs">
                  본 주문은 취소 처리되었습니다.
                </div>
              )}

              {/* Shipment Tracking Information (if shipped or delivered) */}
              {foundOrder.shipment && (
                <div className="p-4 bg-[#0E0E0E] border border-[#2A2A2A] space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-[#EDEAE4] font-medium">
                    <Truck className="w-4 h-4 text-[#C2A878]" />
                    <span>배송 정보 ({foundOrder.shipment.carrier})</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[#9A958D] gap-2 pt-1">
                    <span>
                      송장 번호: <strong className="text-[#EDEAE4]">{foundOrder.shipment.trackingNo}</strong>
                    </span>
                    {foundOrder.shipment.trackingUrl && (
                      <a
                        href={foundOrder.shipment.trackingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#C2A878] hover:underline"
                      >
                        <span>배송 조회 서비스 이동</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-medium text-[#EDEAE4] border-b border-[#2A2A2A] pb-2">
                  주문 상품 ({foundOrder.items.length})
                </h4>
                <div className="divide-y divide-[#2A2A2A]/60">
                  {foundOrder.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt=""
                          className="w-12 h-15 object-cover bg-[#0E0E0E] border border-[#2A2A2A]"
                        />
                        <div>
                          <div className="text-[#EDEAE4] font-medium">{item.productName}</div>
                          <div className="text-[11px] text-[#9A958D]">
                            옵션: {item.optionLabel} · 수량: {item.quantity}개
                          </div>
                        </div>
                      </div>
                      <div className="font-serif text-[#EDEAE4]">
                        {(item.price * item.quantity).toLocaleString()}원
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recipient & Total breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#2A2A2A] text-xs text-[#9A958D]">
                <div className="space-y-1.5">
                  <span className="text-[#EDEAE4] font-medium block">수령인 정보</span>
                  <p>이름: {foundOrder.customerName}</p>
                  <p>연락처: {foundOrder.phone}</p>
                  <p>주소: {foundOrder.address} {foundOrder.detailAddress}</p>
                  {foundOrder.shippingNote && <p>메모: {foundOrder.shippingNote}</p>}
                </div>
                <div className="space-y-1.5 text-right sm:border-l sm:border-[#2A2A2A] sm:pl-6">
                  <span className="text-[#EDEAE4] font-medium block">결제 정보</span>
                  <p>결제 수단: {foundOrder.paymentMethod}</p>
                  <div className="pt-2 text-sm text-[#EDEAE4]">
                    총 결제액:{' '}
                    <strong className="font-serif text-lg text-[#EDEAE4]">
                      {foundOrder.totalPrice.toLocaleString()}원
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center bg-[#161616] border border-[#2A2A2A] p-6 space-y-3">
              <AlertCircle className="w-8 h-8 text-[#9A958D] mx-auto" />
              <h3 className="text-sm text-[#EDEAE4] font-medium">
                일치하는 주문 내역이 없습니다.
              </h3>
              <p className="text-xs text-[#9A958D]">
                입력하신 주문번호와 연락처를 다시 한 번 확인해 주십시오.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default OrdersPage;
