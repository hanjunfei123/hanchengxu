import { Product, User, Announcement, TransactionStatus, Transaction } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: '二版一分（包）',
    code: '107503',
    price: 4.92,
    openPrice: 4.91,
    change: 0.01,
    changePercent: 0.20,
    volume: 823300,
    manualStock: 5000000,
    consignedStock: 3060000,
    totalStock: 8060000,
    image: 'https://picsum.photos/seed/p1/200/200',
    category: 'banknote',
    status: 'trading'
  },
  {
    id: '2',
    name: '迪士尼小全张',
    code: '202811',
    price: 23.61,
    openPrice: 21.46,
    change: 2.15,
    changePercent: 9.97,
    volume: 120500,
    manualStock: 20000,
    consignedStock: 30000,
    totalStock: 50000,
    image: 'https://picsum.photos/seed/p2/200/200',
    category: 'stamp',
    status: 'trading'
  },
  {
    id: '3',
    name: '53年小字伍分',
    code: '100055',
    price: 430.00,
    openPrice: 435.20,
    change: -5.20,
    changePercent: -1.20,
    volume: 101,
    manualStock: 4500,
    consignedStock: 500,
    totalStock: 5000,
    image: 'https://picsum.photos/seed/p3/200/200',
    category: 'banknote',
    status: 'collecting'
  }
];

export const CURRENT_USER: User = {
  id: 'U800015971',
  username: 'collector_a',
  nickname: '收藏家A',
  balance: 47.22,
  isKYC: true,
  kycName: '张三',
  idCard: '4401**********001X',
  bankCard: '6222***********0987',
  phone: '17550230302',
  accountNo: '800015971',
  isVirtual: false,
  // Fix: Add missing isGuest property required by User interface (Error on line 54)
  isGuest: false,
  holdings: {
    '2': 2
  },
  dailyProfit: 4.28,
  monthlyProfit: 125.50,
  totalProfit: 1430.00,
  createdAt: '2023-01-15 10:00:00',
  updatedAt: '2023-10-27 15:30:00',
  securityLevel: 'high'
};

export const INITIAL_USERS: User[] = [
  CURRENT_USER,
  {
    id: 'U100000000',
    username: 'market_maker_1',
    nickname: '虚拟做市商01',
    balance: 1000000,
    isKYC: true,
    kycName: '系统代持',
    idCard: 'VIRTUAL_ID_001',
    bankCard: 'VIRTUAL_BANK_001',
    phone: '10000000001',
    accountNo: '100000000',
    isVirtual: true,
    // Fix: Add missing isGuest property required by User interface (Error on line 79)
    isGuest: false,
    holdings: {
      '1': 1000,
      '3': 50
    },
    dailyProfit: 0.00,
    monthlyProfit: 0.00,
    totalProfit: 0.00,
    createdAt: '2023-01-01 00:00:00',
    updatedAt: '2023-01-01 00:00:00',
    securityLevel: 'medium'
  }
];

export const ANNOUNCEMENTS: Announcement[] = [
  { id: '1', title: '注册有礼！3399服务会员开展第三期开户有礼活动！', content: '详细规则...', date: '2023-10-27' },
  { id: '2', title: '关于货品寄售规则的补充通知', content: '为了保障交易安全...', date: '2023-10-25' }
];

export const MOCK_HISTORY: Transaction[] = [
  {
    id: 'T1',
    userId: 'U800015971',
    productId: '2',
    productName: '迪士尼小全张',
    quantity: 2,
    amount: 47.22,
    type: 'purchase',
    status: TransactionStatus.MATCHED,
    timestamp: '2023-10-26 14:30:00'
  }
];