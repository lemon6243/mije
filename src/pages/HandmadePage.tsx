import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Hammer, Sparkles } from 'lucide-react';
import { getProducts } from '../services/api';
import { Product } from '../types';
import ProductCard from '../components/common/ProductCard';
import SectionTitle from '../components/common/SectionTitle';
import { usePageMeta } from '../hooks/usePageMeta';

const CATEGORIES: { label: string; value: string }[] = [
  { label: '전체', value: 'all' },
  { label: '반지', value: 'ring' },
  { label: '목걸이', value: 'necklace' },
  { label: '팔찌', value: 'bracelet' },
  { label: '귀걸이', value: 'earring' },
  { label: '기타 오브제', value: 'etc' },
];

const SORTS: { label: string; value: string }[] = [
  { label: '신상품순', value: 'new' },
  { label: '낮은 가격순', value: 'price-asc' },
  { label: '높은 가격순', value: 'price-desc' },
];

export const HandmadePage: React.FC = () => {
  usePageMeta('핸드메이드', '작가의 손망치 단조와 왁스 카빙으로 빚어낸 1점 및 소량 제작 핸드메이드 실버 주얼리입니다.');

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('new');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const data = await getProducts({
          type: 'handmade',
          category: selectedCategory,
          sort: selectedSort,
        });
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedCategory, selectedSort]);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 pb-24">
      {/* Header */}
      <SectionTitle
        en="HANDMADE"
        ko="핸드메이드 1점 및 소량 제작"
        description="불과 망치, 그리고 작가의 호흡으로 빚어낸 세상에 단 하나뿐인 실버 오브제 컬렉션입니다."
      />

      {/* Craftsmanship Note Banner */}
      <div className="bg-[#161616] border border-[#2A2A2A] p-6 sm:p-8 mb-10 text-xs sm:text-sm text-[#9A958D] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-[#EDEAE4] font-medium">
            <Hammer className="w-4 h-4 text-[#C2A878]" />
            <span>핸드메이드 주문 제작 안내</span>
          </div>
          <p className="leading-relaxed">
            핸드메이드 작품은 대량 주조가 아닌 작가의 수작업 단조/조각 공정을 거칩니다.
            주문 접수 후 제작이 시작되며 영업일 기준 약 5~10일의 제작 소요일이 필요합니다.
          </p>
        </div>
        <Link
          to="/community?tab=inquiry"
          className="whitespace-nowrap px-4 py-2.5 border border-[#EDEAE4]/60 hover:border-[#C2A878] text-[#EDEAE4] hover:text-[#C2A878] transition-colors text-xs flex items-center gap-2 min-h-[44px]"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>맞춤 디자인 문의하기</span>
        </Link>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#2A2A2A]">
        {/* Category Filters */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-1.5 text-xs transition-colors min-h-[38px] min-w-[44px] flex items-center justify-center border ${
                selectedCategory === cat.value
                  ? 'border-[#C2A878] text-[#C2A878] bg-[#161616]'
                  : 'border-transparent text-[#9A958D] hover:text-[#EDEAE4]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center justify-end gap-3 text-xs text-[#9A958D]">
          <span>정렬:</span>
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="bg-[#161616] text-[#EDEAE4] border border-[#2A2A2A] px-3 py-1.5 text-xs focus:border-[#C2A878] focus:outline-none"
            aria-label="상품 정렬"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value} className="bg-[#161616] text-[#EDEAE4]">
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="py-24 text-center text-xs text-[#9A958D]">
          상품을 불러오는 중입니다...
        </div>
      ) : products.length === 0 ? (
        <div className="py-24 text-center space-y-3">
          <p className="text-sm text-[#9A958D]">해당 분류의 핸드메이드 작품이 준비 중입니다.</p>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className="px-4 py-2 border border-[#2A2A2A] text-xs text-[#EDEAE4] hover:border-[#C2A878]"
          >
            전체 작품 보기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
export default HandmadePage;
