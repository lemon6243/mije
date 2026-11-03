import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Check, AlertCircle, MessageSquare, Shield, RefreshCw, Truck } from 'lucide-react';
import { getProductBySlug } from '../services/api';
import { Product, ProductOption } from '../types';
import { useCart } from '../context/CartContext';
import { usePageMeta } from '../hooks/usePageMeta';
import ProductImage from '../components/common/ProductImage';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Accordion open states
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    details: true,
    care: false,
    shipping: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    async function fetchDetail() {
      if (!slug) return;
      setLoading(true);
      try {
        const found = await getProductBySlug(slug);
        setProduct(found);
        if (found && found.options.length > 0) {
          // Select first available option by default
          const firstInStock = found.options.find((o) => o.stock > 0);
          setSelectedOptionId(firstInStock ? firstInStock.id : found.options[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [slug]);

  // Set page meta title: "상품명 | MIJE'"
  usePageMeta(product ? product.name : '상품 상세', product?.description);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-24 text-center text-xs text-[#9A958D]">
        상품 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-24 text-center space-y-4">
        <h2 className="text-lg text-[#EDEAE4]">존재하지 않거나 삭제된 상품입니다.</h2>
        <Link
          to="/ready-made"
          className="inline-block px-5 py-2.5 border border-[#2A2A2A] hover:border-[#C2A878] text-xs text-[#EDEAE4]"
        >
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const selectedOption = product.options.find((o) => o.id === selectedOptionId);
  const isOptionSoldOut = selectedOption ? selectedOption.stock <= 0 : true;

  const handleAddToCart = () => {
    if (!selectedOptionId) {
      setFeedbackMessage({ type: 'error', text: '옵션을 선택해 주십시오.' });
      return;
    }
    if (isOptionSoldOut) {
      setFeedbackMessage({ type: 'error', text: '선택하신 옵션은 품절되었습니다.' });
      return;
    }

    const res = addToCart(product, selectedOptionId, quantity);
    if (res.success) {
      setFeedbackMessage({ type: 'success', text: '장바구니에 상품을 담았습니다.' });
      setTimeout(() => setFeedbackMessage(null), 3000);
    } else {
      setFeedbackMessage({ type: 'error', text: res.message || '장바구니 담기에 실패했습니다.' });
    }
  };

  const handleBuyNow = () => {
    if (!selectedOptionId || isOptionSoldOut) {
      handleAddToCart();
      return;
    }
    const res = addToCart(product, selectedOptionId, quantity);
    if (res.success) {
      navigate('/cart');
    } else {
      setFeedbackMessage({ type: 'error', text: res.message || '오류가 발생했습니다.' });
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-24">
      {/* Breadcrumb Navigation */}
      <nav aria-label="브레드크럼" className="flex items-center gap-2 text-xs text-[#9A958D] mb-8">
        <Link to="/" className="hover:text-[#EDEAE4]">홈</Link>
        <ChevronRight className="w-3 h-3 text-[#2A2A2A]" />
        <Link
          to={product.type === 'handmade' ? '/handmade' : '/ready-made'}
          className="hover:text-[#EDEAE4]"
        >
          {product.type === 'handmade' ? '핸드메이드' : '기성품'}
        </Link>
        <ChevronRight className="w-3 h-3 text-[#2A2A2A]" />
        <span className="text-[#EDEAE4] line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Gallery (4:5 Ratio Images) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Display Image */}
          <div className="relative aspect-[4/5] bg-[#161616] border border-[#2A2A2A] overflow-hidden">
            {product.images && product.images.length > 0 && product.images[selectedImageIndex] ? (
              <img
                src={product.images[selectedImageIndex]}
                alt={`${product.name} - 뷰 ${selectedImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <ProductImage alt={product.name} />
            )}
            {product.type === 'handmade' && (
              <span className="absolute top-3 left-3 text-[11px] font-serif tracking-widest px-2.5 py-1 bg-[#0E0E0E]/90 border border-[#2A2A2A] text-[#C2A878]">
                {product.isLimited ? '1점 제작 작품' : '소량 한정 제작'}
              </span>
            )}
          </div>

          {/* Thumbnails (if multiple images) */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 aspect-[4/5] bg-[#161616] border transition-colors flex-shrink-0 focus:outline-none ${
                    selectedImageIndex === idx ? 'border-[#C2A878]' : 'border-[#2A2A2A] opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`이미지 ${idx + 1}번 보기`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Craft Process Photo Section for Handmade */}
          {product.type === 'handmade' && product.processImages && product.processImages.length > 0 && (
            <div className="pt-8 border-t border-[#2A2A2A] space-y-4">
              <h4 className="text-xs font-serif tracking-widest text-[#C2A878] uppercase">
                ATELIER CRAFT PROCESS
              </h4>
              <p className="text-xs text-[#9A958D] leading-relaxed">
                {product.craftStory || '공방 작업대에서 은판과 은선을 직접 손으로 단조하여 완성합니다.'}
              </p>
              <div className="grid grid-cols-2 gap-3 pt-1">
                {product.processImages.map((pImg, idx) => (
                  <div key={idx} className="aspect-[4/5] bg-[#161616] border border-[#2A2A2A] overflow-hidden">
                    <img src={pImg} alt="제작 과정 사진" className="w-full h-full object-cover filter contrast-105" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Info & Purchase Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header Title & Pricing */}
          <div className="space-y-2 border-b border-[#2A2A2A] pb-6">
            <div className="text-xs text-[#9A958D] tracking-wider">{product.material}</div>
            <h1 className="text-2xl sm:text-3xl text-[#EDEAE4] font-medium leading-snug">
              {product.name}
            </h1>
            <div className="text-xl font-serif tracking-wide text-[#EDEAE4] pt-2">
              {product.price.toLocaleString()}원
            </div>
            {product.type === 'handmade' && product.leadTimeDays && (
              <p className="text-xs text-[#C2A878] pt-1">
                주문 제작 상품: 결제 후 제작 기간 약 {product.leadTimeDays} 영업일 소요
              </p>
            )}
          </div>

          {/* Short Description */}
          <p className="text-sm text-[#9A958D] leading-relaxed">
            {product.description}
          </p>

          {/* Option Selection */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-medium text-[#EDEAE4]">
              옵션 선택 <span className="text-[#9A958D] font-normal">(호수 및 규격)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
              {product.options.map((opt) => {
                const isSoldOut = opt.stock <= 0;
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isSoldOut}
                    onClick={() => {
                      setSelectedOptionId(opt.id);
                      setQuantity(1);
                    }}
                    className={`p-3 text-xs text-left border transition-all min-h-[44px] flex flex-col justify-between ${
                      isSoldOut
                        ? 'border-[#2A2A2A] bg-[#161616]/40 text-[#6F6A63] cursor-not-allowed line-through'
                        : isSelected
                        ? 'border-[#C2A878] bg-[#161616] text-[#EDEAE4] ring-1 ring-[#C2A878]'
                        : 'border-[#2A2A2A] bg-[#161616] text-[#EDEAE4] hover:border-[#9A958D]'
                    }`}
                  >
                    <span className="font-medium">{opt.label}</span>
                    <span className="text-[11px] mt-1 text-[#9A958D]">
                      {isSoldOut ? '품절' : `잔여: ${opt.stock}개`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector */}
          {selectedOption && !isOptionSoldOut && (
            <div className="flex items-center justify-between py-2 border-y border-[#2A2A2A]">
              <span className="text-xs text-[#EDEAE4]">수량 선택</span>
              <div className="flex items-center border border-[#2A2A2A] bg-[#161616]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-sm text-[#EDEAE4] hover:text-[#C2A878] min-w-[36px] min-h-[36px] flex items-center justify-center"
                  aria-label="수량 감소"
                >
                  -
                </button>
                <span className="px-4 text-xs font-serif text-[#EDEAE4]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(selectedOption.stock, q + 1))}
                  className="px-3 py-1.5 text-sm text-[#EDEAE4] hover:text-[#C2A878] min-w-[36px] min-h-[36px] flex items-center justify-center"
                  aria-label="수량 증가"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Total Price preview */}
          <div className="flex items-baseline justify-between pt-2">
            <span className="text-xs text-[#9A958D]">총 결제 예정 금액</span>
            <span className="text-xl font-serif text-[#EDEAE4]">
              {isOptionSoldOut ? '-' : `${(product.price * quantity).toLocaleString()}원`}
            </span>
          </div>

          {/* Feedback Banner */}
          {feedbackMessage && (
            <div
              className={`p-3 text-xs border flex items-center gap-2 ${
                feedbackMessage.type === 'success'
                  ? 'bg-[#161616] border-[#C2A878] text-[#EDEAE4]'
                  : 'bg-[#161616] border-[#C46A5E] text-[#C46A5E]'
              }`}
            >
              {feedbackMessage.type === 'success' ? (
                <Check className="w-4 h-4 text-[#C2A878]" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#C46A5E]" />
              )}
              <span>{feedbackMessage.text}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              disabled={isOptionSoldOut}
              onClick={handleAddToCart}
              className={`w-full py-4 text-xs uppercase tracking-widest font-medium transition-all min-h-[44px] flex items-center justify-center border ${
                isOptionSoldOut
                  ? 'bg-[#161616] border-[#2A2A2A] text-[#6F6A63] cursor-not-allowed'
                  : 'bg-[#EDEAE4] text-[#0E0E0E] border-[#EDEAE4] hover:bg-white hover:border-[#C2A878] hover:ring-1 hover:ring-[#C2A878]'
              }`}
            >
              {isOptionSoldOut ? '품절된 옵션입니다' : '장바구니 담기'}
            </button>

            <button
              type="button"
              disabled={isOptionSoldOut}
              onClick={handleBuyNow}
              className={`w-full py-3.5 text-xs uppercase tracking-widest font-medium transition-all min-h-[44px] flex items-center justify-center border ${
                isOptionSoldOut
                  ? 'border-[#2A2A2A] text-[#6F6A63] cursor-not-allowed'
                  : 'border-[#2A2A2A] text-[#EDEAE4] hover:border-[#C2A878] hover:text-[#C2A878]'
              }`}
            >
              바로 주문하기
            </button>
          </div>

          {/* Handmade Custom Inquiry CTA or Product Inquiry */}
          <div className="pt-2 flex flex-col gap-2 text-xs">
            {product.type === 'handmade' ? (
              <Link
                to={`/community?tab=inquiry&relatedType=product&relatedId=${product.id}&relatedName=${encodeURIComponent(product.name)}`}
                className="w-full py-3 border border-[#2A2A2A] hover:border-[#C2A878] text-[#C2A878] flex items-center justify-center gap-2 transition-colors min-h-[44px]"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>비슷한 디자인으로 맞춤 문의하기</span>
              </Link>
            ) : (
              <Link
                to={`/community?tab=inquiry&relatedType=product&relatedId=${product.id}&relatedName=${encodeURIComponent(product.name)}`}
                className="w-full py-3 border border-[#2A2A2A] hover:border-[#EDEAE4] text-[#9A958D] hover:text-[#EDEAE4] flex items-center justify-center gap-2 transition-colors min-h-[44px]"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>해당 상품 문의 작성</span>
              </Link>
            )}
          </div>

          {/* Accordion Sections: Details, Care, Shipping */}
          <div className="pt-6 border-t border-[#2A2A2A] space-y-3">
            {/* 1. Details */}
            <div className="border border-[#2A2A2A]">
              <button
                type="button"
                onClick={() => toggleAccordion('details')}
                className="w-full p-4 flex items-center justify-between text-left text-xs font-medium text-[#EDEAE4] hover:text-[#C2A878] min-h-[44px]"
              >
                <span>소재 및 상세 규격</span>
                <span className="text-[#9A958D]">{openAccordions.details ? '—' : '+'}</span>
              </button>
              {openAccordions.details && (
                <div className="px-4 pb-4 text-xs text-[#9A958D] space-y-2 border-t border-[#2A2A2A]/40 pt-3">
                  <p>소재: {product.material}</p>
                  <p>중량: {product.weight}</p>
                  {product.details?.map((item, idx) => (
                    <p key={idx}>{item}</p>
                  ))}
                  <p className="text-[11px] text-[#EDEAE4]/60 pt-1">
                    * 수작업 공정 특성상 미세한 규격 및 중량의 편차가 있을 수 있습니다.
                  </p>
                </div>
              )}
            </div>

            {/* 2. Care Guide */}
            <div className="border border-[#2A2A2A]">
              <button
                type="button"
                onClick={() => toggleAccordion('care')}
                className="w-full p-4 flex items-center justify-between text-left text-xs font-medium text-[#EDEAE4] hover:text-[#C2A878] min-h-[44px]"
              >
                <span>관리 및 보관 요령 (Silver Care)</span>
                <span className="text-[#9A958D]">{openAccordions.care ? '—' : '+'}</span>
              </button>
              {openAccordions.care && (
                <div className="px-4 pb-4 text-xs text-[#9A958D] space-y-2 border-t border-[#2A2A2A]/40 pt-3 leading-relaxed">
                  <p>{product.careGuide || '정은 925 특성상 공기 중 산화가 발생할 수 있습니다. 밀봉 보관을 권장합니다.'}</p>
                  <p>변색 시 동봉된 실버 폴리싱 천으로 가볍게 닦아주시면 광택이 복원됩니다.</p>
                </div>
              )}
            </div>

            {/* 3. Shipping & Exchange */}
            <div className="border border-[#2A2A2A]">
              <button
                type="button"
                onClick={() => toggleAccordion('shipping')}
                className="w-full p-4 flex items-center justify-between text-left text-xs font-medium text-[#EDEAE4] hover:text-[#C2A878] min-h-[44px]"
              >
                <span>배송 및 교환 / 반품 안내</span>
                <span className="text-[#9A958D]">{openAccordions.shipping ? '—' : '+'}</span>
              </button>
              {openAccordions.shipping && (
                <div className="px-4 pb-4 text-xs text-[#9A958D] space-y-2 border-t border-[#2A2A2A]/40 pt-3 leading-relaxed">
                  <p>택배사: 우체국택배 (기본 배송비 3,500원 / 70,000원 이상 무료배송)</p>
                  <p>기성품은 결제 후 1~2영업일 이내 출고됩니다.</p>
                  <p>핸드메이드 맞춤 주문 제작 상품은 단순 변심에 의한 교환/환불이 제한될 수 있습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetailPage;
