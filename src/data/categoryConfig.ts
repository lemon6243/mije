/**
 * 홈 대표 3대 카테고리 카드(기성품, 핸드메이드, 은공방 클래스) 이미지 및 구도 설정
 * 쉽게 교체할 수 있도록 한 곳에서 통합 관리합니다.
 */

export interface CategoryCardSetting {
  image: string;
  objectPosition: string;
  alt: string;
}

export const CATEGORY_CARD_CONFIG: Record<'readyMade' | 'handmade' | 'atelier', CategoryCardSetting> = {
  readyMade: {
    image: '/images/mije-hero-mobile.png',
    objectPosition: 'center 25%',
    alt: '기성품 컬렉션 (블랙 슬레이트와 실버 주얼리)',
  },
  handmade: {
    image: '/images/mije-hero-mobile.png',
    objectPosition: 'center 60%',
    alt: '핸드메이드 1점 제작 작품 (은 목걸이와 반지)',
  },
  atelier: {
    image: '/images/mije-hero-mobile.png',
    objectPosition: 'center 90%',
    alt: '은공방 클래스 (은 세공 작품)',
  },
};
