import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openPolicy = (title: string) => {
    setActiveModal(title);
  };

  return (
    <>
      <footer className="bg-[#0E0E0E] border-t border-[#2A2A2A] text-[#9A958D] text-xs pt-16 pb-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#2A2A2A]/60">
            {/* Brand Intro */}
            <div className="md:col-span-1 space-y-4">
              <Link to="/" className="inline-block focus:outline-none" aria-label="MIJE' 홈으로 이동">
                <img
                  src="/images/mije-logo.png"
                  alt="MIJE'"
                  className="w-[160px] h-auto object-contain mix-blend-screen -ml-1"
                />
              </Link>
              <p className="text-xs leading-relaxed text-[#9A958D]">
                정은(Silver 925) 본연의 묵직한 물성과 미니멀한 조형을 탐구하는 실버 주얼리 아틀리에입니다.
                손끝의 온도와 시간이 담긴 지속 가능한 오브제를 제작합니다.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-serif tracking-widest text-[#EDEAE4]">EXPLORE</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/ready-made" className="hover:text-[#EDEAE4] transition-colors">
                    기성품 (Ready-made)
                  </Link>
                </li>
                <li>
                  <Link to="/handmade" className="hover:text-[#EDEAE4] transition-colors">
                    핸드메이드 (Handmade)
                  </Link>
                </li>
                <li>
                  <Link to="/atelier" className="hover:text-[#EDEAE4] transition-colors">
                    은공방 클래스 (Atelier)
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#EDEAE4] transition-colors">
                    공방 이야기 (About)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Care */}
            <div className="space-y-3">
              <h4 className="text-xs font-serif tracking-widest text-[#EDEAE4]">CUSTOMER CARE</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/orders" className="hover:text-[#EDEAE4] transition-colors">
                    주문 배송 조회
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="hover:text-[#EDEAE4] transition-colors">
                    고객 문의 및 FAQ
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openPolicy('이용 안내')}
                    className="hover:text-[#EDEAE4] text-left transition-colors"
                  >
                    이용 안내
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openPolicy('배송·교환·환불 규정')}
                    className="hover:text-[#EDEAE4] text-left transition-colors"
                  >
                    배송 · 교환 · 환불
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openPolicy('개인정보처리방침')}
                    className="hover:text-[#EDEAE4] text-left transition-colors"
                  >
                    개인정보처리방침
                  </button>
                </li>
              </ul>
            </div>

            {/* Atelier Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-serif tracking-widest text-[#EDEAE4]">ATELIER LOCATION</h4>
              <div className="space-y-1.5 text-xs text-[#9A958D]">
                <p>서울특별시 은공방 쇼룸 (사전 예약제 운영)</p>
                <p>화요일 - 일요일: 11:00 - 19:00</p>
                <p>매주 월요일 휴무</p>
                <p className="pt-2 text-[11px] text-[#EDEAE4]/80">
                  문의: community 게시판 1:1 문의 이용
                </p>
              </div>
            </div>
          </div>

          {/* Business Info Placeholder & Copyright */}
          <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between text-[11px] text-[#9A958D]/70 gap-4">
            <div className="space-y-1">
              <p>[사업자 정보 입력 예정]</p>
              <p>상호: MIJE&apos; | 대표: [성명 미정] | 사업자등록번호: [등록번호 미정] | 통신판매업신고: [신고번호 미정]</p>
              <p>본 사이트는 1차 시연용 웹사이트로 실제 결제 및 상거래는 발생하지 않습니다.</p>
            </div>
            <div className="font-serif tracking-widest text-[#9A958D]">
              &copy; MIJE&apos; ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </footer>

      {/* Policy Modal Placeholder */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#161616] border border-[#2A2A2A] max-w-lg w-full p-6 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
              <h3 className="font-medium text-[#EDEAE4] text-sm">{activeModal}</h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-[#9A958D] hover:text-[#EDEAE4] min-w-[36px] min-h-[36px] flex items-center justify-center"
              >
                닫기
              </button>
            </div>
            <div className="text-[#9A958D] leading-relaxed py-4 space-y-2">
              <p>추후 작성</p>
              <p className="text-[11px] text-[#EDEAE4]/60">
                (정식 론칭 시 실제 법적 약관 및 방침 내용이 기재될 영역입니다.)
              </p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 border border-[#2A2A2A] hover:border-[#C2A878] text-[#EDEAE4]"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Footer;
