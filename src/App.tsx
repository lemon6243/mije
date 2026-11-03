import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import HomePage from './pages/HomePage';
import ReadyMadePage from './pages/ReadyMadePage';
import HandmadePage from './pages/HandmadePage';
import ProductDetailPage from './pages/ProductDetailPage';
import AtelierPage from './pages/AtelierPage';
import ClassDetailPage from './pages/ClassDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import JournalPage from './pages/JournalPage';
import JournalDetailPage from './pages/JournalDetailPage';
import CommunityPage from './pages/CommunityPage';
import AboutPage from './pages/AboutPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

/**
 * ScrollToTop helper on route change
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/**
 * 404 Not Found Page
 */
function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-32 text-center space-y-4">
      <span className="font-serif-luxury text-4xl text-[#C2A878]">404</span>
      <h1 className="text-xl text-[#EDEAE4] font-medium">요청하신 페이지를 찾을 수 없습니다.</h1>
      <p className="text-xs text-[#9A958D]">
        주소가 변경되었거나 삭제된 페이지입니다. 홈으로 이동해 주세요.
      </p>
      <div className="pt-4">
        <a
          href="/"
          className="px-6 py-2.5 bg-[#EDEAE4] text-[#0E0E0E] text-xs font-medium uppercase tracking-widest inline-block"
        >
          홈으로 이동
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#0E0E0E] text-[#EDEAE4] selection:bg-[#C2A878]/30 selection:text-[#EDEAE4]">
          <Header />
          <main className="flex-1">
            <Routes>
              {/* Home */}
              <Route path="/" element={<HomePage />} />

              {/* Ready-made catalog and detail */}
              <Route path="/ready-made" element={<ReadyMadePage />} />
              <Route path="/ready-made/:slug" element={<ProductDetailPage />} />

              {/* Handmade catalog and detail */}
              <Route path="/handmade" element={<HandmadePage />} />
              <Route path="/handmade/:slug" element={<ProductDetailPage />} />

              {/* Atelier class catalog and detail */}
              <Route path="/atelier" element={<AtelierPage />} />
              <Route path="/atelier/:slug" element={<ClassDetailPage />} />

              {/* Cart & Checkout */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />

              {/* Order Tracking */}
              <Route path="/orders" element={<OrdersPage />} />

              {/* Journal (Notices) */}
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/journal/:id" element={<JournalDetailPage />} />

              {/* Community (Reviews, Inquiries, FAQ) */}
              <Route path="/community" element={<CommunityPage />} />

              {/* About Atelier */}
              <Route path="/about" element={<AboutPage />} />

              {/* Admin Backoffice */}
              <Route path="/admin" element={<AdminDashboardPage />} />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}
