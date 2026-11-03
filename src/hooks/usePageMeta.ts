import { useEffect } from 'react';

/**
 * 페이지별 타이틀 및 메타 디스크립션 관리 훅
 * 형식: "페이지명 | MIJE'"
 */
export function usePageMeta(pageTitle: string, description?: string) {
  useEffect(() => {
    const formattedTitle = pageTitle ? `${pageTitle} | MIJE'` : "MIJE'";
    document.title = formattedTitle;

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);

      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute('content', description);
      }

      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', formattedTitle);
      }
    }
  }, [pageTitle, description]);
}
