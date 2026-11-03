import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { getPosts } from '../services/api';
import { Post } from '../types';
import SectionTitle from '../components/common/SectionTitle';
import { usePageMeta } from '../hooks/usePageMeta';

export const JournalPage: React.FC = () => {
  usePageMeta('공지', '아틀리에 소식, 공방 오픈 일정, 은 주얼리 관리 가이드를 전합니다.');

  const [notices, setNotices] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getPosts('notice');
        setNotices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 pb-28 max-w-4xl">
      <SectionTitle
        en="JOURNAL"
        ko="아틀리에 공지 및 소식"
        description="MIJE'의 새로운 소식과 공방 운영 일정, 은세공에 관한 이야기를 전합니다."
      />

      {loading ? (
        <div className="py-24 text-center text-xs text-[#9A958D]">
          공지 사항을 불러오는 중입니다...
        </div>
      ) : notices.length === 0 ? (
        <div className="py-24 text-center text-xs text-[#9A958D]">
          등록된 공지 사항이 없습니다.
        </div>
      ) : (
        <div className="divide-y divide-[#2A2A2A] border-y border-[#2A2A2A]">
          {notices.map((notice) => (
            <article key={notice.id} className="py-8 group">
              <Link
                to={`/journal/${notice.id}`}
                className="block space-y-3 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2A878]"
              >
                <div className="flex items-center gap-3 text-xs text-[#9A958D]">
                  <span className="text-[#C2A878] font-serif uppercase tracking-widest">NOTICE</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#9A958D]" />
                    {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl text-[#EDEAE4] font-medium group-hover:text-[#C2A878] transition-colors leading-snug">
                  {notice.title}
                </h2>

                <p className="text-xs sm:text-sm text-[#9A958D] line-clamp-2 leading-relaxed">
                  {notice.body}
                </p>

                <div className="pt-2 flex items-center gap-1.5 text-xs text-[#EDEAE4] group-hover:text-[#C2A878] transition-colors">
                  <span>전문 읽기</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
export default JournalPage;
