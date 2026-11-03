import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, ShieldAlert } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import SearchModal from './SearchModal';

interface NavItemDef {
  en: string;
  ko: string;
  to: string;
}

const NAV_ITEMS: NavItemDef[] = [
  { en: 'READY-MADE', ko: '기성품', to: '/ready-made' },
  { en: 'HANDMADE', ko: '핸드메이드', to: '/handmade' },
  { en: 'ATELIER', ko: '은공방 클래스', to: '/atelier' },
  { en: 'JOURNAL', ko: '공지', to: '/journal' },
  { en: 'COMMUNITY', ko: '후기·문의', to: '/community' },
  { en: 'ABOUT', ko: '공방 이야기', to: '/about' },
];

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalCount, setIsCartDrawerOpen } = useCart();
  const location = useLocation();

  // Scroll detection for sticky divider & background styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-colors duration-300 ${
          isScrolled
            ? 'bg-[#0E0E0E]/95 backdrop-blur-sm border-b border-[#2A2A2A]'
            : 'bg-[#0E0E0E] border-b border-[#2A2A2A]/50'
        }`}
      >
        {/* Top utility notification bar (discreet) */}
        <div className="bg-[#161616] border-b border-[#2A2A2A]/40 text-[#9A958D] text-xs px-4 py-1.5 flex items-center justify-between">
          <div className="container mx-auto flex items-center justify-between text-[11px] sm:text-xs">
            <span>정은 925 은공방 아틀리에 &amp; 핸드메이드 주얼리</span>
            <div className="flex items-center gap-3">
              <Link
                to="/orders"
                className="hover:text-[#EDEAE4] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C2A878]"
              >
                주문조회
              </Link>
              <span className="text-[#2A2A2A]">|</span>
              <Link
                to="/admin"
                className="flex items-center gap-1 text-[#C2A878] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C2A878]"
                title="시연용 관리자 화면"
              >
                <ShieldAlert className="w-3 h-3" />
                <span>관리자(시연)</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Mobile Hamburger (left on mobile) */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 text-[#EDEAE4] hover:text-[#C2A878] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C2A878] min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Left Desktop Nav (First 3 items) */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-medium tracking-widest" aria-label="메인 탐색 1">
            {NAV_ITEMS.slice(0, 3).map((item) => {
              const isActive = location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-label={item.ko}
                  className={`nav-flip-link relative py-2 px-1 text-xs transition-colors min-h-[44px] flex items-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C2A878] ${
                    isActive ? 'text-[#C2A878] font-semibold' : 'text-[#EDEAE4] hover:text-[#C2A878]'
                  }`}
                >
                  <div className="nav-flip-container">
                    <span className="nav-flip-en font-serif tracking-[0.14em]" aria-hidden="true">
                      {item.en}
                    </span>
                    <span className="nav-flip-ko text-xs" aria-hidden="true">
                      {item.ko}
                    </span>
                  </div>
                  {isActive && (
                    <span className="absolute bottom-1 left-0 right-0 h-[1px] bg-[#C2A878]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Centered Brand Logo */}
          <div className="text-center">
            <Link
              to="/"
              className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl tracking-[0.22em] text-[#EDEAE4] hover:text-[#C2A878] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C2A878] px-2 py-1"
              aria-label="MIJE' 홈으로 이동"
            >
              MIJE&apos;
            </Link>
          </div>

          {/* Right Desktop Nav (Remaining 3 items) + Actions */}
          <div className="flex items-center gap-6 sm:gap-8">
            <nav className="hidden lg:flex items-center gap-8 text-xs font-medium tracking-widest" aria-label="메인 탐색 2">
              {NAV_ITEMS.slice(3).map((item) => {
                const isActive = location.pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    aria-label={item.ko}
                    className={`nav-flip-link relative py-2 px-1 text-xs transition-colors min-h-[44px] flex items-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C2A878] ${
                      isActive ? 'text-[#C2A878] font-semibold' : 'text-[#EDEAE4] hover:text-[#C2A878]'
                    }`}
                  >
                    <div className="nav-flip-container">
                      <span className="nav-flip-en font-serif tracking-[0.14em]" aria-hidden="true">
                        {item.en}
                      </span>
                      <span className="nav-flip-ko text-xs" aria-hidden="true">
                        {item.ko}
                      </span>
                    </div>
                    {isActive && (
                      <span className="absolute bottom-1 left-0 right-0 h-[1px] bg-[#C2A878]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Actions (Search, Cart) */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#EDEAE4] hover:text-[#C2A878] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C2A878] min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="상품 및 클래스 검색"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                to="/cart"
                onClick={(e) => {
                  // On desktop, can navigate to /cart directly or trigger drawer
                }}
                className="relative p-2 text-[#EDEAE4] hover:text-[#C2A878] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C2A878] min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={`장바구니 (${totalCount}개 담김)`}
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C2A878] text-[#0E0E0E] text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalCount > 9 ? '9+' : totalCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Slide-out Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#161616] border-b border-[#2A2A2A] px-6 py-6 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between text-sm py-2.5 text-[#EDEAE4] hover:text-[#C2A878] border-b border-[#2A2A2A]/40 min-h-[44px]"
                >
                  <span className="font-medium">{item.ko}</span>
                  <span className="text-xs text-[#9A958D] font-serif tracking-widest">{item.en}</span>
                </Link>
              ))}
              <div className="pt-2 flex items-center justify-between text-xs text-[#9A958D]">
                <Link
                  to="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 hover:text-[#EDEAE4] min-h-[44px] flex items-center"
                >
                  주문조회
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 text-[#C2A878] min-h-[44px] flex items-center gap-1"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  관리자 콘솔(시연)
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
export default Header;
