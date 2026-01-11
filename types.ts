
export enum TransactionStatus {
  PENDING = '待审核',
  SUCCESS = '处理成功',
  FAILED = '已拒绝',
  MATCHED = '已匹配',
  PENDING_ARRIVAL = '待寄达',
  ARRIVED = '已收货',
  PENDING_DELIVERY = '待提货',
  DELIVERED = '已提货'
}

export enum RequestType {
  RECHARGE = 'RECHARGE',
  WITHDRAW = 'WITHDRAW',
  KYC_UPDATE = 'KYC_UPDATE',
  CONSIGNMENT = 'CONSIGNMENT',
  DELIVERY = 'DELIVERY',
  REGISTRATION = 'REGISTRATION' // 新增：注册审核类型
}

export type ProductStatus = 'collecting' | 'trading' | 'suspended' | 'draft' | 'published' | 'delisted';

export interface Product {
  id: string;
  name: string;
  code: string;
  price: number;
  openPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  manualStock: number;
  consignedStock: number;
  totalStock: number;
  image: string;
  category: 'banknote' | 'stamp' | 'art';
  status: ProductStatus;
  mode?: 'opening' | 'collection';
  collectedQuantity?: number;
  createdAt?: string;
}

export interface User {
  id: string;
  username: string;
  nickname: string;
  balance: number;
  isKYC: boolean;
  kycName?: string;
  idCard?: string;
  bankCard?: string;
  bankName?: string; 
  phone?: string;
  address?: string; 
  accountNo: string;
  isVirtual: boolean;
  isGuest: boolean; // 新增：标识是否为游客
  holdings: Record<string, number>;
  dailyProfit: number;
  monthlyProfit: number;
  totalProfit: number;
  createdAt: string;
  updatedAt: string;
  securityLevel: 'low' | 'medium' | 'high';
}

export interface Transaction {
  id: string;
  userId: string;
  productId?: string;
  productName?: string;
  quantity?: number;
  amount: number;
  type: 'consignment' | 'withdrawal' | 'recharge' | 'delivery' | 'purchase' | 'sale';
  status: TransactionStatus;
  timestamp: string;
  trackingNo?: string;
  secureHash?: string;
}

export interface UIConfig {
  mallName: string;
  banners: Banner[];
  announcements: { id: string, text: string, urgent: boolean }[];
  announcementSpeed: number;
  navIcons: NavIconConfig[];
  categoryTabs: string[];
  homeNewArrivalIds: string[];
  homePopularDailyIds: string[];
  homePopularWeeklyIds: string[];
  homePopularMonthlyIds: string[];
  isCollectionOpen: boolean; 
  startupPopup: PopupConfig;
  themeColor: string;
  layoutOrder: string[]; 
  adminBankInfo: {
    cardNo: string;
    holder: string;
    bankName: string;
    qrWechat: string;
    qrAlipay: string;
  };
  agreements: Record<string, string>;
}

export interface Banner { id: string; title: string; subtitle: string; image?: string; gradient: string; link?: string; order: number; titleColor?: string; subtitleColor?: string; }
export interface PopupConfig { enabled: boolean; title: string; content: string; image?: string; buttonText: string; link?: string; frequency: 'once' | 'daily' | 'always'; backgroundColor: string; titleColor: string; contentColor: string; buttonColor: string; buttonTextColor: string; borderRadius: number; textAlign: 'left' | 'center' | 'right'; overlayBlur: number; animation: 'fade' | 'slide-up' | 'zoom'; }
export interface NavIconConfig { label: string; visible: boolean; detailTitle: string; detailText: string; detailImage: string; }
export interface AdminRequest { id: string; userId: string; userNickname: string; type: RequestType; amount?: number; flowId?: string; data?: any; status: 'pending' | 'approved' | 'rejected'; timestamp: string; secureSign?: string; }
export interface TradeOrder { id: string; productId: string; customerId: string; type: 'buy' | 'sell'; price: number; quantity: number; filledQuantity: number; status: 'pending' | 'partial' | 'completed' | 'cancelled' | 'matched_pending'; batchId: string; createdAt: string; updatedAt: string; }
export interface TradeTransaction { id: string; buyOrderId: string; sellOrderId: string; productId: string; price: number; quantity: number; transactionTime: string; }
export interface PriceTick { id: string; productId: string; currentPrice: number; highestBid: number; lowestAsk: number; updatedAt: string; }

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface FinancialReview {
  id: string;
  userId: string;
  userNickname: string;
  type: RequestType;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  confirmedFields: { name: boolean; amount: boolean; method: boolean; flow: boolean };
}

export interface ProductReview {
  id: string;
  userId: string;
  userNickname: string;
  type: RequestType;
  productName: string;
  productId: string;
  quantity: number;
  specifications: string;
  supplier: string;
  trackingNo: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  confirmedFields: { name: boolean; quantity: boolean; specs: boolean; supplier: boolean };
}
