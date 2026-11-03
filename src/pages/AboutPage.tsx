import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Hammer, Flame, Sparkles } from 'lucide-react';
import SectionTitle from '../components/common/SectionTitle';
import { usePageMeta } from '../hooks/usePageMeta';

export const AboutPage: React.FC = () => {
  usePageMeta('공방 이야기', '정은 925 본연의 물성과 단조 기법으로 시간을 빚는 MIJE\' 아틀리에 이야기입니다.');

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 pb-28 max-w-4xl space-y-20">
      {/* 1. Header */}
      <SectionTitle
        en="ABOUT ATELIER"
        ko="공방 이야기"
        description="정은 925의 묵직한 물성과 손끝의 호흡이 머무는 곳, MIJE'입니다."
      />

      {/* 2. Hero Atmosphere */}
      <section className="space-y-6">
        <div className="aspect-[16/9] sm:aspect-[21/9] bg-[#161616] border border-[#2A2A2A] overflow-hidden">
          <img
            src="/images/mije-hero-desktop.png"
            alt="MIJE' 은공방 실버 주얼리"
            className="w-full h-full object-cover object-[70%_60%]"
          />
        </div>
        <div className="text-center max-w-2xl mx-auto space-y-3 pt-2">
          <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#EDEAE4] leading-relaxed">
            &ldquo;은은 차가운 금속이지만,<br />
            사람의 체온과 시간을 품으며 가장 부드러운 빛을 냅니다.&rdquo;
          </h2>
          <p className="text-xs sm:text-sm text-[#9A958D] leading-relaxed">
            기계로 대량 복제되는 차가운 장신구 대신, 두드리고 달구며 형태를 찾아가는
            전통 단조와 수공예의 가치를 지향합니다.
          </p>
        </div>
      </section>

      {/* 3. Artisan & Space */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center border-t border-[#2A2A2A] pt-16">
        <div className="aspect-[4/5] bg-[#161616] border border-[#2A2A2A] overflow-hidden">
          <img
            src="/images/mije-hero-mobile.png"
            alt="공방 작업대와 실버 피스"
            className="w-full h-full object-cover object-[center_40%]"
          />
        </div>
        <div className="space-y-4 text-left">
          <span className="text-xs uppercase font-serif tracking-[0.2em] text-[#C2A878]">
            ARTISAN &amp; SPACE
          </span>
          <h3 className="font-serif text-2xl text-[#EDEAE4]">
            고요한 작업대 위의 시간
          </h3>
          <p className="text-xs sm:text-sm text-[#9A958D] leading-relaxed">
            MIJE&apos;의 작업실은 도심 속 작은 안식처와 같은 공간입니다.
            나무 작업대마다 남겨진 쇠망치 자국과 톱밥, 그리고 은가루는
            이곳에서 거쳐간 수많은 손길과 이야기들을 증명합니다.
          </p>
          <p className="text-xs sm:text-sm text-[#9A958D] leading-relaxed">
            작가는 일상에서 마주치는 비정형의 자연물—바람에 흔들리는 잎사귀,
            파도의 침식선, 바위의 단면—에서 영감을 얻어 형태를 빚어냅니다.
          </p>
        </div>
      </section>

      {/* 4. Materials & Techniques */}
      <section className="space-y-8 border-t border-[#2A2A2A] pt-16">
        <div className="text-left space-y-2">
          <span className="text-xs uppercase font-serif tracking-[0.2em] text-[#C2A878]">
            MATERIALS &amp; TECHNIQUES
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#EDEAE4]">
            소재와 기법에 대한 고집
          </h3>
          <p className="text-xs sm:text-sm text-[#9A958D] leading-relaxed">
            MIJE&apos;는 보이지 않는 곳까지 정직하게 다듬습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-[#161616] border border-[#2A2A2A] space-y-3">
            <Sparkles className="w-5 h-5 text-[#C2A878]" />
            <h4 className="text-sm font-medium text-[#EDEAE4]">정은 925 (Sterling Silver)</h4>
            <p className="text-xs text-[#9A958D] leading-relaxed">
              순은(99.9%)의 무른 성질을 보완하고 단단한 내구성을 갖춘 92.5% 고순도 정은만을 고집합니다. 알레르기 걱정 없이 피부에 밀착됩니다.
            </p>
          </div>

          <div className="p-6 bg-[#161616] border border-[#2A2A2A] space-y-3">
            <Hammer className="w-5 h-5 text-[#C2A878]" />
            <h4 className="text-sm font-medium text-[#EDEAE4]">손망치 단조 (Forging)</h4>
            <p className="text-xs text-[#9A958D] leading-relaxed">
              금속을 수백 번 두드려 조직을 치밀하게 압축시키는 단조 공정은 기계 캐스팅이 흉내 낼 수 없는 단단함과 고유한 빛의 굴절을 만듭니다.
            </p>
          </div>

          <div className="p-6 bg-[#161616] border border-[#2A2A2A] space-y-3">
            <Flame className="w-5 h-5 text-[#C2A878]" />
            <h4 className="text-sm font-medium text-[#EDEAE4]">유화 착색 (Antique Patina)</h4>
            <p className="text-xs text-[#9A958D] leading-relaxed">
              음각과 홈 부위를 고의로 산화시켜 깊은 흑색 음영을 만든 뒤 표면을 세공하여 입체적인 명암 대비와 빈티지한 아름다움을 완성합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Process Photo Gallery */}
      <section className="space-y-6 border-t border-[#2A2A2A] pt-16">
        <h3 className="font-serif text-2xl text-[#EDEAE4] text-center">
          단련의 과정
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { pos: 'center 20%', title: '01. 은선 절단 및 톱질' },
            { pos: 'center 45%', title: '02. 열풀림 및 은땜' },
            { pos: 'center 70%', title: '03. 지환봉 단조 성형' },
            { pos: 'center 95%', title: '04. 단계별 폴리싱 마감' },
          ].map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="aspect-[4/5] bg-[#161616] border border-[#2A2A2A] overflow-hidden">
                <img
                  src="/images/mije-hero-mobile.png"
                  alt={item.title}
                  style={{ objectPosition: item.pos }}
                  className="w-full h-full object-cover filter contrast-105"
                />
              </div>
              <p className="text-xs text-center text-[#9A958D]">{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Atelier Class CTA */}
      <section className="bg-[#161616] border border-[#2A2A2A] p-8 sm:p-12 text-center space-y-4">
        <span className="text-xs uppercase font-serif tracking-[0.2em] text-[#C2A878]">
          COME AND EXPERIENCE
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-[#EDEAE4]">
          공방 작업대에서 당신만의 주얼리를 직접 만들어보세요
        </h3>
        <p className="text-xs sm:text-sm text-[#9A958D] max-w-xl mx-auto leading-relaxed">
          초보자도 안전하고 편안하게 참여할 수 있는 소수 정원 클래스가 매주 열립니다.
        </p>
        <div className="pt-2">
          <Link
            to="/atelier"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#EDEAE4] text-xs uppercase tracking-widest text-[#EDEAE4] hover:border-[#C2A878] hover:text-[#C2A878] transition-colors min-h-[44px]"
          >
            <span>클래스 일정 조회 및 신청</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
export default AboutPage;
