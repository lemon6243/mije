import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Users, Calendar as CalendarIcon, Check, AlertCircle, ShieldAlert, ArrowLeft } from 'lucide-react';
import { getClassBySlug, getClassSessions, createReservation } from '../services/api';
import { ClassItem, ClassSession, Reservation } from '../types';
import SectionTitle from '../components/common/SectionTitle';
import ProductImage from '../components/common/ProductImage';
import { usePageMeta } from '../hooks/usePageMeta';

export const ClassDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [cls, setCls] = useState<ClassItem | null>(null);
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Reservation Form State
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [headcount, setHeadcount] = useState<number>(1);
  const [applicantName, setApplicantName] = useState<string>('');
  const [applicantPhone, setApplicantPhone] = useState<string>('');
  const [applicantNotes, setApplicantNotes] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      try {
        const found = await getClassBySlug(slug);
        setCls(found);
        if (found) {
          const sess = await getClassSessions(found.id);
          setSessions(sess);
          if (sess.length > 0) {
            setSelectedDate(sess[0].date);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  usePageMeta(cls ? cls.name : '클래스 예약', cls?.description);

  // Group sessions by date for the calendar
  const uniqueDates = Array.from(new Set(sessions.map((s) => s.date))).sort();

  // Sessions for currently selected date
  const dateSessions = sessions.filter((s) => s.date === selectedDate);
  const selectedSession = sessions.find((s) => s.id === selectedSessionId);

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);

    if (!selectedSessionId) {
      setFeedbackError('참여하실 시간대를 선택해 주십시오.');
      return;
    }

    if (!applicantName.trim()) {
      setFeedbackError('예약자 성함을 입력해 주십시오.');
      return;
    }

    if (!applicantPhone.trim() || applicantPhone.length < 9) {
      setFeedbackError('연락 가능한 전화번호를 올바르게 입력해 주십시오.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createReservation({
        sessionId: selectedSessionId,
        name: applicantName.trim(),
        phone: applicantPhone.trim(),
        headcount,
        notes: applicantNotes.trim(),
      });

      if (result.success && result.reservation) {
        setConfirmedReservation(result.reservation);
        // Refresh sessions to reflect updated capacity
        if (cls) {
          const updatedSessions = await getClassSessions(cls.id);
          setSessions(updatedSessions);
        }
      } else {
        setFeedbackError(result.message || '예약 처리 중 오류가 발생했습니다.');
      }
    } catch {
      setFeedbackError('예약 처리 중 네트워크 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-24 text-center text-xs text-[#9A958D]">
        클래스 일정을 불러오는 중입니다...
      </div>
    );
  }

  if (!cls) {
    return (
      <div className="container mx-auto px-6 py-24 text-center space-y-4">
        <h2 className="text-lg text-[#EDEAE4]">존재하지 않는 클래스입니다.</h2>
        <Link to="/atelier" className="px-4 py-2 border border-[#2A2A2A] text-xs text-[#EDEAE4]">
          클래스 목록으로 이동
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-28">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          to="/atelier"
          className="inline-flex items-center gap-2 text-xs text-[#9A958D] hover:text-[#EDEAE4] transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>전체 클래스 목록으로</span>
        </Link>
      </div>

      {/* Hero Intro */}
      <div className="border-b border-[#2A2A2A] pb-8 mb-12">
        <div className="flex items-center gap-3 text-xs text-[#C2A878] font-serif tracking-widest uppercase mb-2">
          <span>MIJE&apos; ATELIER WORKSHOP</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-[#9A958D]">
            <Clock className="w-3.5 h-3.5" />
            약 {cls.durationMin}분 소요
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl text-[#EDEAE4] font-medium leading-tight">
          {cls.name}
        </h1>
        <p className="text-sm text-[#9A958D] mt-4 max-w-3xl leading-relaxed">
          {cls.detailedIntro}
        </p>
      </div>

      {/* Main Grid: Details Left, Reservation Form Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Workshop Information & Example Pieces */}
        <div className="lg:col-span-7 space-y-10">
          {/* Example Images */}
          <div className="grid grid-cols-2 gap-4">
            {cls.images && cls.images.length > 0 ? (
              cls.images.map((img, i) => (
                <div key={i} className="aspect-[4/5] bg-[#161616] border border-[#2A2A2A] overflow-hidden">
                  <img
                    src={img}
                    alt={`${cls.name} 완성 작품 예시 ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <>
                <div className="aspect-[4/5] bg-[#161616] border border-[#2A2A2A] overflow-hidden">
                  <ProductImage alt={`${cls.name} 완성 작품 예시 1`} />
                </div>
                <div className="aspect-[4/5] bg-[#161616] border border-[#2A2A2A] overflow-hidden">
                  <ProductImage alt={`${cls.name} 완성 작품 예시 2`} />
                </div>
              </>
            )}
          </div>

          {/* Curriculum */}
          <div className="bg-[#161616] border border-[#2A2A2A] p-6 space-y-4">
            <h3 className="text-sm font-medium text-[#EDEAE4] tracking-wide border-b border-[#2A2A2A] pb-3">
              클래스 진행 커리큘럼
            </h3>
            <ol className="space-y-2.5 text-xs text-[#9A958D]">
              {cls.curriculum.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="font-serif text-[#C2A878] font-bold">0{idx + 1}</span>
                  <span className="leading-relaxed text-[#EDEAE4]/90">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Materials & Policy */}
          <div className="space-y-4 text-xs text-[#9A958D]">
            <div className="p-5 bg-[#161616] border border-[#2A2A2A] space-y-2">
              <h4 className="text-[#EDEAE4] font-medium text-xs">준비물 및 제공 내역</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>정은 925 은선/판재 및 금속공예 전용 공구 일체 무료 대여</li>
                <li>작업용 앞치마 및 보안경 완비 (편안한 복장으로 방문해 주세요)</li>
                <li>완성작 보관용 패키지 및 보증서 제공</li>
              </ul>
            </div>

            <div className="p-5 bg-[#161616] border border-[#2A2A2A] space-y-2">
              <h4 className="text-[#EDEAE4] font-medium text-xs">취소 및 변경 규정</h4>
              <p className="leading-relaxed text-[#9A958D]">
                {cls.cancelPolicy}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Schedule & Reservation */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 bg-[#161616] border border-[#2A2A2A] p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#2A2A2A] pb-4">
              <h2 className="text-lg font-serif text-[#EDEAE4] tracking-wide">
                클래스 일정 선택 &amp; 예약
              </h2>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-xs text-[#9A958D]">1인 수강료</span>
                <span className="text-xl font-serif text-[#EDEAE4]">
                  {cls.price.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* Date Selection (Scrollable 4-week calendar strips) */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#EDEAE4] flex items-center justify-between">
                <span>날짜 선택 (향후 4주간)</span>
                <span className="text-[11px] text-[#9A958D] font-normal">{selectedDate}</span>
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 max-h-40 overflow-y-auto p-1 bg-[#0E0E0E] border border-[#2A2A2A]">
                {uniqueDates.map((d) => {
                  const dateObj = new Date(d);
                  const dayNum = dateObj.getDate();
                  const weekDay = ['일', '월', '화', '수', '목', '금', '토'][dateObj.getDay()];
                  const isSelected = selectedDate === d;
                  const isSun = dateObj.getDay() === 0;

                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setSelectedDate(d);
                        setSelectedSessionId('');
                      }}
                      className={`p-2 text-center text-xs transition-colors flex flex-col items-center justify-center min-h-[44px] ${
                        isSelected
                          ? 'bg-[#C2A878] text-[#0E0E0E] font-bold'
                          : 'hover:bg-[#161616] text-[#EDEAE4]'
                      } ${isSun ? 'text-[#C46A5E]' : ''}`}
                    >
                      <span className="text-[10px] opacity-75">{weekDay}</span>
                      <span className="text-xs">{dayNum}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#EDEAE4]">
                시간대 및 잔여 자리
              </label>
              <div className="space-y-2">
                {dateSessions.map((sess) => {
                  const remaining = sess.capacity - sess.reserved;
                  const isFull = remaining <= 0;
                  const isSelected = selectedSessionId === sess.id;

                  return (
                    <button
                      key={sess.id}
                      type="button"
                      disabled={isFull}
                      onClick={() => setSelectedSessionId(sess.id)}
                      className={`w-full p-3.5 text-xs border text-left flex items-center justify-between transition-colors min-h-[44px] ${
                        isFull
                          ? 'border-[#2A2A2A] bg-[#0E0E0E]/40 text-[#6F6A63] cursor-not-allowed'
                          : isSelected
                          ? 'border-[#C2A878] bg-[#0E0E0E] text-[#EDEAE4] ring-1 ring-[#C2A878]'
                          : 'border-[#2A2A2A] bg-[#0E0E0E] text-[#EDEAE4] hover:border-[#9A958D]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#C2A878]" />
                        <span className="font-medium text-sm">{sess.time}</span>
                      </div>
                      <div>
                        {isFull ? (
                          <span className="text-[#6F6A63] font-medium">[마감]</span>
                        ) : (
                          <span className="text-[#9A958D]">
                            잔여 <strong className="text-[#C2A878]">{remaining}</strong>석 / 정원 {sess.capacity}명
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Headcount Selection */}
            {selectedSession && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-[#EDEAE4]">예약 인원</label>
                  <span className="text-xs text-[#9A958D]">
                    최대 가능: {selectedSession.capacity - selectedSession.reserved}명
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((count) => {
                    const remaining = selectedSession.capacity - selectedSession.reserved;
                    const disabled = count > remaining;
                    return (
                      <button
                        key={count}
                        type="button"
                        disabled={disabled}
                        onClick={() => setHeadcount(count)}
                        className={`flex-1 py-2 text-xs border min-h-[44px] transition-colors ${
                          disabled
                            ? 'border-[#2A2A2A] text-[#6F6A63] cursor-not-allowed'
                            : headcount === count
                            ? 'border-[#C2A878] bg-[#0E0E0E] text-[#C2A878] font-bold'
                            : 'border-[#2A2A2A] hover:border-[#9A958D] text-[#EDEAE4]'
                        }`}
                      >
                        {count}명
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Applicant Details Form */}
            <form onSubmit={handleReservationSubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs text-[#EDEAE4] mb-1">
                  예약자 성함 <span className="text-[#C2A878]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full bg-[#0E0E0E] border border-[#2A2A2A] px-3 py-2 text-xs text-[#EDEAE4] placeholder-[#9A958D] focus:border-[#C2A878] focus:outline-none min-h-[40px]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#EDEAE4] mb-1">
                  연락처 (휴대전화) <span className="text-[#C2A878]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full bg-[#0E0E0E] border border-[#2A2A2A] px-3 py-2 text-xs text-[#EDEAE4] placeholder-[#9A958D] focus:border-[#C2A878] focus:outline-none min-h-[40px]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#EDEAE4] mb-1">
                  요청사항 / 각인 문구 (선택)
                </label>
                <textarea
                  rows={2}
                  value={applicantNotes}
                  onChange={(e) => setApplicantNotes(e.target.value)}
                  placeholder="원하시는 각인 문구나 기타 문의 사항이 있으시면 입력해 주세요."
                  className="w-full bg-[#0E0E0E] border border-[#2A2A2A] px-3 py-2 text-xs text-[#EDEAE4] placeholder-[#9A958D] focus:border-[#C2A878] focus:outline-none resize-none"
                />
              </div>

              {/* Total Fee Preview */}
              <div className="flex items-baseline justify-between pt-3 border-t border-[#2A2A2A]">
                <span className="text-xs text-[#9A958D]">총 결제 금액 ({headcount}인)</span>
                <span className="text-xl font-serif text-[#EDEAE4]">
                  {(cls.price * headcount).toLocaleString()}원
                </span>
              </div>

              {/* Error Message */}
              {feedbackError && (
                <div className="p-3 bg-[#0E0E0E] border border-[#C46A5E] text-[#C46A5E] text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{feedbackError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !selectedSessionId}
                className={`w-full py-4 text-xs uppercase tracking-widest font-medium transition-all min-h-[44px] flex items-center justify-center border ${
                  !selectedSessionId
                    ? 'bg-[#0E0E0E] border-[#2A2A2A] text-[#6F6A63] cursor-not-allowed'
                    : 'bg-[#EDEAE4] text-[#0E0E0E] border-[#EDEAE4] hover:bg-white hover:border-[#C2A878] hover:ring-1 hover:ring-[#C2A878]'
                }`}
              >
                {isSubmitting ? '예약 신청 중...' : '클래스 예약 신청하기'}
              </button>

              <p className="text-[11px] text-[#9A958D] text-center pt-1">
                * 시연용 환경으로 실제 결제 없이 즉시 예약 번호가 발급됩니다.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmedReservation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#161616] border border-[#C2A878] max-w-md w-full p-6 sm:p-8 space-y-6 text-center animate-fadeIn shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-full border border-[#C2A878] flex items-center justify-center text-[#C2A878]">
              <Check className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-serif tracking-widest text-[#C2A878]">
                RESERVATION CONFIRMED
              </span>
              <h3 className="text-xl text-[#EDEAE4] font-serif">
                클래스 예약이 정상 접수되었습니다.
              </h3>
            </div>

            {/* Details Box */}
            <div className="bg-[#0E0E0E] border border-[#2A2A2A] p-4 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-[#2A2A2A] pb-2">
                <span className="text-[#9A958D]">예약 번호</span>
                <span className="font-serif text-[#C2A878] font-bold">
                  {confirmedReservation.reservationNo}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9A958D]">클래스</span>
                <span className="text-[#EDEAE4]">{confirmedReservation.className}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9A958D]">일정</span>
                <span className="text-[#EDEAE4]">
                  {confirmedReservation.sessionDate} {confirmedReservation.sessionTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9A958D]">예약자</span>
                <span className="text-[#EDEAE4]">
                  {confirmedReservation.name} ({confirmedReservation.headcount}명)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9A958D]">연락처</span>
                <span className="text-[#EDEAE4]">{confirmedReservation.phone}</span>
              </div>
              <div className="flex justify-between border-t border-[#2A2A2A] pt-2">
                <span className="text-[#9A958D]">결제 예정액</span>
                <span className="font-serif text-[#EDEAE4]">
                  {confirmedReservation.totalPrice.toLocaleString()}원
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#9A958D] leading-relaxed">
              예약 확인 안내 문자가 발송될 예정입니다.<br />
              일정 변경이나 취소는 공방 문의(community)를 통해 가능합니다.
            </p>

            <button
              type="button"
              onClick={() => setConfirmedReservation(null)}
              className="w-full py-3.5 bg-[#EDEAE4] text-[#0E0E0E] text-xs uppercase tracking-widest font-medium hover:bg-white min-h-[44px]"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ClassDetailPage;
