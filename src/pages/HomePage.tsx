import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Hammer, Clock } from 'lucide-react';
import { getProducts, getClasses } from '../services/api';
import { Product, ClassItem } from '../types';
import ProductCard from '../components/common/ProductCard';
import SectionTitle from '../components/common/SectionTitle';
import { usePageMeta } from '../hooks/usePageMeta';
import { CATEGORY_CARD_CONFIG } from '../data/categoryConfig';

export const HomePage: React.FC = () => {
  usePageMeta('홈', '직접 설계하고 만드는 은 악세사리와 은공방 클래스');

  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [allProds, allCls] = await Promise.all([
          getProducts(),
          getClasses(),
        ]);
        setNewArrivals(allProds.slice(0, 8));
        setClasses(allCls);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* 1. Brand Hero Section */}
      <section className="relative w-full h-[100svh] min-h-[560px] overflow-hidden bg-[#0E0E0E]">
        {/* Background Picture with Responsive Sources */}
        <picture className="absolute inset-0 w-full h-full">
          <source
            media="(min-width: 768px)"
            srcSet="/images/mije-hero-desktop.png"
            width="1920"
            height="1080"
          />
          <img
            src="/images/mije-hero-mobile.png"
            alt="블랙 슬레이트 위에 놓인 은 목걸이와 반지"
            loading="eager"
            fetchPriority="high"
            width="1080"
            height="1350"
            className="w-full h-full object-cover object-[center_70%] md:object-[70%_60%]"
          />
        </picture>

        {/* Visually Hidden H1 for Accessibility & SEO */}
        <h1 className="sr-only">MIJE&apos; 핸드메이드 은 악세사리와 은공방 클래스</h1>

        {/* Brand Script Logo, Copy, and Border Action Buttons */}
        <div
          className="absolute z-10 hero-entrance flex flex-col
            top-[14%] left-1/2 -translate-x-1/2 w-[70vw] items-center text-center
            md:top-[28%] md:left-[8%] md:translate-x-0 md:w-[clamp(280px,38vw,640px)] md:items-start md:text-left"
        >
          {/* Script Gold Logo on Black with screen blend */}
          <img
            src="/images/mije-logo.png"
            alt="MIJE'"
            className="w-full h-auto object-contain mix-blend-screen -ml-1 sm:-ml-2 pointer-events-none select-none"
          />

          {/* Subtitle Copy */}
          <p className="text-xs sm:text-sm text-[#9A958D] tracking-[0.16em] mt-3 font-light">
            직접 설계하고 만드는 은 악세사리
          </p>

          {/* Outline Buttons (No filled background) */}
          <div className="mt-6 flex flex-row items-center gap-3 w-full sm:w-auto justify-center md:justify-start">
            <Link
              to="/handmade"
              className="px-5 sm:px-6 py-2.5 sm:py-3 border border-[#EDEAE4]/70 hover:border-[#C2A878] hover:text-[#C2A878] text-[#EDEAE4] text-xs tracking-widest uppercase transition-colors min-h-[44px] flex items-center justify-center whitespace-nowrap"
            >
              컬렉션 보기
            </Link>
            <Link
              to="/atelier"
              className="px-5 sm:px-6 py-2.5 sm:py-3 border border-[#EDEAE4]/70 hover:border-[#C2A878] hover:text-[#C2A878] text-[#EDEAE4] text-xs tracking-widest uppercase transition-colors min-h-[44px] flex items-center justify-center whitespace-nowrap"
            >
              클래스 예약
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Three Large Category Cards */}
      <section className="container mx-auto px-4 sm:px-6">
        <SectionTitle
          en="CATEGORIES"
          ko="세 가지 여정"
          description="일상의 단정한 기성품부터 작가의 1점 수공예작품, 직접 은을 다듬는 클래스까지"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Ready-Made */}
          <Link
            to="/ready-made"
            className="group relative aspect-[4/5] bg-[#161616] border border-[#2A2A2A] overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C2A878]"
          >
            <img
              src={CATEGORY_CARD_CONFIG.readyMade.image}
              alt={CATEGORY_CARD_CONFIG.readyMade.alt}
              style={{ objectPosition: CATEGORY_CARD_CONFIG.readyMade.objectPosition }}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-2">
              <span className="text-[11px] font-serif tracking-[0.2em] text-[#C2A878] uppercase">
                ESSENTIAL
              </span>
              <h3 className="text-xl sm:text-2xl font-serif text-[#EDEAE4] tracking-wide">
                READY-MADE
              </h3>
              <p className="text-xs text-[#9A958D] leading-relaxed">
                매일 손이 가는 단정하고 정제된 실버 주얼리
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-[#EDEAE4] group-hover:text-[#C2A878] transition-colors">
                <span>기성품 컬렉션 보기</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Card 2: Handmade */}
          <Link
            to="/handmade"
            className="group relative aspect-[4/5] bg-[#161616] border border-[#2A2A2A] overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C2A878]"
          >
            <img
              src={CATEGORY_CARD_CONFIG.handmade.image}
              alt={CATEGORY_CARD_CONFIG.handmade.alt}
              style={{ objectPosition: CATEGORY_CARD_CONFIG.handmade.objectPosition }}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-2">
              <span className="text-[11px] font-serif tracking-[0.2em] text-[#C2A878] uppercase">
                ONE OF A KIND
              </span>
              <h3 className="text-xl sm:text-2xl font-serif text-[#EDEAE4] tracking-wide">
                HANDMADE
              </h3>
              <p className="text-xs text-[#9A958D] leading-relaxed">
                단조와 불작업으로 빚은 1점 및 소량 제작 오브제
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-[#EDEAE4] group-hover:text-[#C2A878] transition-colors">
                <span>수공예 작품 보기</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Card 3: Atelier Class */}
          <Link
            to="/atelier"
            className="group relative aspect-[4/5] bg-[#161616] border border-[#2A2A2A] overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C2A878]"
          >
            <img
              src={CATEGORY_CARD_CONFIG.atelier.image}
              alt={CATEGORY_CARD_CONFIG.atelier.alt}
              style={{ objectPosition: CATEGORY_CARD_CONFIG.atelier.objectPosition }}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-2">
              <span className="text-[11px] font-serif tracking-[0.2em] text-[#C2A878] uppercase">
                EXPERIENCE
              </span>
              <h3 className="text-xl sm:text-2xl font-serif text-[#EDEAE4] tracking-wide">
                ATELIER CLASS
              </h3>
              <p className="text-xs text-[#9A958D] leading-relaxed">
                작가의 작업대에서 직접 은을 만지고 완성하는 체험
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-[#EDEAE4] group-hover:text-[#C2A878] transition-colors">
                <span>클래스 일정 조회 및 예약</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. New Arrivals (8 Products) */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 sm:mb-12 border-b border-[#2A2A2A] pb-4">
          <div>
            <span className="font-serif-luxury text-2xl sm:text-3xl tracking-[0.16em] uppercase text-[#EDEAE4] block">
              NEW ARRIVALS
            </span>
            <span className="text-xs text-[#C2A878] tracking-widest mt-0.5 block font-medium">
              신상품 컬렉션
            </span>
          </div>
          <Link
            to="/ready-made"
            className="text-xs text-[#9A958D] hover:text-[#EDEAE4] flex items-center gap-1.5 transition-colors mt-2 sm:mt-0 min-h-[44px]"
          >
            전체 상품 보기
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-[#9A958D]">상품을 불러오는 중입니다...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Atelier Highlight Block */}
      <section className="bg-[#161616] border-y border-[#2A2A2A] py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Pair using actual brand photography */}
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[4/5] bg-[#0E0E0E] overflow-hidden border border-[#2A2A2A]">
                <img
                  src="/images/mije-hero-mobile.png"
                  alt="MIJE' 은공방 실버 주얼리"
                  className="w-full h-full object-cover object-[center_35%]"
                />
              </div>
              <div className="aspect-[4/5] bg-[#0E0E0E] overflow-hidden border border-[#2A2A2A] mt-8">
                <img
                  src="/images/mije-hero-mobile.png"
                  alt="MIJE' 핸드메이드 반지와 목걸이"
                  className="w-full h-full object-cover object-[center_75%]"
                />
              </div>
            </div>

            {/* Text & Feature Points */}
            <div className="space-y-6 text-left">
              <span className="text-xs uppercase font-serif tracking-[0.2em] text-[#C2A878]">
                MIJE&apos; ATELIER EXPERIENCE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#EDEAE4] leading-snug">
                순수한 은을 불에 달구고,<br />
                망치로 두드려 완성하는 시간
              </h2>
              <p className="text-sm text-[#9A958D] leading-relaxed">
                은공방 MIJE&apos;는 금속이 주는 차가운 매력과 두드림이 만드는 따뜻한 온도를 함께 나눕니다.
                단 한 번도 금속공예를 접해보지 않으신 분들도 작가의 1:1 세심한 지도 아래
                자신만의 손길이 깃든 반지를 완성하실 수 있습니다.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[#0E0E0E] border border-[#2A2A2A] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#EDEAE4]">
                    <Hammer className="w-4 h-4 text-[#C2A878]" />
                    <span>최대 4인 소수 정원</span>
                  </div>
                  <p className="text-xs text-[#9A958D]">
                    몰입도 높은 1:1 세심한 공정 가이드
                  </p>
                </div>
                <div className="p-4 bg-[#0E0E0E] border border-[#2A2A2A] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#EDEAE4]">
                    <Sparkles className="w-4 h-4 text-[#C2A878]" />
                    <span>Silver 925 정은 제공</span>
                  </div>
                  <p className="text-xs text-[#9A958D]">
                    당일 완성하여 바로 착용 및 수령
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/atelier"
                  className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#EDEAE4] text-xs uppercase tracking-widest text-[#EDEAE4] hover:border-[#C2A878] hover:text-[#C2A878] transition-colors min-h-[44px]"
                >
                  <span>클래스 상세 커리큘럼 및 예약</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Workshop Story Block */}
      <section className="container mx-auto px-4 sm:px-6 text-center max-w-2xl space-y-6">
        <span className="text-xs uppercase font-serif tracking-[0.25em] text-[#C2A878]">
          OUR PHILOSOPHY
        </span>
        <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#EDEAE4] leading-relaxed">
          &ldquo;매끄럽게 가공된 완벽함보다,<br />
          손길과 시간이 새겨진 자연스러움을 믿습니다.&rdquo;
        </h3>
        <p className="text-xs sm:text-sm text-[#9A958D] leading-relaxed">
          MIJE&apos;의 모든 장신구는 유행에 휘둘리지 않고 착용하는 사람과 함께 나이 들어갈 수 있도록
          견고한 정은 원자재와 전통 단조 기법으로 작업됩니다.
        </p>
        <div className="pt-2">
          <Link
            to="/about"
            className="text-xs text-[#EDEAE4] underline underline-offset-4 hover:text-[#C2A878] transition-colors"
          >
            공방 이야기 더 읽기
          </Link>
        </div>
      </section>
    </div>
  );
};
export default HomePage;
