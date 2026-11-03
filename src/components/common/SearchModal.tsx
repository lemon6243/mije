import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { getProducts, getClasses } from '../../services/api';
import { Product, ClassItem } from '../../types';
import ProductImage from './ProductImage';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      return;
    }

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setClasses([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const [prods, cls] = await Promise.all([
        getProducts({ search: query }),
        getClasses(),
      ]);
      setProducts(prods);
      const filteredCls = cls.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase())
      );
      setClasses(filteredCls);
      setLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelectProduct = (product: Product) => {
    onClose();
    if (product.type === 'handmade') {
      navigate(`/handmade/${product.slug}`);
    } else {
      navigate(`/ready-made/${product.slug}`);
    }
  };

  const handleSelectClass = (cls: ClassItem) => {
    onClose();
    navigate(`/atelier/${cls.slug}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="통합 검색창"
    >
      <div className="w-full max-w-2xl bg-[#161616] border border-[#2A2A2A] p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2A]">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-[#9A958D]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="찾으시는 제품명, 소재, 클래스를 입력하세요"
              className="w-full bg-transparent text-[#EDEAE4] placeholder-[#9A958D] text-base focus:outline-none"
              autoFocus
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#9A958D] hover:text-[#EDEAE4] min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="검색 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-6">
          {loading && (
            <p className="text-xs text-[#9A958D] py-4 text-center">검색 중입니다...</p>
          )}

          {!loading && query && products.length === 0 && classes.length === 0 && (
            <div className="py-12 text-center text-[#9A958D] text-sm">
              &apos;{query}&apos;에 대한 검색 결과가 없습니다.
            </div>
          )}

          {products.length > 0 && (
            <div>
              <h4 className="text-xs font-serif tracking-widest text-[#9A958D] mb-3">
                PRODUCTS ({products.length})
              </h4>
              <div className="space-y-2">
                {products.slice(0, 5).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectProduct(p)}
                    className="w-full flex items-center justify-between p-2.5 hover:bg-[#2A2A2A]/40 text-left transition-colors border border-transparent hover:border-[#2A2A2A]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 flex-shrink-0 bg-[#0E0E0E] overflow-hidden">
                        <ProductImage src={p.images?.[0]} alt={p.name} />
                      </div>
                      <div>
                        <div className="text-sm text-[#EDEAE4] font-medium">{p.name}</div>
                        <div className="text-xs text-[#9A958D]">{p.material}</div>
                      </div>
                    </div>
                    <div className="text-xs font-serif text-[#C2A878]">
                      {p.price.toLocaleString()}원
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {classes.length > 0 && (
            <div>
              <h4 className="text-xs font-serif tracking-widest text-[#9A958D] mb-3">
                ATELIER CLASSES ({classes.length})
              </h4>
              <div className="space-y-2">
                {classes.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectClass(c)}
                    className="w-full flex items-center justify-between p-2.5 hover:bg-[#2A2A2A]/40 text-left transition-colors border border-transparent hover:border-[#2A2A2A]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 flex-shrink-0 bg-[#0E0E0E] overflow-hidden">
                        <ProductImage src={c.images?.[0]} alt={c.name} />
                      </div>
                      <div>
                        <div className="text-sm text-[#EDEAE4] font-medium">{c.name}</div>
                        <div className="text-xs text-[#9A958D]">{c.durationMin}분 소요</div>
                      </div>
                    </div>
                    <div className="text-xs font-serif text-[#C2A878]">
                      {c.price.toLocaleString()}원
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!query && (
            <div className="py-6 text-xs text-[#9A958D] space-y-2">
              <p className="text-[#EDEAE4]">추천 검색어</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {['정은 925', '단조 링', '목걸이', '커플링 클래스', '인장 반지', '오벌 체인'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 bg-[#0E0E0E] border border-[#2A2A2A] text-xs hover:border-[#C2A878] text-[#EDEAE4]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SearchModal;
