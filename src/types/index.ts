/**
 * MIJE' - Core TypeScript Types
 * 은공방 & 실버 주얼리 아틀리에
 */

export type ProductType = 'ready-made' | 'handmade';
export type ProductCategory = 'earring' | 'necklace' | 'ring' | 'bracelet' | 'etc';

export interface ProductOption {
  id: string;
  productId: string;
  label: string; // e.g., '9호', '11호', '13호', 'Free'
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  type: ProductType;
  category: ProductCategory;
  name: string;
  price: number;
  material: string; // e.g. "Silver 925" (실제 소재·함량 표기는 사실에 맞게 교체 필요)
  weight: string; // e.g. "약 3.8g"
  description: string;
  details?: string[];
  careGuide?: string;
  images: string[]; // 4:5 aspect ratio images
  leadTimeDays?: number; // 핸드메이드 제작 소요일
  isLimited?: boolean; // 1점 제작 or 소량 제작
  isVisible: boolean;
  options: ProductOption[];
  craftStory?: string;
  processImages?: string[];
  createdAt: string;
}

export type OrderStatus = 'payment_complete' | 'preparing' | 'shipping' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  productSlug: string;
  productType: ProductType;
  optionId: string;
  optionLabel: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Shipment {
  orderId: string;
  carrier: string; // e.g., 우체국택배, CJ대한통운
  trackingNo: string;
  trackingUrl?: string;
  shippedAt?: string;
}

export interface Order {
  id: string;
  orderNo: string;
  customerName: string;
  phone: string;
  address: string;
  detailAddress?: string;
  postalCode?: string;
  shippingNote?: string;
  status: OrderStatus;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: string;
  shipment?: Shipment;
  createdAt: string;
}

export interface ClassItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  durationMin: number;
  description: string;
  detailedIntro: string;
  materials: string[];
  curriculum: string[];
  cancelPolicy: string;
  images: string[];
  included: string[];
  maxCapacityPerSession: number;
}

export interface ClassSession {
  id: string;
  classId: string;
  className: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  capacity: number;
  reserved: number;
}

export interface Reservation {
  id: string;
  reservationNo: string;
  sessionId: string;
  classId: string;
  className: string;
  sessionDate: string;
  sessionTime: string;
  name: string;
  phone: string;
  headcount: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export type PostBoard = 'notice' | 'review' | 'inquiry';

export interface Post {
  id: string;
  board: PostBoard;
  title: string;
  body: string;
  author: string; // e.g., "고객 A"
  isPrivate?: boolean;
  relatedType?: 'product' | 'class';
  relatedId?: string;
  relatedName?: string;
  rating?: number; // 1 to 5 for review
  images?: string[];
  answer?: string; // for inquiry
  answeredAt?: string;
  isHidden?: boolean; // for moderation
  createdAt: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'product' | 'atelier' | 'shipping' | 'care';
}

export interface CartItem {
  id: string; // unique item line key
  productId: string;
  product: Product;
  optionId: string;
  option: ProductOption;
  quantity: number;
}
