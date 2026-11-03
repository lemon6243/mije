import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  MessageSquare,
  Star,
  Lock,
  ChevronDown,
  ChevronUp,
  Check,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { getPosts, createPost, getFaqs, getProducts, getClasses } from '../services/api';
import { Post, FaqItem, Product, ClassItem } from '../types';
import SectionTitle from '../components/common/SectionTitle';
import { usePageMeta } from '../hooks/usePageMeta';

export const CommunityPage: React.FC = () => {
  usePageMeta('후기·문의', '고객 구매 후기, 클래스 수강 후기, 1:1 비공개 맞춤 문의 및 자주 묻는 질문입니다.');

  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = (searchParams.get('tab') as 'review' | 'inquiry' | 'faq') || 'review';

  const [posts, setPosts] = useState<Post[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter for reviews: all, product, class
  const [reviewFilter, setReviewFilter] = useState<'all' | 'product' | 'class'>('all');

  // Accordion state for FAQs
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  // Writing Forms
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [isWritingInquiry, setIsWritingInquiry] = useState(false);

  // Review form state
  const [revTitle, setRevTitle] = useState('');
  const [revBody, setRevBody] = useState('');
  const [revAuthor, setRevAuthor] = useState('고객 ' + String.fromCharCode(65 + Math.floor(Math.random() * 26)));
  const [revRating, setRevRating] = useState(5);
  const [revType, setRevType] = useState<'product' | 'class'>('product');
  const [revRelatedId, setRevRelatedId] = useState('');
  const [revCertCode, setRevCertCode] = useState(''); // 주문번호 or 예약번호 인증

  // Inquiry form state
  const [inqTitle, setInqTitle] = useState(searchParams.get('relatedName') ? `[문의] ${searchParams.get('relatedName')}` : '');
  const [inqBody, setInqBody] = useState('');
  const [inqAuthor, setInqAuthor] = useState('고객 ' + String.fromCharCode(65 + Math.floor(Math.random() * 26)));
  const [inqIsPrivate, setInqIsPrivate] = useState(true);
  const [inqRelatedType, setInqRelatedType] = useState<'product' | 'class'>(
    (searchParams.get('relatedType') as 'product' | 'class') || 'product'
  );
  const [inqRelatedId, setInqRelatedId] = useState(searchParams.get('relatedId') || '');
  const [unlockedInquiryIds, setUnlockedInquiryIds] = useState<string[]>([]);

  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [allPosts, allFaqs, allProds, allCls] = await Promise.all([
          getPosts(),
          getFaqs(),
          getProducts(),
          getClasses(),
        ]);
        setPosts(allPosts);
        setFaqs(allFaqs);
        setProducts(allProds);
        setClasses(allCls);

        if (allProds.length > 0 && !revRelatedId) {
          setRevRelatedId(allProds[0].id);
        }
        if (allProds.length > 0 && !inqRelatedId) {
          setInqRelatedId(allProds[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync related param if arrived from product detail
  useEffect(() => {
    const relatedName = searchParams.get('relatedName');
    const relatedId = searchParams.get('relatedId');
    if (relatedName) {
      setInqTitle(`[맞춤/상품 문의] ${relatedName}`);
      setIsWritingInquiry(true);
    }
    if (relatedId) {
      setInqRelatedId(relatedId);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'review' | 'inquiry' | 'faq') => {
    setSearchParams({ tab });
    setFormFeedback(null);
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    if (!revCertCode.trim()) {
      setFormFeedback({
        type: 'error',
        text: '구매 또는 수강 인증을 위해 주문번호(또는 예약번호)를 입력해 주십시오. (시연: 임의의 번호 입력 가능)',
      });
      return;
    }

    const relatedObj =
      revType === 'product'
        ? products.find((p) => p.id === revRelatedId)
        : classes.find((c) => c.id === revRelatedId);

    const newPost = await createPost({
      board: 'review',
      title: revTitle.trim(),
      body: revBody.trim(),
      author: revAuthor.trim() || '고객 후기',
      rating: revRating,
      relatedType: revType,
      relatedId: revRelatedId,
      relatedName: relatedObj ? relatedObj.name : undefined,
      images: [],
    });

    setPosts((prev) => [newPost, ...prev]);
    setIsWritingReview(false);
    setRevTitle('');
    setRevBody('');
    setRevCertCode('');
    setFormFeedback({ type: 'success', text: '정성스러운 후기가 등록되었습니다.' });
    setTimeout(() => setFormFeedback(null), 4000);
  };

  const handleCreateInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    const relatedObj =
      inqRelatedType === 'product'
        ? products.find((p) => p.id === inqRelatedId)
        : classes.find((c) => c.id === inqRelatedId);

    const newPost = await createPost({
      board: 'inquiry',
      title: inqTitle.trim(),
      body: inqBody.trim(),
      author: inqAuthor.trim() || '고객',
      isPrivate: inqIsPrivate,
      relatedType: inqRelatedType,
      relatedId: inqRelatedId,
      relatedName: relatedObj ? relatedObj.name : undefined,
    });

    setPosts((prev) => [newPost, ...prev]);
    setUnlockedInquiryIds((prev) => [...prev, newPost.id]); // automatically unlock own post
    setIsWritingInquiry(false);
    setInqTitle('');
    setInqBody('');
    setFormFeedback({ type: 'success', text: '1:1 문의가 안전하게 접수되었습니다. 작가 확인 후 답변이 등록됩니다.' });
    setTimeout(() => setFormFeedback(null), 4000);
  };

  const toggleUnlockInquiry = (id: string) => {
    if (unlockedInquiryIds.includes(id)) {
      setUnlockedInquiryIds((prev) => prev.filter((i) => i !== id));
    } else {
      setUnlockedInquiryIds((prev) => [...prev, id]);
    }
  };

  // Filtered lists
  const reviews = posts
    .filter((p) => p.board === 'review' && !p.isHidden)
    .filter((p) => (reviewFilter === 'all' ? true : p.relatedType === reviewFilter));

  const inquiries = posts.filter((p) => p.board === 'inquiry' && !p.isHidden);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 pb-28 max-w-4xl">
      <SectionTitle en="COMMUNITY" ko="소통과 후기" />

      {/* Tabs */}
      <div className="flex border-b border-[#2A2A2A] mb-8 text-xs font-medium tracking-wider">
        <button
          type="button"
          onClick={() => handleTabChange('review')}
          className={`flex-1 py-4 text-center border-b-2 transition-colors min-h-[44px] flex items-center justify-center gap-1.5 ${
            currentTab === 'review'
              ? 'border-[#C2A878] text-[#C2A878] font-bold'
              : 'border-transparent text-[#9A958D] hover:text-[#EDEAE4]'
          }`}
        >
          <span>후기</span>
          <span className="text-[11px] font-serif text-[#9A958D]">({reviews.length})</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('inquiry')}
          className={`flex-1 py-4 text-center border-b-2 transition-colors min-h-[44px] flex items-center justify-center gap-1.5 ${
            currentTab === 'inquiry'
              ? 'border-[#C2A878] text-[#C2A878] font-bold'
              : 'border-transparent text-[#9A958D] hover:text-[#EDEAE4]'
          }`}
        >
          <span>1:1 문의</span>
          <span className="text-[11px] font-serif text-[#9A958D]">({inquiries.length})</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('faq')}
          className={`flex-1 py-4 text-center border-b-2 transition-colors min-h-[44px] flex items-center justify-center gap-1.5 ${
            currentTab === 'faq'
              ? 'border-[#C2A878] text-[#C2A878] font-bold'
              : 'border-transparent text-[#9A958D] hover:text-[#EDEAE4]'
          }`}
        >
          <span>자주 묻는 질문 (FAQ)</span>
        </button>
      </div>

      {/* Feedback Alert */}
      {formFeedback && (
        <div
          className={`p-3.5 mb-6 text-xs border flex items-center gap-2 ${
            formFeedback.type === 'success'
              ? 'bg-[#161616] border-[#C2A878] text-[#EDEAE4]'
              : 'bg-[#161616] border-[#C46A5E] text-[#C46A5E]'
          }`}
        >
          {formFeedback.type === 'success' ? (
            <Check className="w-4 h-4 text-[#C2A878] flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#C46A5E] flex-shrink-0" />
          )}
          <span>{formFeedback.text}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 1: REVIEWS */}
      {/* ========================================================= */}
      {currentTab === 'review' && (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#2A2A2A]">
            {/* Filter: All / Product / Class */}
            <div className="flex items-center gap-2">
              {(['all', 'product', 'class'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setReviewFilter(f)}
                  className={`px-3 py-1.5 text-xs border transition-colors min-h-[38px] ${
                    reviewFilter === f
                      ? 'border-[#C2A878] text-[#C2A878] bg-[#161616]'
                      : 'border-transparent text-[#9A958D] hover:text-[#EDEAE4]'
                  }`}
                >
                  {f === 'all' ? '전체 후기' : f === 'product' ? '상품 후기' : '클래스 후기'}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsWritingReview(!isWritingReview)}
              className="px-4 py-2 bg-[#EDEAE4] text-[#0E0E0E] text-xs uppercase tracking-widest font-medium hover:bg-white min-h-[44px] flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isWritingReview ? '작성 취소' : '후기 작성하기'}</span>
            </button>
          </div>

          {/* Review Writing Form */}
          {isWritingReview && (
            <form
              onSubmit={handleCreateReview}
              className="bg-[#161616] border border-[#C2A878] p-6 space-y-4 animate-fadeIn"
            >
              <div className="border-b border-[#2A2A2A] pb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-[#EDEAE4]">새 후기 작성</h3>
                <span className="text-xs text-[#C2A878]">구매 및 수강 인증 필수</span>
              </div>

              {/* Verification Notice Banner */}
              <div className="bg-[#0E0E0E] border border-[#2A2A2A] p-3 text-xs text-[#9A958D] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C2A878] flex-shrink-0" />
                <span>
                  실제 신뢰도 유지를 위해 <strong>구매 주문번호</strong> 또는 <strong>클래스 예약번호</strong> 인증 후 등록됩니다.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#EDEAE4] mb-1">후기 구분</label>
                  <select
                    value={revType}
                    onChange={(e) => {
                      setRevType(e.target.value as 'product' | 'class');
                      if (e.target.value === 'product' && products.length > 0) {
                        setRevRelatedId(products[0].id);
                      } else if (e.target.value === 'class' && classes.length > 0) {
                        setRevRelatedId(classes[0].id);
                      }
                    }}
                    className="w-full bg-[#0E0E0E] border border-[#2A2A2A] px-3 py-2 text-xs text-[#EDEAE4] focus:border-[#C2A878] focus:outline-none min-h-[44px]"
                  >
                    <option value="product">상품 구매 후기</option>
                    <option value="class">은공방 클래스 수강 후기</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#EDEAE4] mb-1">대상 상품 / 클래스 선택</label>
                  <select
                    value={revRelatedId}
                    onChange={(e) => setRevRelatedId(e.target.value)}
                    className="w-full bg-[#0E0E0E] border border-[#2A2A2A] px-3 py-2 text-xs text-[#EDEAE4] focus:border-[#C2A878] focus:outline-none min-h-[44px]"
                  >
                    {revType === 'product'
                      ? products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.material})
                          </option>
                        ))
                      : classes.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#EDEAE4] mb-1">
                    인증 코드 (주문번호 또는 예약번호) <span className="text-[#C2A878]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={revCertCode}
                    onChange={(e) => setRevCertCode(e.target.value)}
                    placeholder="예: ORD-20261028-001 또는 RES-..."
                    className="w-full bg-[#0E0E0E] border border-[#2A2A2A] px-3 py-2 text-xs text-[#EDEAE4] placeholder-[#9A958D] focus:border-[#C2A878] focus:outline-none min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#EDEAE4] mb-1">별점</label>
                  <div className="flex items-center gap-2 h-[44px]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRevRating(s)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            s <= revRating
                              ? 'text-[#C2A878] fill-[#C2A878]'
                              : 'text-[#2A2A2A]'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-[#EDEAE4] font-serif ml-2">{revRating}점</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#EDEAE4] mb-1">
                  제목 <span className="text-[#C2A878]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={revTitle}
                  onChange={(e) => setRevTitle(e.target.value)}
                  placeholder="후기 제목을 입력하세요"
                  className="w-full bg-[#0E0E0E] border border-[#2A2A2A] px-3 py-2 text-xs text-[#EDEAE4] placeholder-[#9A958D] focus:border-[#C2A878] focus:outline-none min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#EDEAE4] mb-1">
                  내용 <span className="text-[#C2A878]">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={revBody}
                  onChange={(e) => setRevBody(e.target.value)}
                  placeholder="착용감, 마감 디테일, 클래스 참여 소감 등을 자유롭게 적어주세요."
                  className="w-full bg-[#0E0E0E] border border-[#2A2A2A] px-3 py-2 text-xs text-[#EDEAE4] placeholder-[#9A958D] focus:border-[#C2A878] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWritingReview(false)}
                  className="px-4 py-2 border border-[#2A2A2A] text-xs text-[#9A958D] hover:text-[#EDEAE4]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#EDEAE4] text-[#0E0E0E] text-xs uppercase tracking-widest font-medium hover:bg-white"
                >
                  등록하기
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="py-20 text-center text-xs text-[#9A958D]">
              등록된 후기가 없습니다.
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((rev) => (
                <article
                  key={rev.id}
                  className="bg-[#161616] border border-[#2A2A2A] p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2A2A2A] pb-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-[#0E0E0E] border border-[#2A2A2A] text-[10px] text-[#C2A878] font-serif uppercase tracking-wider">
                        {rev.relatedType === 'class' ? '클래스 후기' : '상품 후기'}
                      </span>
                      {rev.relatedName && (
                        <span className="text-[#EDEAE4] font-medium">{rev.relatedName}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#9A958D]">
                      <div className="flex items-center text-[#C2A878]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < (rev.rating || 5)
                                ? 'text-[#C2A878] fill-[#C2A878]'
                                : 'text-[#2A2A2A]'
                            }`}
                          />
                        ))}
                      </div>
                      <span>{rev.author}</span>
                      <span>•</span>
                      <span>{new Date(rev.createdAt).toLocaleDateString('ko-KR')}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-medium text-[#EDEAE4]">{rev.title}</h3>
                  <p className="text-xs sm:text-sm text-[#9A958D] leading-relaxed whitespace-pre-line">
                    {rev.body}
                  </p>

                  {/* Photo if present */}
                  {rev.images && rev.images.length > 0 && (
                    <div className="pt-2">
                      <img
                        src={rev.images[0]}
                        alt="후기 첨부 사진"
                        className="w-24 h-30 sm:w-28 sm:aspect-[4/5] object-cover bg-[#0E0E0E] border border-[#2A2A2A]"
                      />
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: 1:1 INQUIRIES */}
      {/* ========================================================= */}
      {currentTab === 'inquiry' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2A]">
            <p className="text-xs text-[#9A958D]">
              비공개 1:1 맞춤 문의입니다. 타인의 문의 글은 개인정보 보호를 위해 제목만 노출되며 내용은 잠금 처리됩니다.
            </p>
            <button
              type="button"
              onClick={() => setIsWritingInquiry(!isWritingInquiry)}
              className="px-4 py-2 bg-[#EDEAE4] text-[#0E0E0E] text-xs uppercase tracking-widest font-medium hover:bg-white min-h-[44px] flex items-center gap-2 whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{isWritingInquiry ? '작성 취소' : '1:1 문의 작성'}</span>
            </button>
          </div>

          {/* Inquiry Writing Form */}
          {isWritingInquiry && (
            <form
              onSubmit={handleCreateInquiry}
              className="bg-[#161616] border border-[#C2A878] p-6 space-y-4 animate-fadeIn"
            >
              <div className="border-b border-[#2A2A2A] pb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-[#EDEAE4]">1:1 비공개 맞춤 문의 작성</h3>
                <span className="text-xs text-[#C2A878]">비공개 기본 설정</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#EDEAE4] mb-1">문의 관련 대상</label>
                  <select
                    value={inqRelatedType}
                    onChange={(e) => {
                      setInqRelatedType(e.target.value as 'product' | 'class');
                      if (e.target.value === 'product' && products.length > 0) {
                        setInqRelatedId(products[0].id);
                      } else if (e.target.value === 'class' && classes.length > 0) {
                        setInqRelatedId(classes[0].id);
                      }
                    }}
                    className="w-full bg-[#0E0E0E] border border-[#2A2A2A] px-3 py-2 text-xs text-[#EDEAE4] focus:border-[#C2A878] focus:outline-none min-h-[44px]"
                  >
                    <option value="product">상품 관련 (맞춤/사이즈)</option>
                    <option value="class">클래스 관련 (일정/인원)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#EDEAE4] mb-1">대상 선택</label>
                  <select
                    value={inqRelatedId}
                    onChange={(e) => setInqRelatedId(e.target.value)}
                    className="w-full bg-[#0E0E0E] border border-[#2A2A2A] px-3 py-2 text-xs text-[#EDEAE4] focus:border-[#C2A878] focus:outline-none min-h-[44px]"
                  >
                    {inqRelatedType === 'product'
                      ? products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))
                      : classes.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#EDEAE4] mb-1">
                  문의 제목 <span className="text-[#C2A878]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={inqTitle}
                  onChange={(e) => setInqTitle(e.target.value)}
                  placeholder="문의 제목을 입력해 주세요"
                  className="w-full bg-[#0E0E0E] border border-[#2A2A2A] px-3 py-2 text-xs text-[#EDEAE4] placeholder-[#9A958D] focus:border-[#C2A878] focus:outline-none min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#EDEAE4] mb-1">
                  문의 내용 <span className="text-[#C2A878]">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={inqBody}
                  onChange={(e) => setInqBody(e.target.value)}
                  placeholder="맞춤 디자인 요청, 사이즈 제작 가능 여부, 클래스 변경 문의 등 상세 내용을 기재해 주십시오."
                  className="w-full bg-[#0E0E0E] border border-[#2A2A2A] px-3 py-2 text-xs text-[#EDEAE4] placeholder-[#9A958D] focus:border-[#C2A878] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-[#EDEAE4] pt-1">
                <input
                  type="checkbox"
                  id="inqPrivate"
                  checked={inqIsPrivate}
                  onChange={(e) => setInqIsPrivate(e.target.checked)}
                  className="w-4 h-4 accent-[#C2A878] bg-[#0E0E0E]"
                />
                <label htmlFor="inqPrivate">비공개 글로 등록 (기본 설정)</label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWritingInquiry(false)}
                  className="px-4 py-2 border border-[#2A2A2A] text-xs text-[#9A958D] hover:text-[#EDEAE4]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#EDEAE4] text-[#0E0E0E] text-xs uppercase tracking-widest font-medium hover:bg-white"
                >
                  문의 등록
                </button>
              </div>
            </form>
          )}

          {/* Inquiries List */}
          <div className="divide-y divide-[#2A2A2A] border-y border-[#2A2A2A]">
            {inquiries.map((inq) => {
              const isUnlocked = unlockedInquiryIds.includes(inq.id) || !inq.isPrivate;
              return (
                <div key={inq.id} className="py-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {inq.isPrivate && <Lock className="w-3.5 h-3.5 text-[#9A958D]" />}
                      <span className="text-[#EDEAE4] font-medium">{inq.title}</span>
                      {inq.relatedName && (
                        <span className="text-[11px] text-[#9A958D]">
                          ({inq.relatedName})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-0.5 text-[11px] border ${
                          inq.answer
                            ? 'border-[#C2A878] text-[#C2A878]'
                            : 'border-[#2A2A2A] text-[#9A958D]'
                        }`}
                      >
                        {inq.answer ? '답변완료' : '답변대기'}
                      </span>
                      <span className="text-[#9A958D] hidden sm:inline">{inq.author}</span>
                      <span className="text-[#9A958D]">
                        {new Date(inq.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>

                  {/* Body & Answer View or Locked State */}
                  {isUnlocked ? (
                    <div className="bg-[#0E0E0E] border border-[#2A2A2A] p-4 text-xs space-y-4">
                      <div className="space-y-1">
                        <span className="text-[#EDEAE4] font-medium block">문의 내용:</span>
                        <p className="text-[#9A958D] leading-relaxed whitespace-pre-line">
                          {inq.body}
                        </p>
                      </div>

                      {inq.answer ? (
                        <div className="border-t border-[#2A2A2A] pt-3 space-y-1 bg-[#161616] p-3 text-xs">
                          <div className="flex items-center justify-between text-[#C2A878] font-medium">
                            <span>MIJE&apos; Atelier 답변</span>
                            {inq.answeredAt && (
                              <span className="text-[11px] text-[#9A958D] font-normal">
                                {new Date(inq.answeredAt).toLocaleDateString('ko-KR')}
                              </span>
                            )}
                          </div>
                          <p className="text-[#EDEAE4] leading-relaxed whitespace-pre-line pt-1">
                            {inq.answer}
                          </p>
                        </div>
                      ) : (
                        <div className="text-[11px] text-[#9A958D] italic pt-1">
                          현재 작가가 문의 내용을 확인 중입니다. 답변이 등록되면 본 페이지에서 확인하실 수 있습니다.
                        </div>
                      )}

                      {inq.isPrivate && (
                        <button
                          type="button"
                          onClick={() => toggleUnlockInquiry(inq.id)}
                          className="text-[11px] text-[#9A958D] underline hover:text-[#EDEAE4]"
                        >
                          본문 접기
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-[11px] text-[#9A958D] bg-[#161616]/40 p-2.5 border border-[#2A2A2A]/40">
                      <span className="flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-[#6F6A63]" />
                        비공개 글입니다. 작성자 본인만 내용을 확인하실 수 있습니다.
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleUnlockInquiry(inq.id)}
                        className="text-[#C2A878] hover:underline"
                      >
                        [시연: 열람 토글]
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: FAQ (자주 묻는 질문 아코디언) */}
      {/* ========================================================= */}
      {currentTab === 'faq' && (
        <div className="space-y-4">
          <p className="text-xs text-[#9A958D] pb-2">
            고객님들께서 자주 문의하시는 소재, 배송, 공방 클래스 관련 핵심 안내사항입니다.
          </p>

          <div className="divide-y divide-[#2A2A2A] border-y border-[#2A2A2A]">
            {faqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div key={faq.id} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between text-left text-xs sm:text-sm text-[#EDEAE4] hover:text-[#C2A878] transition-colors min-h-[44px]"
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium pr-4">Q. {faq.question}</span>
                    <span className="text-[#9A958D]">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="pt-3 pb-2 text-xs text-[#9A958D] leading-relaxed animate-fadeIn">
                      <div className="p-4 bg-[#161616] border border-[#2A2A2A] text-[#EDEAE4]/90 space-y-1">
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-6 bg-[#161616] border border-[#2A2A2A] text-center space-y-3 mt-8">
            <h4 className="text-xs font-medium text-[#EDEAE4]">
              원하시는 답변을 찾지 못하셨나요?
            </h4>
            <p className="text-xs text-[#9A958D]">
              1:1 맞춤 문의 탭에서 작가에게 직접 문의를 남겨주시면 정성껏 답변드리겠습니다.
            </p>
            <button
              type="button"
              onClick={() => handleTabChange('inquiry')}
              className="px-5 py-2.5 border border-[#C2A878] text-xs text-[#C2A878] hover:bg-[#C2A878] hover:text-[#0E0E0E] transition-colors"
            >
              1:1 문의 작성하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default CommunityPage;
