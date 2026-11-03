import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Share2, Check } from 'lucide-react';
import { getPostById } from '../services/api';
import { Post } from '../types';
import { usePageMeta } from '../hooks/usePageMeta';

export const JournalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        const found = await getPostById(id);
        setPost(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  usePageMeta(post ? post.title : '공지 상세', post?.body.slice(0, 100));

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-24 text-center text-xs text-[#9A958D]">
        공지 내용을 불러오는 중입니다...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-6 py-24 text-center space-y-4">
        <h2 className="text-lg text-[#EDEAE4]">존재하지 않거나 삭제된 공지입니다.</h2>
        <Link to="/journal" className="px-4 py-2 border border-[#2A2A2A] text-xs text-[#EDEAE4]">
          공지 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 pb-28 max-w-3xl">
      {/* Back button */}
      <div className="mb-8">
        <Link
          to="/journal"
          className="inline-flex items-center gap-2 text-xs text-[#9A958D] hover:text-[#EDEAE4] transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>공지 목록으로</span>
        </Link>
      </div>

      <article className="space-y-8">
        {/* Header */}
        <header className="border-b border-[#2A2A2A] pb-6 space-y-3">
          <div className="flex items-center gap-3 text-xs text-[#9A958D]">
            <span className="text-[#C2A878] font-serif uppercase tracking-widest">NOTICE</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#9A958D]" />
              {new Date(post.createdAt).toLocaleDateString('ko-KR')}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl text-[#EDEAE4] font-medium leading-snug">
            {post.title}
          </h1>

          <div className="flex items-center justify-between text-xs text-[#9A958D] pt-2">
            <span>작성: {post.author}</span>
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 hover:text-[#EDEAE4] min-h-[36px]"
              aria-label="공유 링크 복사"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#C2A878]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? '링크 복사됨' : '공유하기'}</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="text-sm text-[#EDEAE4]/90 leading-loose whitespace-pre-line py-4">
          {post.body}
        </div>

        {/* Footer Navigation */}
        <div className="pt-10 border-t border-[#2A2A2A] flex justify-between items-center">
          <Link
            to="/journal"
            className="px-5 py-2.5 border border-[#2A2A2A] hover:border-[#C2A878] text-xs text-[#EDEAE4] transition-colors min-h-[44px] flex items-center"
          >
            목록으로 돌아가기
          </Link>
          <Link
            to="/community?tab=inquiry"
            className="text-xs text-[#C2A878] hover:underline min-h-[44px] flex items-center"
          >
            궁금한 점 문의하기
          </Link>
        </div>
      </article>
    </div>
  );
};
export default JournalDetailPage;
