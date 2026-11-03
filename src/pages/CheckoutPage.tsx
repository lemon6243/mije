import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, AlertCircle, ShieldAlert, ArrowLeft, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import { Order } from '../types';
import SectionTitle from '../components/common/SectionTitle';
import { usePageMeta } from '../hooks/usePageMeta';

export const CheckoutPage: React.FC = () => {
  usePageMeta('주문서', '주문 정보를 입력하고 결제를 완료합니다.');

  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const shippingFee = totalPrice >= 70000 || totalPrice === 0 ? 0 : 3500;
  const finalTotal = totalPrice + shippingFee;

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [postalCode, setPostalCode] = useState('04415');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [shippingNote, setShippingNote] = useState('부재 시 문 앞에 놓아주세요.');
  const [paymentMethod, setPaymentMethod] = useState('신용/체크카드');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (cart.length === 0) {
      setErrorMessage('장바구니에 담긴 상품이 없습니다.');
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage('수령인 성함을 입력해 주십시오.');
      return;
    }

    if (!phone.trim() || phone.length < 9) {
      setErrorMessage('연락처를 정확히 입력해 주십시오.');
      return;
    }

    if (!address.trim()) {
      setErrorMessage('배송지 주소를 입력해 주십시오.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = cart.map((c) => ({
        productId: c.productId,
        productName: c.product.name,
        productSlug: c.product.slug,
        productType: c.product.type,
        optionId: c.optionId,
        optionLabel: c.option.label,
        price: c.product.price,
        quantity: c.quantity,
        image: c.product.images[0],
      }));

      const res = await createOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        detailAddress: detailAddress.trim(),
        postalCode: postalCode.trim(),
        shippingNote: shippingNote.trim(),
        paymentMethod,
        items: orderItems,
        totalPrice: finalTotal,
      });

      if (res.success && res.order) {
        setCompletedOrder(res.order);
        clearCart();
      } else {
        setErrorMessage(res.message || '주문 생성 중 오류가 발생했습니다.');
      }
    } catch {
      setErrorMessage('주문 처리 중 예기치 않은 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 pb-32 max-w-2xl text-center space-y-8 animate-fadeIn">
        <div className="w-16 h-16 mx-auto rounded-full border border-[#C2A878] flex items-center justify-center text-[#C2A878]">
          <Check className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-serif tracking-[0.2em] text-[#C2A878] block">
            ORDER COMPLETED
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#EDEAE4]">
            주문이 정상적으로 접수되었습니다.
          </h1>
          <p className="text-xs text-[#9A958D]">
            정성을 다해 검품 및 패키징 후 안전하게 발송해 드리겠습니다.
          </p>
        </div>

        <div className="bg-[#161616] border border-[#2A2A2A] p-6 text-left text-xs space-y-4">
          <div className="flex justify-between border-b border-[#2A2A2A] pb-3">
            <span className="text-[#9A958D]">주문 번호</span>
            <span className="font-serif text-[#C2A878] font-bold text-sm">
              {completedOrder.orderNo}
            </span>
          </div>

          <div className="space-y-2 text-[#9A958D]">
            <div className="flex justify-between">
              <span>받는 분</span>
              <span className="text-[#EDEAE4]">{completedOrder.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>연락처</span>
              <span className="text-[#EDEAE4]">{completedOrder.phone}</span>
            </div>
            <div className="flex justify-between">
              <span>배송지</span>
              <span className="text-[#EDEAE4] text-right max-w-xs">
                {completedOrder.address} {completedOrder.detailAddress}
              </span>
            </div>
            <div className="flex justify-between">
              <span>결제 수단</span>
              <span className="text-[#EDEAE4]">{completedOrder.paymentMethod}</span>
            </div>
          </div>

          <div className="border-t border-[#2A2A2A] pt-3 space-y-2">
            <span className="text-[#EDEAE4] font-medium block">주문 상품 목록</span>
            {completedOrder.items.map((it, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="text-[#9A958D] line-clamp-1">
                  {it.productName} ({it.optionLabel}) x {it.quantity}개
                </span>
                <span className="font-serif text-[#EDEAE4]">
                  {(it.price * it.quantity).toLocaleString()}원
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#2A2A2A] pt-3 flex justify-between text-sm">
            <span className="text-[#EDEAE4] font-medium">총 결제 금액</span>
            <span className="font-serif text-[#EDEAE4] font-bold">
              {completedOrder.totalPrice.toLocaleString()}원
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={`/orders?orderNo=${completedOrder.orderNo}&phone=${completedOrder.phone}`}
            className="px-6 py-3.5 bg-[#EDEAE4] text-[#0E0E0E] text-xs uppercase tracking-widest font-medium hover:bg-white min-h-[44px] flex items-center justify-center"
          >
            주문 배송 조회로 확인하기
          </Link>
          <Link
            to="/"
            className="px-6 py-3.5 border border-[#2A2A2A] hover:border-[#C2A878] text-[#EDEAE4] text-xs uppercase tracking-widest min-h-[44px] flex items-center justify-center"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center space-y-4">
        <p className="text-sm text-[#9A958D]">장바구니에 상품이 없습니다.</p>
        <Link to="/ready-made" className="px-5 py-2.5 border border-[#2A2A2A] text-xs text-[#EDEAE4]">
          상품 둘러보기
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 pb-28 max-w-4xl">
      <SectionTitle en="CHECKOUT" ko="주문서 작성" />

      {/* Demo Notice Banner */}
      <div className="bg-[#161616] border border-[#C2A878]/60 p-3.5 sm:p-4 mb-8 text-xs text-[#C2A878] flex items-center gap-2.5">
        <ShieldAlert className="w-4 h-4 flex-shrink-0" />
        <span>시연용 화면입니다. 실제 결제는 이루어지지 않습니다.</span>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Left Form: Delivery details & Payment Method */}
        <div className="md:col-span-7 space-y-8">
          {/* 1. Recipient Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#EDEAE4] border-b border-[#2A2A2A] pb-2">
              배송지 정보
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-[#EDEAE4] mb-1">
                  수령인 성함 <span className="text-[#C2A878]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full bg-[#161616] border border-[#2A2A2A] px-3.5 py-2.5 text-xs text-[#EDEAE4] placeholder-[#9A958D] focus:border-[#C2A878] focus:outline-none min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#EDEAE4] mb-1">
                  휴대전화 번호 <span className="text-[#C2A878]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010-1234-5678"
                  className="w-full bg-[#161616] border border-[#2A2A2A] px-3.5 py-2.5 text-xs text-[#EDEAE4] placeholder-[#9A958D] focus:border-[#C2A878] focus:outline-none min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-xs text-[#EDEAE4] mb-1">우편번호</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-[#161616] border border-[#2A2A2A] px-3.5 py-2.5 text-xs text-[#EDEAE4] focus:border-[#C2A878] focus:outline-none min-h-[44px]"
                  />
                </div>
                <div className="col-span-2 flex items-end">
                  <button
                    type="button"
                    onClick={() => {
                      setPostalCode('04415');
                      setAddress('서울특별시 용산구 한남대로 42길');
                    }}
                    className="w-full py-2.5 px-3 border border-[#2A2A2A] hover:border-[#9A958D] text-xs text-[#9A958D] hover:text-[#EDEAE4] min-h-[44px]"
                  >
                    샘플 주소 자동 입력
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#EDEAE4] mb-1">
                  기본 주소 <span className="text-[#C2A878]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="기본 주소를 입력하세요"
                  className="w-full bg-[#161616] border border-[#2A2A2A] px-3.5 py-2.5 text-xs text-[#EDEAE4] placeholder-[#9A958D] focus:border-[#C2A878] focus:outline-none min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#EDEAE4] mb-1">상세 주소</label>
                <input
                  type="text"
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                  placeholder="동·호수 등 상세 주소"
                  className="w-full bg-[#161616] border border-[#2A2A2A] px-3.5 py-2.5 text-xs text-[#EDEAE4] placeholder-[#9A958D] focus:border-[#C2A878] focus:outline-none min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#EDEAE4] mb-1">배송 메모</label>
                <input
                  type="text"
                  value={shippingNote}
                  onChange={(e) => setShippingNote(e.target.value)}
                  placeholder="배송 기사님께 전달할 메시지"
                  className="w-full bg-[#161616] border border-[#2A2A2A] px-3.5 py-2.5 text-xs text-[#EDEAE4] placeholder-[#9A958D] focus:border-[#C2A878] focus:outline-none min-h-[44px]"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method (Display Only) */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-[#EDEAE4] border-b border-[#2A2A2A] pb-2">
              결제 수단 선택 <span className="text-xs text-[#9A958D] font-normal">(화면 표시용)</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {['신용/체크카드', '카카오페이', '네이버페이', '무통장 입금'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`p-3 text-xs border text-left flex items-center justify-between min-h-[44px] transition-colors ${
                    paymentMethod === method
                      ? 'border-[#C2A878] bg-[#161616] text-[#EDEAE4] ring-1 ring-[#C2A878]'
                      : 'border-[#2A2A2A] bg-[#161616] text-[#9A958D] hover:text-[#EDEAE4]'
                  }`}
                >
                  <span>{method}</span>
                  {paymentMethod === method && <Check className="w-3.5 h-3.5 text-[#C2A878]" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Summary Sidebar */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-[#161616] border border-[#2A2A2A] p-6 space-y-6">
            <h3 className="text-sm font-medium text-[#EDEAE4] border-b border-[#2A2A2A] pb-3">
              결제 금액 확인
            </h3>

            {/* Order Items Preview */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.product.images[0]}
                      alt=""
                      className="w-10 h-12 object-cover bg-[#0E0E0E]"
                    />
                    <div>
                      <div className="text-[#EDEAE4] font-medium line-clamp-1">{item.product.name}</div>
                      <div className="text-[11px] text-[#9A958D]">
                        {item.option.label} · {item.quantity}개
                      </div>
                    </div>
                  </div>
                  <div className="font-serif text-[#EDEAE4] whitespace-nowrap">
                    {(item.product.price * item.quantity).toLocaleString()}원
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#2A2A2A] pt-4 space-y-2 text-xs text-[#9A958D]">
              <div className="flex justify-between">
                <span>상품 합계</span>
                <span className="font-serif text-[#EDEAE4]">{totalPrice.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span>배송비</span>
                <span className="font-serif text-[#EDEAE4]">
                  {shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()}원`}
                </span>
              </div>
              <div className="border-t border-[#2A2A2A] pt-3 flex justify-between text-sm">
                <span className="text-[#EDEAE4] font-medium">최종 결제 금액</span>
                <span className="font-serif text-lg text-[#EDEAE4] font-bold">
                  {finalTotal.toLocaleString()}원
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-[#0E0E0E] border border-[#C46A5E] text-[#C46A5E] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#EDEAE4] text-[#0E0E0E] text-xs uppercase tracking-widest font-medium hover:bg-white hover:ring-1 hover:ring-[#C2A878] transition-all min-h-[44px] flex items-center justify-center font-bold"
            >
              {isSubmitting ? '주문 생성 및 재고 처리 중...' : `${finalTotal.toLocaleString()}원 결제하기`}
            </button>

            <p className="text-[11px] text-[#9A958D] text-center leading-relaxed">
              시연 중 주문 접수 시 재고가 즉시 차감되며,<br />
              발급된 주문번호로 언제든 주문조회가 가능합니다.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
export default CheckoutPage;
