/**
 * MIJE' Service Layer
 * 
 * 모든 데이터 접근은 이 서비스 함수들을 거쳐 Promise를 반환합니다.
 * 실제 DB(Supabase) 연동 시 이 내부 구현만 Supabase 클라이언트 호출로 교체합니다.
 */

import {
  Product,
  ClassItem,
  ClassSession,
  Reservation,
  Order,
  OrderStatus,
  Post,
  FaqItem,
} from '../types';

import {
  INITIAL_PRODUCTS,
  INITIAL_CLASSES,
  generateInitialSessions,
  INITIAL_NOTICES,
  INITIAL_REVIEWS,
  INITIAL_INQUIRIES,
  INITIAL_FAQS,
  INITIAL_ORDERS,
  INITIAL_RESERVATIONS,
} from '../data/mockData';

// LocalStorage 키 (v2: brand assets and clean placeholder migration)
const STORAGE_KEYS = {
  PRODUCTS: 'mije_products_v2',
  CLASSES: 'mije_classes_v2',
  SESSIONS: 'mije_sessions_v2',
  RESERVATIONS: 'mije_reservations_v2',
  ORDERS: 'mije_orders_v2',
  POSTS: 'mije_posts_v2',
  FAQS: 'mije_faqs_v2',
};

// Safe JSON Parse helper
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or disabled
  }
}

// In-memory singletons initialized from storage or defaults
let memoryProducts: Product[] = loadFromStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
let memoryClasses: ClassItem[] = loadFromStorage(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
let memorySessions: ClassSession[] = loadFromStorage(STORAGE_KEYS.SESSIONS, generateInitialSessions());
let memoryReservations: Reservation[] = loadFromStorage(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS);
let memoryOrders: Order[] = loadFromStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
let memoryPosts: Post[] = loadFromStorage(STORAGE_KEYS.POSTS, [
  ...INITIAL_NOTICES,
  ...INITIAL_REVIEWS,
  ...INITIAL_INQUIRIES,
]);
let memoryFaqs: FaqItem[] = loadFromStorage(STORAGE_KEYS.FAQS, INITIAL_FAQS);

// Simulate network latency (50~150ms for smooth demo feel)
const delay = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms));

// ==========================================
// 1. PRODUCTS
// ==========================================

export async function getProducts(params?: {
  type?: 'ready-made' | 'handmade';
  category?: string;
  sort?: string;
  search?: string;
}): Promise<Product[]> {
  await delay();
  let list = [...memoryProducts].filter((p) => p.isVisible);

  if (params?.type) {
    list = list.filter((p) => p.type === params.type);
  }

  if (params?.category && params.category !== 'all') {
    list = list.filter((p) => p.category === params.category);
  }

  if (params?.search) {
    const q = params.search.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (params?.sort === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (params?.sort === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else {
    // Default: new arrivals
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return list;
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  await delay();
  return [...memoryProducts];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await delay();
  const found = memoryProducts.find((p) => p.slug === slug);
  return found || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  await delay();
  const found = memoryProducts.find((p) => p.id === id);
  return found || null;
}

export async function upsertProduct(product: Product): Promise<Product> {
  await delay();
  const idx = memoryProducts.findIndex((p) => p.id === product.id);
  if (idx >= 0) {
    memoryProducts[idx] = { ...product };
  } else {
    memoryProducts.unshift({ ...product });
  }
  saveToStorage(STORAGE_KEYS.PRODUCTS, memoryProducts);
  return product;
}

export async function updateProductStock(
  productId: string,
  optionId: string,
  newStock: number
): Promise<boolean> {
  await delay();
  const prod = memoryProducts.find((p) => p.id === productId);
  if (!prod) return false;
  const opt = prod.options.find((o) => o.id === optionId);
  if (!opt) return false;
  opt.stock = Math.max(0, newStock);
  saveToStorage(STORAGE_KEYS.PRODUCTS, memoryProducts);
  return true;
}

// ==========================================
// 2. CLASSES & SESSIONS
// ==========================================

export async function getClasses(): Promise<ClassItem[]> {
  await delay();
  return [...memoryClasses];
}

export async function getClassBySlug(slug: string): Promise<ClassItem | null> {
  await delay();
  return memoryClasses.find((c) => c.slug === slug) || null;
}

export async function getClassSessions(classId?: string, date?: string): Promise<ClassSession[]> {
  await delay();
  let list = [...memorySessions];
  if (classId) {
    list = list.filter((s) => s.classId === classId);
  }
  if (date) {
    list = list.filter((s) => s.date === date);
  }
  return list.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });
}

/**
 * 예약 생성
 * 주의: 정원 검사와 갱신을 원자적으로 수행합니다.
 * 실제 DB 연결 시 트랜잭션 또는 서버 함수(Supabase RPC)로 처리 필요
 */
export async function createReservation(params: {
  sessionId: string;
  name: string;
  phone: string;
  headcount: number;
  notes?: string;
}): Promise<{ success: boolean; reservation?: Reservation; message?: string }> {
  await delay();

  const session = memorySessions.find((s) => s.id === params.sessionId);
  if (!session) {
    return { success: false, message: '해당 회차 정보를 찾을 수 없습니다.' };
  }

  const cls = memoryClasses.find((c) => c.id === session.classId);
  const remaining = session.capacity - session.reserved;

  if (params.headcount > remaining) {
    return {
      success: false,
      message: `잔여 좌석이 부족합니다. (신청 인원: ${params.headcount}명 / 잔여: ${remaining}명)`,
    };
  }

  // 좌석 원자적 차감/예약 증가
  session.reserved += params.headcount;

  const dateShort = session.date.replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const reservationNo = `RES-${dateShort}-${randomSuffix}`;

  const newReservation: Reservation = {
    id: `res-${Date.now()}`,
    reservationNo,
    sessionId: session.id,
    classId: session.classId,
    className: session.className || (cls ? cls.name : '은공방 클래스'),
    sessionDate: session.date,
    sessionTime: session.time,
    name: params.name,
    phone: params.phone,
    headcount: params.headcount,
    totalPrice: (cls?.price || 75000) * params.headcount,
    status: 'confirmed',
    notes: params.notes,
    createdAt: new Date().toISOString(),
  };

  memoryReservations.unshift(newReservation);

  saveToStorage(STORAGE_KEYS.SESSIONS, memorySessions);
  saveToStorage(STORAGE_KEYS.RESERVATIONS, memoryReservations);

  return { success: true, reservation: newReservation };
}

export async function getReservations(): Promise<Reservation[]> {
  await delay();
  return [...memoryReservations];
}

export async function cancelReservation(reservationId: string): Promise<boolean> {
  await delay();
  const res = memoryReservations.find((r) => r.id === reservationId);
  if (!res || res.status === 'cancelled') return false;

  const session = memorySessions.find((s) => s.id === res.sessionId);
  if (session) {
    session.reserved = Math.max(0, session.reserved - res.headcount);
    saveToStorage(STORAGE_KEYS.SESSIONS, memorySessions);
  }

  res.status = 'cancelled';
  saveToStorage(STORAGE_KEYS.RESERVATIONS, memoryReservations);
  return true;
}

export async function addClassSession(
  classId: string,
  date: string,
  time: string,
  capacity = 4
): Promise<ClassSession> {
  await delay();
  const cls = memoryClasses.find((c) => c.id === classId);
  const newSession: ClassSession = {
    id: `sess-${classId}-${date}-${time.replace(':', '')}`,
    classId,
    className: cls ? cls.name : '클래스',
    date,
    time,
    capacity,
    reserved: 0,
  };
  memorySessions.push(newSession);
  saveToStorage(STORAGE_KEYS.SESSIONS, memorySessions);
  return newSession;
}

export async function updateSessionCapacity(sessionId: string, newCapacity: number): Promise<boolean> {
  await delay();
  const s = memorySessions.find((item) => item.id === sessionId);
  if (!s) return false;
  s.capacity = Math.max(s.reserved, newCapacity);
  saveToStorage(STORAGE_KEYS.SESSIONS, memorySessions);
  return true;
}

// ==========================================
// 3. ORDERS & INVENTORY DEDUCTION
// ==========================================

export async function getOrders(): Promise<Order[]> {
  await delay();
  return [...memoryOrders];
}

export async function getOrderByNumberAndPhone(orderNo: string, phone: string): Promise<Order | null> {
  await delay();
  const cleanOrderNo = orderNo.trim().toUpperCase();
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  const found = memoryOrders.find((o) => {
    const oNo = o.orderNo.trim().toUpperCase();
    const oPhone = o.phone.replace(/[^0-9]/g, '');
    return oNo === cleanOrderNo && oPhone === cleanPhone;
  });

  return found || null;
}

export async function getOrderById(id: string): Promise<Order | null> {
  await delay();
  return memoryOrders.find((o) => o.id === id) || null;
}

/**
 * 주문 생성 및 재고 일괄 차감
 * 주의: 재고 차감과 주문 생성을 단일 처리 안에서 검사와 갱신을 함께 수행합니다.
 * 실제 DB 연결 시 트랜잭션 또는 서버 함수(PostgreSQL SERIALIZABLE / Supabase RPC)로 처리 필요
 */
export async function createOrder(params: {
  customerName: string;
  phone: string;
  address: string;
  detailAddress?: string;
  postalCode?: string;
  shippingNote?: string;
  paymentMethod: string;
  items: Array<{
    productId: string;
    productName: string;
    productSlug: string;
    productType: 'ready-made' | 'handmade';
    optionId: string;
    optionLabel: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  totalPrice: number;
}): Promise<{ success: boolean; order?: Order; message?: string }> {
  await delay();

  // 1. 재고 검사 (동시 주문 충돌 가정한 사전 검사)
  for (const item of params.items) {
    const product = memoryProducts.find((p) => p.id === item.productId);
    if (!product) {
      return { success: false, message: `상품(${item.productName})을 찾을 수 없습니다.` };
    }
    const option = product.options.find((o) => o.id === item.optionId);
    if (!option) {
      return { success: false, message: `선택하신 옵션(${item.optionLabel})이 존재하지 않습니다.` };
    }
    if (option.stock < item.quantity) {
      return {
        success: false,
        message: `[${item.productName} - ${item.optionLabel}]의 재고가 부족합니다. (남은 수량: ${option.stock}개)`,
      };
    }
  }

  // 2. 재고 차감 진행
  for (const item of params.items) {
    const product = memoryProducts.find((p) => p.id === item.productId)!;
    const option = product.options.find((o) => o.id === item.optionId)!;
    option.stock -= item.quantity;
  }

  // 3. 주문번호 생성
  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const seq = String(memoryOrders.length + 1).padStart(3, '0');
  const orderNo = `ORD-${todayStr}-${seq}`;

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNo,
    customerName: params.customerName,
    phone: params.phone,
    address: params.address,
    detailAddress: params.detailAddress,
    postalCode: params.postalCode,
    shippingNote: params.shippingNote,
    status: 'payment_complete',
    items: params.items,
    totalPrice: params.totalPrice,
    paymentMethod: params.paymentMethod,
    createdAt: new Date().toISOString(),
  };

  memoryOrders.unshift(newOrder);

  // 저장소 영속화
  saveToStorage(STORAGE_KEYS.PRODUCTS, memoryProducts);
  saveToStorage(STORAGE_KEYS.ORDERS, memoryOrders);

  return { success: true, order: newOrder };
}

/**
 * 주문 상태 변경
 * 허용되지 않는 순서 건너뛰기는 막습니다.
 * 순서: 결제완료(payment_complete) -> 상품준비(preparing) -> 배송중(shipping) -> 배송완료(delivered)
 * 또는 언제든 취소(cancelled) 가능 (단, 배송완료 후는 관리자 재량)
 */
export async function updateOrderStatus(
  orderId: string,
  nextStatus: OrderStatus
): Promise<{ success: boolean; message?: string }> {
  await delay();
  const order = memoryOrders.find((o) => o.id === orderId);
  if (!order) return { success: false, message: '주문을 찾을 수 없습니다.' };

  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    payment_complete: ['preparing', 'cancelled'],
    preparing: ['shipping', 'cancelled'],
    shipping: ['delivered', 'cancelled'],
    delivered: ['cancelled'],
    cancelled: [],
  };

  const allowed = validTransitions[order.status] || [];
  if (!allowed.includes(nextStatus)) {
    return {
      success: false,
      message: `현재 상태(${order.status})에서 '${nextStatus}'(으)로 직접 변경할 수 없습니다. 단계별로 진행해 주십시오.`,
    };
  }

  // 취소 시 재고 환원 처리
  if (nextStatus === 'cancelled' && order.status !== 'cancelled') {
    for (const item of order.items) {
      const prod = memoryProducts.find((p) => p.id === item.productId);
      const opt = prod?.options.find((o) => o.id === item.optionId);
      if (opt) {
        opt.stock += item.quantity;
      }
    }
    saveToStorage(STORAGE_KEYS.PRODUCTS, memoryProducts);
  }

  order.status = nextStatus;
  saveToStorage(STORAGE_KEYS.ORDERS, memoryOrders);
  return { success: true };
}

/**
 * 배송 정보 등록 및 수정
 */
export async function updateShipment(
  orderId: string,
  carrier: string,
  trackingNo: string
): Promise<{ success: boolean; message?: string }> {
  await delay();
  const order = memoryOrders.find((o) => o.id === orderId);
  if (!order) return { success: false, message: '주문을 찾을 수 없습니다.' };

  order.shipment = {
    orderId,
    carrier,
    trackingNo,
    trackingUrl:
      carrier === '우체국택배'
        ? `https://service.epost.go.kr/trace.RetrieveDomRcvTraceList.comm?sid1=${trackingNo}`
        : `https://www.doortodoor.co.kr/link/jsp/idx.jsp?wms_no=${trackingNo}`,
    shippedAt: new Date().toISOString(),
  };

  // 배송정보 입력 시 상태가 preparing 또는 payment_complete라면 shipping으로 자동 전이
  if (order.status === 'preparing' || order.status === 'payment_complete') {
    order.status = 'shipping';
  }

  saveToStorage(STORAGE_KEYS.ORDERS, memoryOrders);
  return { success: true };
}

// ==========================================
// 4. POSTS (Journal, Reviews, Inquiries)
// ==========================================

export async function getPosts(board?: Post['board']): Promise<Post[]> {
  await delay();
  let list = [...memoryPosts];
  if (board) {
    list = list.filter((p) => p.board === board);
  }
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getPostById(id: string): Promise<Post | null> {
  await delay();
  return memoryPosts.find((p) => p.id === id) || null;
}

export async function createPost(
  newPostData: Omit<Post, 'id' | 'createdAt'>
): Promise<Post> {
  await delay();
  const post: Post = {
    ...newPostData,
    id: `post-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  memoryPosts.unshift(post);
  saveToStorage(STORAGE_KEYS.POSTS, memoryPosts);
  return post;
}

export async function answerInquiry(postId: string, answerText: string): Promise<boolean> {
  await delay();
  const post = memoryPosts.find((p) => p.id === postId);
  if (!post) return false;
  post.answer = answerText;
  post.answeredAt = new Date().toISOString();
  saveToStorage(STORAGE_KEYS.POSTS, memoryPosts);
  return true;
}

export async function toggleHidePost(postId: string): Promise<boolean> {
  await delay();
  const post = memoryPosts.find((p) => p.id === postId);
  if (!post) return false;
  post.isHidden = !post.isHidden;
  saveToStorage(STORAGE_KEYS.POSTS, memoryPosts);
  return true;
}

// ==========================================
// 5. FAQS
// ==========================================

export async function getFaqs(): Promise<FaqItem[]> {
  await delay();
  return [...memoryFaqs];
}

// ==========================================
// 6. ADMIN DASHBOARD STATS
// ==========================================

export async function getAdminStats(): Promise<{
  newOrdersToday: number;
  preparingOrders: number;
  todayReservations: number;
  lowStockItemsCount: number;
  pendingInquiriesCount: number;
}> {
  await delay();
  const todayStr = new Date().toISOString().slice(0, 10);

  const newOrdersToday = memoryOrders.filter((o) => o.createdAt.startsWith(todayStr)).length;
  const preparingOrders = memoryOrders.filter((o) => o.status === 'preparing').length;
  const todayReservations = memoryReservations.filter(
    (r) => r.sessionDate === todayStr && r.status === 'confirmed'
  ).length;

  let lowStockCount = 0;
  memoryProducts.forEach((p) => {
    p.options.forEach((opt) => {
      if (opt.stock <= 2) {
        lowStockCount++;
      }
    });
  });

  const pendingInquiriesCount = memoryPosts.filter(
    (p) => p.board === 'inquiry' && !p.answer
  ).length;

  return {
    newOrdersToday,
    preparingOrders,
    todayReservations,
    lowStockItemsCount: lowStockCount,
    pendingInquiriesCount,
  };
}
