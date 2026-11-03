import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import { Product, ProductCategory } from '../types';
import ProductCard from '../components/common/ProductCard';
import SectionTitle from '../components/common/SectionTitle';
import { usePageMeta } from '../hooks/usePageMeta';

const CATEGORIES: { label: string; value: string }[] = [
  { label: '전체', value: 'all' },
  { label: '귀걸이', value: 'earring' },
  { label: '목걸이', value: 'necklace' },
  { label: '반지', value: 'ring' },
  { label: '팔찌', value: 'bracelet' },
];

const SORTS: { label: string; value: string }[] = [
  { label: '신상품순', value: 'new' },
  { label: '낮은 가격순', value: 'price-asc' },
  { label: '높은 가격순', value: 'price-desc' },
];

export const ReadyMadePage: React.FC = () => {
  usePageMeta('기성품', '정은 925로 정제된 실루엣과 편안한 착용감을 전하는 MIJE\' 기성품 컬렉션입니다.');

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('new');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const data = await getProducts({
          type: 'ready-made',
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
        en="READY-MADE"
        ko="기성품 컬렉션"
        description="일상의 모든 순간에 자연스럽게 깃드는 실버 에센셜 라인업입니다."
      />

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#2A2A2A]">
        {/* Category Filters (Wearing area) */}
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
          <p className="text-sm text-[#9A958D]">해당 분류의 상품이 준비 중입니다.</p>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className="px-4 py-2 border border-[#2A2A2A] text-xs text-[#EDEAE4] hover:border-[#C2A878]"
          >
            전체 상품 보기
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
export default ReadyMadePage;
