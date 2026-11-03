/**
 * MIJE' - Initial Mock Data
 * 주의: 실제 소재·함량 표기(Silver 925 등) 및 제품 규격은 실제 운영 시 사실에 맞게 교체 필요합니다.
 * 이미지 주소는 데이터의 images 필드로 관리하며, 값이 비어 있으면 #161616 배경에 #2A2A2A 색상의 MIJE' 로고가 표시됩니다.
 */

import { Product, ClassItem, ClassSession, Post, FaqItem, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // --- READY-MADE (기성품 8개: 귀걸이 2, 목걸이 2, 반지 2, 팔찌 2) ---
  {
    id: 'p-rm-1',
    slug: 'silver-facet-drop-earring',
    type: 'ready-made',
    category: 'earring',
    name: '파셋 드롭 실버 이어링',
    price: 48000,
    material: 'Silver 925',
    weight: '약 2.4g (한 쌍)',
    description: '단면에 빛이 은은하게 맺히도록 다각면을 정밀하게 연마한 드롭 이어링입니다. 착용 시 움직임에 따라 절제된 광택을 냅니다.',
    details: [
      '소재: 정은 925 (Sterling Silver)',
      '사이즈: 총 길이 약 22mm, 단면 너비 약 3mm',
      '클러치: 실버 925 버터플라이 클러치 동봉',
      '제조국: 대한민국 (MIJE Atelier)'
    ],
    careGuide: '착용 후 부드러운 전용 천으로 유분기를 닦아 지퍼백에 밀봉 보관하십시오. 변색 시 은 세척액 또는 폴리싱 천을 사용하십시오.',
    images: [],
    isVisible: true,
    options: [
      { id: 'opt-rm-1-1', productId: 'p-rm-1', label: '단일 규격 (한 쌍)', stock: 8 },
    ],
    createdAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'p-rm-2',
    slug: 'pure-bar-stud-earring',
    type: 'ready-made',
    category: 'earring',
    name: '바 스터드 실버 이어링',
    price: 36000,
    material: 'Silver 925',
    weight: '약 1.6g (한 쌍)',
    description: '군더더기 없는 직선형 바 형태로 단정하고 모던한 인상을 주는 기본 스터드 이어링입니다. 데일리 착용에 적합합니다.',
    details: [
      '소재: 정은 925 (Sterling Silver)',
      '사이즈: 길이 12mm x 두께 1.5mm',
      '마감: 무광 헤어라인 텍스처'
    ],
    careGuide: '습기와 땀에 장시간 노출되지 않도록 주의해 주십시오.',
    images: [],
    isVisible: true,
    options: [
      { id: 'opt-rm-2-1', productId: 'p-rm-2', label: '단일 규격 (한 쌍)', stock: 5 },
    ],
    createdAt: '2026-10-16T11:00:00Z',
  },
  {
    id: 'p-rm-3',
    slug: 'minimal-oval-chain-necklace',
    type: 'ready-made',
    category: 'necklace',
    name: '오벌 체인 실버 네클리스',
    price: 68000,
    material: 'Silver 925',
    weight: '약 5.2g',
    description: '타원형의 균형 잡힌 마디가 목선을 따라 부드럽게 흐르는 클래식 체인 목걸이입니다. 단독 착용 또는 레이어드에 조화롭습니다.',
    details: [
      '소재: 정은 925 (Sterling Silver)',
      '체인 길이: 42cm (연장체인 3cm 포함)',
      '잠금 장치: 랍스터 잠금쇠'
    ],
    careGuide: '보관 시 체인이 엉키지 않도록 고리에 걸어두거나 평평하게 펴서 보관하십시오.',
    images: [],
    isVisible: true,
    options: [
      { id: 'opt-rm-3-1', productId: 'p-rm-3', label: '42cm (기본)', stock: 7 },
      { id: 'opt-rm-3-2', productId: 'p-rm-3', label: '45cm (+3cm)', stock: 3 },
    ],
    createdAt: '2026-10-18T14:20:00Z',
  },
  {
    id: 'p-rm-4',
    slug: 'cylinder-pendant-necklace',
    type: 'ready-made',
    category: 'necklace',
    name: '실린더 펜던트 네클리스',
    price: 74000,
    material: 'Silver 925',
    weight: '약 6.1g',
    description: '속을 비우지 않은 솔리드 실버 원통형 펜던트로 묵직한 중량감과 유연한 실루엣을 전합니다.',
    details: [
      '소재: 정은 925',
      '펜던트 크기: 높이 15mm, 직경 4mm',
      '체인: 1.2mm 볼체인 45cm'
    ],
    careGuide: '마른 천으로 주기적으로 가볍게 문질러 주시면 은 본연의 은은한 광이 유지됩니다.',
    images: [],
    isVisible: true,
    options: [
      { id: 'opt-rm-4-1', productId: 'p-rm-4', label: '45cm 단일', stock: 4 },
    ],
    createdAt: '2026-10-20T10:00:00Z',
  },
  {
    id: 'p-rm-5',
    slug: 'plain-flat-band-ring',
    type: 'ready-made',
    category: 'ring',
    name: '플랫 밴드 실버 링 (3mm)',
    price: 42000,
    material: 'Silver 925',
    weight: '약 3.1g (13호 기준)',
    description: '안쪽을 편안하게 굴림 처리하여 일상 속에서 종일 착용해도 편안한 표준 플랫 밴드 링입니다.',
    details: [
      '소재: 정은 925 (Sterling Silver)',
      '밴드 너비: 약 3.0mm, 두께 약 1.6mm',
      '마감: 은은한 새틴 브러시'
    ],
    careGuide: '생활 스크래치는 시간이 지나며 자연스러운 빈티지 파티나를 형성합니다.',
    images: [],
    isVisible: true,
    options: [
      { id: 'opt-rm-5-1', productId: 'p-rm-5', label: '9호', stock: 3 },
      { id: 'opt-rm-5-2', productId: 'p-rm-5', label: '11호', stock: 4 },
      { id: 'opt-rm-5-3', productId: 'p-rm-5', label: '13호', stock: 0 },
      { id: 'opt-rm-5-4', productId: 'p-rm-5', label: '15호', stock: 2 },
    ],
    createdAt: '2026-10-22T13:30:00Z',
  },
  {
    id: 'p-rm-6',
    slug: 'soft-twist-ring',
    type: 'ready-made',
    category: 'ring',
    name: '소프트 트위스트 실버 링',
    price: 46000,
    material: 'Silver 925',
    weight: '약 2.9g (11호 기준)',
    description: '은선을 서서히 꼬아 곡면마다 부드러운 음영이 생기도록 성형한 감각적인 꼬임 반지입니다.',
    details: [
      '소재: 정은 925',
      '너비: 약 2.5mm',
      '표면: 부드러운 유광 마감'
    ],
    careGuide: '홈 사이에 낀 먼지는 미온수에 중성세제를 풀어 부드러운 솔로 씻어내세요.',
    images: [],
    isVisible: true,
    options: [
      { id: 'opt-rm-6-1', productId: 'p-rm-6', label: '11호', stock: 3 },
      { id: 'opt-rm-6-2', productId: 'p-rm-6', label: '13호', stock: 5 },
      { id: 'opt-rm-6-3', productId: 'p-rm-6', label: '15호', stock: 2 },
    ],
    createdAt: '2026-10-24T15:00:00Z',
  },
  {
    id: 'p-rm-7',
    slug: 'solid-round-cuff-bracelet',
    type: 'ready-made',
    category: 'bracelet',
    name: '솔리드 라운드 뱅글',
    price: 89000,
    material: 'Silver 925',
    weight: '약 12.5g',
    description: '손목 곡선에 맞추어 유기적으로 성형된 개방형 뱅글입니다. 단단하고 순수한 은의 중량감이 손목을 안정되게 감쌉니다.',
    details: [
      '소재: 정은 925 (Sterling Silver)',
      '두께: 3.5mm 솔리드 와이어',
      '안쪽 둘레: 약 15.5cm (오픈 커프 구조로 미세 조절 가능)'
    ],
    careGuide: '과도하게 벌리거나 오므리면 형태가 변형될 수 있으니 부드럽게 착용하십시오.',
    images: [],
    isVisible: true,
    options: [
      { id: 'opt-rm-7-1', productId: 'p-rm-7', label: 'S (손목 둘레 14~15cm)', stock: 2 },
      { id: 'opt-rm-7-2', productId: 'p-rm-7', label: 'M (손목 둘레 15.5~17cm)', stock: 4 },
    ],
    createdAt: '2026-10-25T16:00:00Z',
  },
  {
    id: 'p-rm-8',
    slug: 'box-chain-link-bracelet',
    type: 'ready-made',
    category: 'bracelet',
    name: '슬림 박스 체인 브레이슬릿',
    price: 52000,
    material: 'Silver 925',
    weight: '약 4.0g',
    description: '사각의 각진 마디가 촘촘히 엮여 매끄러운 광택을 자랑하는 박스 체인 팔찌입니다.',
    details: [
      '소재: 정은 925',
      '길이: 16cm + 2.5cm 보조 체인',
      '체인 폭: 약 1.8mm'
    ],
    careGuide: '온천수, 유황 성분, 락스 등 화학물질과의 접촉을 피해주십시오.',
    images: [],
    isVisible: true,
    options: [
      { id: 'opt-rm-8-1', productId: 'p-rm-8', label: 'Free (16~18.5cm)', stock: 6 },
    ],
    createdAt: '2026-10-26T12:00:00Z',
  },

  // --- HANDMADE (핸드메이드 6개: 1점/소량 제작, 제작 소요일, 공방 작업 과정 포함) ---
  {
    id: 'p-hm-1',
    slug: 'hammered-organic-signet-ring',
    type: 'handmade',
    category: 'ring',
    name: '망치 타흔 오가닉 인장 링',
    price: 98000,
    material: 'Silver 925 / 손망치 단조',
    weight: '약 7.2g',
    description: '불과 망치로 순은을 여러 차례 달구고 내리쳐 완성한 인장 반지입니다. 두드림의 세기와 방향이 매 순간 달라 세상에 단 하나뿐인 표면 질감을 가집니다.',
    details: [
      '제작 방식: 핸드 헤머링(단조) & 왁스 카빙 후가공',
      '상단 평면 크기: 약 12mm x 9mm',
      '마감: 앤틱 매트 착색 및 표면 폴리싱'
    ],
    careGuide: '수작업 특성상 타흔의 깊이와 형태가 제품마다 미세하게 다를 수 있습니다.',
    images: [],
    leadTimeDays: 7,
    isLimited: true,
    craftStory: '단조 기법은 은의 결정 구조를 조밀하게 만들어 가공 경화에 의한 높은 내구성을 부여합니다. 작가의 작업대 위에서 300회 이상의 망치질을 거칩니다.',
    processImages: [],
    isVisible: true,
    options: [
      { id: 'opt-hm-1-1', productId: 'p-hm-1', label: '13호 (1점 제작 한정)', stock: 1 },
      { id: 'opt-hm-1-2', productId: 'p-hm-1', label: '15호 (맞춤 제작)', stock: 2 },
    ],
    createdAt: '2026-10-27T10:00:00Z',
  },
  {
    id: 'p-hm-2',
    slug: 'carved-melt-texture-pendant',
    type: 'handmade',
    category: 'necklace',
    name: '멜트 텍스처 은괴 펜던트',
    price: 115000,
    material: 'Silver 925 / 고열 용해 성형',
    weight: '약 9.8g',
    description: '순은 조각을 도가니에서 순간적으로 녹여 떨어뜨릴 때 형성되는 비정형의 자연스러운 덩어리감을 그대로 살린 핸드메이드 펜던트입니다.',
    details: [
      '제작 방식: 직접 용해 및 텍스처 수작업',
      '크기: 약 18mm x 14mm (수공예 특성상 개체마다 상이)',
      '체인: 앤틱 착색 빈티지 롤로 체인 50cm 포함'
    ],
    careGuide: '자연스러운 은 고유의 음영을 살리기 위해 음각 부위는 앤틱 착색되어 있습니다.',
    images: [],
    leadTimeDays: 8,
    isLimited: true,
    craftStory: '인위적인 틀을 쓰지 않고 섭씨 961도 은의 융점 직전 표면 장력을 포착하여 빚어냅니다.',
    processImages: [],
    isVisible: true,
    options: [
      { id: 'opt-hm-2-1', productId: 'p-hm-2', label: '단일 작품 (1점 제작)', stock: 1 },
    ],
    createdAt: '2026-10-28T11:00:00Z',
  },
  {
    id: 'p-hm-3',
    slug: 'chiseled-wide-silver-cuff',
    type: 'handmade',
    category: 'bracelet',
    name: '끌 텍스처 와이드 실버 커프',
    price: 168000,
    material: 'Silver 925 / 정두드림 조각',
    weight: '약 24.0g',
    description: '두터운 은판에 손정(Chisel)을 대고 한 선 한 선 정성껏 새겨 넣은 와이드 커프입니다. 시간과 호흡이 축적된 텍스처를 지닙니다.',
    details: [
      '판 폭: 약 12mm, 두께 약 2.2mm',
      '소재: 고순도 정은 925',
      '소량 한정 제작'
    ],
    careGuide: '강한 충격을 피하고 착용 후 밀봉 보관해 주세요.',
    images: [],
    leadTimeDays: 10,
    isLimited: true,
    craftStory: '옛 금속공예 장인들의 정자국 기법을 재해석하여 은의 차가움에 손길의 온도를 더합니다.',
    processImages: [],
    isVisible: true,
    options: [
      { id: 'opt-hm-3-1', productId: 'p-hm-3', label: 'M (15~16.5cm 손목)', stock: 2 },
      { id: 'opt-hm-3-2', productId: 'p-hm-3', label: 'L (17~18.5cm 손목)', stock: 1 },
    ],
    createdAt: '2026-10-29T14:00:00Z',
  },
  {
    id: 'p-hm-4',
    slug: 'sculpted-crag-stud-earring',
    type: 'handmade',
    category: 'earring',
    name: '암석 단면 실버 스터드',
    price: 58000,
    material: 'Silver 925',
    weight: '약 3.6g (한 쌍)',
    description: '거친 절벽의 바위 표면을 모티브로 손조각하여 빛이 닿을 때마다 깊은 음영 대비를 드러냅니다.',
    details: [
      '크기: 약 9mm x 7mm',
      '포스트: 실버 925 10mm 침'
    ],
    careGuide: '미세한 굴곡이 많으므로 부드러운 브러시로 정기적인 관리를 권장합니다.',
    images: [],
    leadTimeDays: 5,
    isLimited: false,
    craftStory: '하드 왁스를 조각도로 깎아내는 정밀 왁스 카빙 기법으로 원형을 완성한 후 은 주조 과정을 거쳤습니다.',
    isVisible: true,
    options: [
      { id: 'opt-hm-4-1', productId: 'p-hm-4', label: '기본 (한 쌍)', stock: 3 },
    ],
    createdAt: '2026-10-30T09:30:00Z',
  },
  {
    id: 'p-hm-5',
    slug: 'wave-flow-silver-ring',
    type: 'handmade',
    category: 'ring',
    name: '유영 비대칭 물결 링',
    price: 88000,
    material: 'Silver 925',
    weight: '약 5.1g (12호 기준)',
    description: '손가락 관절의 곡선에 유기적으로 감기는 비대칭 웨이브 링입니다. 착용하는 방향에 따라 전혀 다른 조형미를 선사합니다.',
    details: [
      '너비: 가장 굵은 부분 약 6mm, 얇은 부분 약 2.5mm',
      '1점 제작 작품'
    ],
    careGuide: '손으로 만지며 은의 촉감을 편안하게 즐기실 수 있도록 매끄러운 곡선 연마를 마쳤습니다.',
    images: [],
    leadTimeDays: 7,
    isLimited: true,
    craftStory: '물방울이 표면을 타고 흐르는 궤적을 왁스 상에서 핸드 모델링하여 형상화했습니다.',
    isVisible: true,
    options: [
      { id: 'opt-hm-5-1', productId: 'p-hm-5', label: '12호 (1점 제작 한정)', stock: 1 },
    ],
    createdAt: '2026-10-31T16:00:00Z',
  },
  {
    id: 'p-hm-6',
    slug: 'folded-leaf-silver-brooch',
    type: 'handmade',
    category: 'etc',
    name: '잎맥 접힘 실버 오브제 브로치',
    price: 132000,
    material: 'Silver 925 / 은판 롤링 성형',
    weight: '약 11.2g',
    description: '얇은 은판을 종이처럼 접고 두드려 나뭇잎의 주름을 형상화한 작품형 브로치입니다. 코트나 니트에 은은한 포인트를 완성합니다.',
    details: [
      '크기: 길이 약 48mm, 폭 약 18mm',
      '뒷면: 회전식 안전 핀 장치'
    ],
    careGuide: '얇은 부분이 눌려 변형되지 않도록 착용 및 탈착 시 주의해 주십시오.',
    images: [],
    leadTimeDays: 10,
    isLimited: true,
    craftStory: '전통 포밍(Forming) 기술을 통해 평면 은판에 입체적인 굴곡과 유연한 장력을 부여했습니다.',
    isVisible: true,
    options: [
      { id: 'opt-hm-6-1', productId: 'p-hm-6', label: '단일 규격 (1점 제작)', stock: 1 },
    ],
    createdAt: '2026-11-01T11:00:00Z',
  },
];

// --- 은공방 클래스 (3종: 반지 만들기, 펜던트 만들기, 커플링 만들기) ---
export const INITIAL_CLASSES: ClassItem[] = [
  {
    id: 'cls-1',
    slug: 'custom-silver-ring-class',
    name: '나만의 시그니처 실버 링 클래스',
    price: 75000,
    durationMin: 120,
    description: '은선을 직접 톱질하고 땜질하며, 두드림 타흔 기법으로 하나뿐인 반지를 완성하는 입문 체험 클래스입니다.',
    detailedIntro: '금속공예가 처음이신 분도 전문 작가의 1:1 세심한 지도 아래 안전하게 자신만의 반지를 완성할 수 있습니다. 톱질, 줄질, 붕사 땜질, 망치 텍스처, 각인 등 전통 은세공의 전 과정을 직접 경험합니다.',
    materials: ['Silver 925 사각/평선 은선', '실버 땜 및 붕사', '금속 전용 사포 및 광약'],
    curriculum: [
      '호수 측정 및 은선 칫수 재단 (톱질)',
      '줄질을 통한 단면 정돈 및 은땜 접합 작업',
      '지환봉과 쇠망치를 활용한 원형 성형 및 타흔 텍스처',
      '핸드피스를 이용한 단계별 샌딩 및 광택 마감',
      '이니셜/숫자 손각인(선택) 및 보증서 패키징'
    ],
    cancelPolicy: '수업일 기준 3일 전까지 100% 취소 및 전액 환불 가능, 2일 전 50%, 전일 및 당일 취소는 재료 준비로 인해 변경/환불이 불가합니다.',
    images: [],
    included: ['정은 925 원자재 일체', '공방 전문 공구 및 보호장비 대여', '완성작 전용 패키지 및 보증서', '음료 1잔 제공'],
    maxCapacityPerSession: 4
  },
  {
    id: 'cls-2',
    slug: 'organic-pendant-metalcraft-class',
    name: '오가닉 실버 펜던트 조형 클래스',
    price: 85000,
    durationMin: 150,
    description: '불과 조각도를 활용하여 자유로운 형태의 은 조각 펜던트를 빚어내고 목걸이로 완성하는 심화 클래스입니다.',
    detailedIntro: '정형화된 형태를 벗어나 은이 녹아 흐르는 순간의 텍스처를 포착하거나, 은판 위에 자유로운 선을 새겨 자신만의 조형 언어를 표현합니다. 완성된 펜던트에 어울리는 체인까지 결합하여 당일 수령합니다.',
    materials: ['Silver 925 주괴/판재', '925 실버 기본 체인(45cm 또는 50cm)', '유화 가리 착색액'],
    curriculum: [
      '조형 스케치 및 텍스처 콘셉트 상의',
      '은판 릴리프 작업 또는 토치 용해 텍스처 기법',
      '오링 결합을 위한 구멍 뚫기 및 용접',
      '앤틱 흑색 유화 착색 및 하이라이트 폴리싱',
      '체인 결합 및 착용 테스팅'
    ],
    cancelPolicy: '수업일 기준 3일 전까지 100% 환불 가능, 2일 전 50%, 전일 및 당일 취소/환불 불가.',
    images: [],
    included: ['실버 925 펜던트 원자재', '실버 925 체인 1점', '공구 대여 및 고급 파우치', '음료 제공'],
    maxCapacityPerSession: 4
  },
  {
    id: 'cls-3',
    slug: 'atelier-couples-matching-ring-class',
    name: '아틀리에 커플링 & 우정 링 클래스 (2인 기준)',
    price: 150000,
    durationMin: 150,
    description: '서로의 반지를 직접 두드려 만들어주며 특별한 시간과 온기를 담아내는 프라이빗 감성 클래스입니다.',
    detailedIntro: '2인이 한 팀이 되어 서로의 손가락 둘레를 재고, 원하는 너비와 마감(무광/유광/망치흔)을 조율합니다. 안쪽에 기념일이나 서로의 이름을 각인하며 소중한 기억을 은 위에 새깁니다.',
    materials: ['Silver 925 맞춤형 은선 (3~5mm 폭)', '정밀 각인 폰트 펀치', '고급 2구 원목 케이스'],
    curriculum: [
      '서로의 반지 치수 측정 및 디자인 선택',
      '은선 절단 및 열풀림(Annealing)',
      '은땜 결합 및 지환봉 타작',
      '내부/외부 손각인 타각 체험',
      '매트 또는 미러 광택 마감',
      '원목 링 박스 패키징 및 즉석 사진 촬영'
    ],
    cancelPolicy: '수업일 기준 3일 전까지 100% 환불, 2일 전 50%, 전일 및 당일 취소/환불 불가.',
    images: [],
    included: ['2인 정은 925 원자재', '내경 각인 무료', '프리미엄 2구 원목 반지 케이스', '음료 2잔'],
    maxCapacityPerSession: 4
  }
];

// 4주치(28일) 세션 생성 함수
export function generateInitialSessions(): ClassSession[] {
  const sessions: ClassSession[] = [];
  const today = new Date();
  
  for (let i = 1; i <= 28; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    
    INITIAL_CLASSES.forEach((cls) => {
      const reserved1 = (i % 7 === 1) ? 4 : (i % 3 === 0 ? 2 : (i % 5 === 0 ? 3 : 0));
      sessions.push({
        id: `sess-${cls.id}-${dateStr}-1100`,
        classId: cls.id,
        className: cls.name,
        date: dateStr,
        time: '11:00',
        capacity: 4,
        reserved: Math.min(4, reserved1)
      });

      const reserved2 = (i % 7 === 3) ? 4 : (i % 4 === 0 ? 1 : 0);
      sessions.push({
        id: `sess-${cls.id}-${dateStr}-1500`,
        classId: cls.id,
        className: cls.name,
        date: dateStr,
        time: '15:00',
        capacity: 4,
        reserved: Math.min(4, reserved2)
      });
    });
  }
  return sessions;
}

// --- 공지사항 (Journal 3건) ---
export const INITIAL_NOTICES: Post[] = [
  {
    id: 'post-notice-1',
    board: 'notice',
    title: 'MIJE\' 아틀리에 쇼룸 오픈 및 은공방 클래스 운영 안내',
    body: '정은(Silver 925) 본연의 묵직한 물성과 미니멀한 조형을 탐구하는 MIJE\'의 온라인 쇼룸과 은공방 아틀리에가 문을 열었습니다. 일상에 자연스럽게 스며드는 실버 주얼리와 함께, 작업대 위에서 직접 금속을 다듬는 공방 체험 클래스를 함께 선보입니다. 쇼룸 방문 및 클래스는 사전 예약제로 운영됩니다.',
    author: 'MIJE\' Atelier',
    createdAt: '2026-10-10T10:00:00Z',
  },
  {
    id: 'post-notice-2',
    board: 'notice',
    title: '핸드메이드 1점 제작 주얼리 주문 및 제작 소요일 안내',
    body: '핸드메이드 카테고리의 제품은 작가가 직접 망치질과 불작업을 거쳐 1점 또는 소량으로 제작합니다. 주문 확인 후 발송까지 영업일 기준 약 5~10일이 소요되며, 작업 과정에서 생기는 고유한 타흔과 음영의 차이는 수공예품만의 특별한 가치입니다.',
    author: 'MIJE\' Atelier',
    createdAt: '2026-10-18T14:30:00Z',
  },
  {
    id: 'post-notice-3',
    board: 'notice',
    title: '은 제품 관리 및 보관 요령 (Silver 925 Care Guide)',
    body: '정은 925는 공기 중의 황화수소나 땀, 수분과 반응하여 자연스러운 산화(변색)가 일어납니다. 착용하지 않으실 때는 동봉해 드리는 지퍼백에 밀봉 보관해 주시고, 광택이 흐려졌을 때는 전용 실버 폴리싱 천으로 가볍게 문질러 주시면 은 고유의 부드러운 빛을 되찾을 수 있습니다.',
    author: 'MIJE\' Atelier',
    createdAt: '2026-10-25T11:20:00Z',
  }
];

// --- 고객 후기 (Review 4건) ---
export const INITIAL_REVIEWS: Post[] = [
  {
    id: 'post-rev-1',
    board: 'review',
    title: '망치 타흔 링 실물이 사진보다 훨씬 깊이감 있습니다.',
    body: '표면에 망치로 내리친 결이 아주 섬세하게 잡혀있고, 묵직해서 손가락에 감기는 느낌이 좋습니다. 일반 주얼리 샵에서 볼 수 없는 공방 특유의 분위기가 묻어나서 만족스럽습니다.',
    author: '고객 A',
    rating: 5,
    relatedType: 'product',
    relatedId: 'p-hm-1',
    relatedName: '망치 타흔 오가닉 인장 링',
    createdAt: '2026-10-28T16:00:00Z',
  },
  {
    id: 'post-rev-2',
    board: 'review',
    title: '커플링 클래스 다녀왔습니다. 좋은 추억이 되었습니다.',
    body: '처음엔 톱질이나 땜질이 어렵지 않을까 걱정했는데, 작가님께서 한 단계씩 차분하게 설명해 주셔서 완성도 높은 반지를 만들 수 있었습니다. 각인도 정갈하게 잘 나왔습니다.',
    author: '고객 B',
    rating: 5,
    relatedType: 'class',
    relatedId: 'cls-3',
    relatedName: '아틀리에 커플링 & 우정 링 클래스',
    createdAt: '2026-10-29T19:30:00Z',
  },
  {
    id: 'post-rev-3',
    board: 'review',
    title: '오벌 체인 목걸이 데일리로 매일 착용하고 있습니다.',
    body: '체인 마디마디의 비례감이 너무 얇지도 두껍지도 않아 니트나 셔츠 어디에나 단정하게 잘 어울립니다. 포장도 갤러리 도록처럼 고급스러웠습니다.',
    author: '고객 C',
    rating: 5,
    relatedType: 'product',
    relatedId: 'p-rm-3',
    relatedName: '오벌 체인 실버 네클리스',
    createdAt: '2026-10-30T13:40:00Z',
  },
  {
    id: 'post-rev-4',
    board: 'review',
    title: '반지 만들기 클래스에서 손맛을 제대로 느꼈습니다.',
    body: '금속을 불로 달구고 망치로 두드릴 때 손에 전해지는 울림이 인상적이었습니다. 완성된 반지의 무광 헤어라인 질감이 마음에 듭니다.',
    author: '고객 D',
    rating: 4,
    relatedType: 'class',
    relatedId: 'cls-1',
    relatedName: '나만의 시그니처 실버 링 클래스',
    createdAt: '2026-11-01T15:10:00Z',
  }
];

// --- 1:1 문의 (Inquiry 3건: 답변 완료 & 대기 혼합) ---
export const INITIAL_INQUIRIES: Post[] = [
  {
    id: 'post-inq-1',
    board: 'inquiry',
    title: '반지 호수 맞춤 제작 문의드립니다.',
    body: '플랫 밴드 실버 링을 17호로 주문하고 싶은데 혹시 옵션 외 호수로도 맞춤 제작이 가능한지 여쭙습니다.',
    author: '고객 E',
    isPrivate: true,
    relatedType: 'product',
    relatedId: 'p-rm-5',
    relatedName: '플랫 밴드 실버 링 (3mm)',
    answer: '안녕하세요, MIJE\'입니다. 옵션 외 호수의 경우 핸드메이드 맞춤 작업으로 제작 가능하며, 약 5~7 영업일이 소요됩니다. 주문 시 배송 메모란에 기재해 주시거나 추가 메시지 주시면 정성껏 제작해 드리겠습니다.',
    answeredAt: '2026-10-29T10:30:00Z',
    createdAt: '2026-10-28T21:00:00Z',
  },
  {
    id: 'post-inq-2',
    board: 'inquiry',
    title: '클래스 예약 날짜 및 인원 변경 가능한가요?',
    body: '다음 주 주말 클래스에 1명을 추가하여 총 3명으로 변경할 수 있을지 문의드립니다.',
    author: '고객 F',
    isPrivate: true,
    relatedType: 'class',
    relatedId: 'cls-1',
    relatedName: '나만의 시그니처 실버 링 클래스',
    createdAt: '2026-11-02T09:15:00Z',
  },
  {
    id: 'post-inq-3',
    board: 'inquiry',
    title: '멜트 텍스처 펜던트 비슷한 디자인 맞춤 문의',
    body: '품절된 멜트 펜던트 디자인에서 크기를 조금 더 작게(12mm 내외) 하여 1점 제작이 가능한지 알고 싶습니다.',
    author: '고객 G',
    isPrivate: true,
    relatedType: 'product',
    relatedId: 'p-hm-2',
    relatedName: '멜트 텍스처 은괴 펜던트',
    createdAt: '2026-11-02T14:40:00Z',
  }
];

// --- FAQ (자주 묻는 질문 6건) ---
export const INITIAL_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'product',
    question: 'MIJE\'의 모든 제품은 정은(Silver 925)인가요?',
    answer: '네, MIJE\'에서 선보이는 모든 주얼리는 순도 92.5% 이상의 정은(Sterling Silver 925)을 사용하여 제작됩니다. 알레르기 유발 물질인 니켈이나 납 성분은 일절 사용하지 않으며, 제품마다 925 각인이 되어 있습니다.'
  },
  {
    id: 'faq-2',
    category: 'care',
    question: '은 제품이 변색되었을 때는 어떻게 관리해야 하나요?',
    answer: '은은 자연스럽게 산화되는 귀금속입니다. 변색이 발생했을 때에는 제품과 함께 동봉되는 은 전용 폴리싱 천으로 부드럽게 닦아주시면 본래의 광택을 쉽게 회복할 수 있습니다. 굴곡이 깊거나 앤틱 착색된 제품은 세척액에 담그면 고유의 착색까지 지워질 수 있으므로 천으로만 닦아주십시오.'
  },
  {
    id: 'faq-3',
    category: 'shipping',
    question: '배송 소요 기간과 배송비는 어떻게 되나요?',
    answer: '기성품(Ready-made)은 결제 완료 후 1~2 영업일 이내에 우체국택배로 출고되며, 핸드메이드(Handmade) 제품은 주문 제작 특성상 약 5~10 영업일이 소요됩니다. 70,000원 이상 구매 시 무료 배송이며, 기본 배송비는 3,500원입니다.'
  },
  {
    id: 'faq-4',
    category: 'atelier',
    question: '은공방 클래스는 손재주가 없는 초보자도 참여할 수 있나요?',
    answer: '물론입니다. 클래스는 최대 4명의 소수 정원으로 진행되며, 전문 작가가 톱질부터 땜질, 마감까지 전 과정을 1:1로 밀착 지도합니다. 대부분의 수강생분들이 금속공예를 처음 접하시는 분들이며 완성도 높은 작품을 가져가실 수 있습니다.'
  },
  {
    id: 'faq-5',
    category: 'atelier',
    question: '클래스 취소 및 일정 변경 규정은 어떻게 되나요?',
    answer: '수업일 기준 3일 전까지는 취소 및 100% 환불이 가능합니다. 2일 전 취소 시 50% 환불, 수업 전일 및 당일에는 예약에 맞춰 귀금속 원자재 재단 및 사전 세팅이 완료되므로 취소나 일정 변경이 불가하오니 신중한 예약을 부탁드립니다.'
  },
  {
    id: 'faq-6',
    category: 'product',
    question: '반지 호수를 잘못 주문했을 때 사이즈 수선(리사이징)이 가능한가요?',
    answer: '민자 플랫 밴드 링의 경우 ±1~2호수 내외의 리사이징이 가능합니다(왕복 배송비 및 소정의 수선비 발생). 단, 패턴이나 텍스처가 연속되는 디자인 또는 인장 반지는 수선이 어려울 수 있으니 주문 전 공방 문의를 권장합니다.'
  }
];

// --- 시연용 주문 3건 (상태 다양화: 결제완료, 배송중, 배송완료) ---
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNo: 'ORD-20261028-001',
    customerName: '김민준',
    phone: '010-1234-5678',
    address: '서울특별시 용산구 한남대로 42길 15',
    detailAddress: '201호',
    postalCode: '04415',
    shippingNote: '부재 시 문 앞에 놓아주세요.',
    status: 'delivered',
    items: [
      {
        productId: 'p-rm-3',
        productName: '오벌 체인 실버 네클리스',
        productSlug: 'minimal-oval-chain-necklace',
        productType: 'ready-made',
        optionId: 'opt-rm-3-1',
        optionLabel: '42cm (기본)',
        price: 68000,
        quantity: 1,
        image: ''
      }
    ],
    totalPrice: 68000,
    paymentMethod: '신용/체크카드',
    shipment: {
      orderId: 'ord-1001',
      carrier: '우체국택배',
      trackingNo: '6892301948123',
      trackingUrl: 'https://service.epost.go.kr',
      shippedAt: '2026-10-29T10:00:00Z'
    },
    createdAt: '2026-10-28T14:20:00Z'
  },
  {
    id: 'ord-1002',
    orderNo: 'ORD-20261031-002',
    customerName: '이서연',
    phone: '010-9876-5432',
    address: '부산광역시 해운대구 달맞이길 117',
    detailAddress: '102동 504호',
    postalCode: '48117',
    shippingNote: '배송 전 연락 바랍니다.',
    status: 'shipping',
    items: [
      {
        productId: 'p-rm-1',
        productName: '파셋 드롭 실버 이어링',
        productSlug: 'silver-facet-drop-earring',
        productType: 'ready-made',
        optionId: 'opt-rm-1-1',
        optionLabel: '단일 규격 (한 쌍)',
        price: 48000,
        quantity: 1,
        image: ''
      },
      {
        productId: 'p-rm-5',
        productName: '플랫 밴드 실버 링 (3mm)',
        productSlug: 'plain-flat-band-ring',
        productType: 'ready-made',
        optionId: 'opt-rm-5-2',
        optionLabel: '11호',
        price: 42000,
        quantity: 1,
        image: ''
      }
    ],
    totalPrice: 90000,
    paymentMethod: '무통장 입금',
    shipment: {
      orderId: 'ord-1002',
      carrier: '우체국택배',
      trackingNo: '6892301988231',
      trackingUrl: 'https://service.epost.go.kr',
      shippedAt: '2026-11-01T09:30:00Z'
    },
    createdAt: '2026-10-31T11:00:00Z'
  },
  {
    id: 'ord-1003',
    orderNo: 'ORD-20261102-003',
    customerName: '박지훈',
    phone: '010-5555-7777',
    address: '경기도 성남시 분당구 판교역로 166',
    detailAddress: '7층',
    postalCode: '13529',
    shippingNote: '경비실에 맡겨주세요.',
    status: 'payment_complete',
    items: [
      {
        productId: 'p-hm-1',
        productName: '망치 타흔 오가닉 인장 링',
        productSlug: 'hammered-organic-signet-ring',
        productType: 'handmade',
        optionId: 'opt-hm-1-1',
        optionLabel: '13호 (1점 제작 한정)',
        price: 98000,
        quantity: 1,
        image: ''
      }
    ],
    totalPrice: 98000,
    paymentMethod: '카카오페이',
    createdAt: '2026-11-02T14:10:00Z'
  }
];

export const INITIAL_RESERVATIONS = [
  {
    id: 'res-1',
    reservationNo: 'RES-20261105-01',
    sessionId: 'sess-cls-1-demo',
    classId: 'cls-1',
    className: '나만의 시그니처 실버 링 클래스',
    sessionDate: '2026-11-05',
    sessionTime: '11:00',
    name: '정유진',
    phone: '010-2345-6789',
    headcount: 2,
    totalPrice: 150000,
    status: 'confirmed' as const,
    notes: '은공방 첫 방문입니다.',
    createdAt: '2026-11-01T10:00:00Z'
  }
];
