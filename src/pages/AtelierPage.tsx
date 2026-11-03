import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { getClasses } from '../services/api';
import { ClassItem } from '../types';
import SectionTitle from '../components/common/SectionTitle';
import ProductImage from '../components/common/ProductImage';
import { usePageMeta } from '../hooks/usePageMeta';

export const AtelierPage: React.FC = () => {
  usePageMeta('은공방 클래스', '작가의 작업대에서 직접 은을 톱질하고 두드려 나만의 주얼리를 완성하는 MIJE\' 은공방 클래스입니다.');

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getClasses();
        setClasses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 pb-24">
      {/* Header */}
      <SectionTitle
        en="ATELIER CLASS"
        ko="은공방 체험 클래스"
        description="차가운 금속에 손길의 온도를 불어넣는 시간. 기초 톱질부터 땜질, 타흔 텍스처까지 직접 경험합니다."
      />

      {/* Intro Feature Notice */}
      <div className="bg-[#161616] border border-[#2A2A2A] p-6 sm:p-8 mb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#9A958D]">
          <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-[#2A2A2A] pb-4 md:pb-0 md:pr-4">
            <div className="flex items-center gap-2 text-[#EDEAE4] font-medium text-sm">
              <Users className="w-4 h-4 text-[#C2A878]" />
              <span>최대 4인 소수 정예</span>
            </div>
            <p className="leading-relaxed">
              모든 회차는 최대 4인으로 제한하여 작가의 1:1 밀착 지도와 안전한 실습 환경을 보장합니다.
            </p>
          </div>
          <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-[#2A2A2A] pb-4 md:pb-0 md:pr-4">
            <div className="flex items-center gap-2 text-[#EDEAE4] font-medium text-sm">
              <Sparkles className="w-4 h-4 text-[#C2A878]" />
              <span>정은(Silver 925) 원자재</span>
            </div>
            <p className="leading-relaxed">
              도금이나 저급 금속이 아닌 순도 92.5% 정은 원자재를 제공하며 당일 완성하여 착용해 가실 수 있습니다.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[#EDEAE4] font-medium text-sm">
              <ShieldCheck className="w-4 h-4 text-[#C2A878]" />
              <span>초보자 맞춤형 진행</span>
            </div>
            <p className="leading-relaxed">
              금속공예가 처음이신 분도 완성도 높은 주얼리를 만드실 수 있도록 단계별 노하우를 안내합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Class List */}
      {loading ? (
        <div className="py-24 text-center text-xs text-[#9A958D]">
          클래스 정보를 불러오는 중입니다...
        </div>
      ) : (
        <div className="space-y-12">
          {classes.map((cls, idx) => (
            <article
              key={cls.id}
              className="bg-[#161616] border border-[#2A2A2A] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0"
            >
              {/* Image side (4:5 or widescreen responsive) */}
              <div className="lg:col-span-5 aspect-[4/5] bg-[#0E0E0E] overflow-hidden">
                {cls.images && cls.images.length > 0 && cls.images[0] ? (
                  <img
                    src={cls.images[0]}
                    alt={cls.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <ProductImage alt={cls.name} />
                )}
              </div>

              {/* Content side */}
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-[#C2A878] font-serif tracking-widest uppercase">
                    <span>CLASS NO. 0{idx + 1}</span>
                    <span className="flex items-center gap-1.5 text-[#9A958D]">
                      <Clock className="w-3.5 h-3.5" />
                      약 {cls.durationMin}분 소요
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-serif text-[#EDEAE4] tracking-wide">
                    {cls.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#9A958D] leading-relaxed">
                    {cls.description}
                  </p>

                  {/* Included Badges */}
                  <div className="pt-2">
                    <h4 className="text-[11px] text-[#EDEAE4] font-medium mb-2">제공 내역:</h4>
                    <div className="flex flex-wrap gap-2 text-xs text-[#9A958D]">
                      {cls.included.map((inc, i) => (
                        <span key={i} className="px-2.5 py-1 bg-[#0E0E0E] border border-[#2A2A2A]">
                          {inc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer price & CTA */}
                <div className="pt-6 border-t border-[#2A2A2A] flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-[#9A958D] block">수강료</span>
                    <span className="text-2xl font-serif text-[#EDEAE4]">
                      {cls.price.toLocaleString()}원
                    </span>
                  </div>
                  <Link
                    to={`/atelier/${cls.slug}`}
                    className="w-full sm:w-auto px-6 py-3.5 bg-[#EDEAE4] text-[#0E0E0E] hover:bg-white hover:ring-1 hover:ring-[#C2A878] transition-all text-xs uppercase tracking-widest font-medium min-h-[44px] flex items-center justify-center gap-2"
                  >
                    <span>일정 조회 및 예약 신청</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
export default AtelierPage;
