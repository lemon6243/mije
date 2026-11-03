import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import SectionTitle from '../components/common/SectionTitle';
import { usePageMeta } from '../hooks/usePageMeta';

export const CartPage: React.FC = () => {
  usePageMeta('장바구니', '선택하신 주얼리를 확인하고 주문을 진행합니다.');

  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  const shippingFee = totalPrice >= 70000 || totalPrice === 0 ? 0 : 3500;
  const finalTotal = totalPrice + shippingFee;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-24 pb-36 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full border border-[#2A2A2A] flex items-center justify-center text-[#9A958D]">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-serif text-[#EDEAE4]">장바구니가 비어 있습니다.</h2>
          <p className="text-xs text-[#9A958D]">
            정은 925의 담백한 기성품과 수공예 핸드메이드 작품을 만나보세요.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-4">
          <Link
            to="/ready-made"
            className="px-6 py-3 bg-[#EDEAE4] text-[#0E0E0E] text-xs uppercase tracking-widest font-medium hover:bg-white min-h-[44px] flex items-center"
          >
            기성품 둘러보기
          </Link>
          <Link
            to="/handmade"
            className="px-6 py-3 border border-[#2A2A2A] hover:border-[#C2A878] text-xs uppercase tracking-widest text-[#EDEAE4] min-h-[44px] flex items-center"
          >
            핸드메이드 둘러보기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 pb-28">
      <SectionTitle en="SHOPPING BAG" ko="장바구니" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cart Item List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="hidden sm:grid grid-cols-12 text-xs text-[#9A958D] border-b border-[#2A2A2A] pb-3">
            <span className="col-span-6">상품 정보</span>
            <span className="col-span-2 text-center">수량</span>
            <span className="col-span-3 text-right">금액</span>
            <span className="col-span-1 text-right">삭제</span>
          </div>

          <div className="divide-y divide-[#2A2A2A]">
            {cart.map((item) => {
              const itemTotal = item.product.price * item.quantity;
              return (
                <div
                  key={item.id}
                  className="py-5 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-start sm:items-center"
                >
                  {/* Product Info */}
                  <div className="sm:col-span-6 flex gap-4 items-center w-full">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-20 sm:w-20 sm:aspect-[4/5] object-cover bg-[#161616] border border-[#2A2A2A] flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#C2A878] font-serif uppercase tracking-wider block">
                        {item.product.type === 'handmade' ? 'HANDMADE' : 'READY-MADE'}
                      </span>
                      <Link
                        to={item.product.type === 'handmade' ? `/handmade/${item.product.slug}` : `/ready-made/${item.product.slug}`}
                        className="text-sm font-medium text-[#EDEAE4] hover:text-[#C2A878] transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <div className="text-xs text-[#9A958D]">
                        옵션: {item.option.label}
                      </div>
                      <div className="text-xs font-serif text-[#EDEAE4] sm:hidden">
                        {item.product.price.toLocaleString()}원
                      </div>
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="sm:col-span-2 flex items-center justify-between sm:justify-center w-full sm:w-auto">
                    <span className="text-xs text-[#9A958D] sm:hidden">수량:</span>
                    <div className="flex items-center border border-[#2A2A2A] bg-[#161616]">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2.5 py-1 text-xs text-[#EDEAE4] hover:text-[#C2A878] min-w-[32px] min-h-[32px] flex items-center justify-center"
                        aria-label="수량 1 감소"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-serif text-[#EDEAE4]">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2.5 py-1 text-xs text-[#EDEAE4] hover:text-[#C2A878] min-w-[32px] min-h-[32px] flex items-center justify-center"
                        aria-label="수량 1 증가"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="sm:col-span-3 text-right text-sm font-serif text-[#EDEAE4] hidden sm:block">
                    {itemTotal.toLocaleString()}원
                  </div>

                  {/* Remove */}
                  <div className="sm:col-span-1 text-right w-full sm:w-auto flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-[#9A958D] hover:text-[#C46A5E] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                      aria-label={`${item.product.name} 삭제`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-[#161616] border border-[#2A2A2A] p-6 space-y-6">
            <h3 className="text-sm font-medium text-[#EDEAE4] tracking-wide border-b border-[#2A2A2A] pb-3">
              주문 요약
            </h3>

            <div className="space-y-3 text-xs text-[#9A958D]">
              <div className="flex justify-between">
                <span>총 상품금액</span>
                <span className="font-serif text-[#EDEAE4]">{totalPrice.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span>배송비</span>
                <span className="font-serif text-[#EDEAE4]">
                  {shippingFee === 0 ? '무료 (70,000원 이상)' : `${shippingFee.toLocaleString()}원`}
                </span>
              </div>
              <div className="pt-3 border-t border-[#2A2A2A] flex justify-between text-sm">
                <span className="text-[#EDEAE4] font-medium">최종 결제 예정 금액</span>
                <span className="font-serif text-lg text-[#EDEAE4] font-medium">
                  {finalTotal.toLocaleString()}원
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-[#EDEAE4] text-[#0E0E0E] text-xs uppercase tracking-widest font-medium hover:bg-white hover:ring-1 hover:ring-[#C2A878] transition-all min-h-[44px] flex items-center justify-center gap-2"
            >
              <span>주문서 작성하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-[#9A958D] leading-relaxed pt-2 space-y-1">
              <p>• 정은 925 전용 패키지와 은 세척천이 기본 동봉됩니다.</p>
              <p>• 시연용으로 실제 카드 결제는 발생하지 않습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartPage;
