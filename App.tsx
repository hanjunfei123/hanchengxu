
import React, { useState, createContext, useContext, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Home as HomeIcon, ShoppingBag, User as UserIcon, TrendingUp, ShieldCheck, Info, X, BellRing } from 'lucide-react';
import Home from './pages/Home';
import Market from './pages/Market';
import Profile from './pages/Profile';
import MyItems from './pages/MyItems';
import Trade from './pages/Trade';
import Watchlist from './pages/Watchlist';
import NavDetail from './pages/NavDetail';
import BalanceDetail from './pages/BalanceDetail';
import Settings from './pages/Settings';
import ConsignmentForm from './pages/ConsignmentForm';
import TradeHistory from './pages/TradeHistory';
import Chat from './pages/Chat';
import Register from './pages/Register';
import AdminDashboard from './pages/Admin/AdminDashboard';
import { CURRENT_USER, INITIAL_PRODUCTS, MOCK_HISTORY, INITIAL_USERS } from './constants';
import { User, Product, Transaction, UIConfig, AdminRequest, TradeOrder, TradeTransaction, PriceTick } from './types';

export type MarketOverride = 'auto' | 'open' | 'closed';

// 游客默认对象
const GUEST_USER: User = {
  id: 'GUEST',
  username: 'guest',
  nickname: '访客',
  balance: 0,
  isKYC: false,
  accountNo: '000000000',
  isVirtual: false,
  isGuest: true,
  holdings: {},
  dailyProfit: 0,
  monthlyProfit: 0,
  totalProfit: 0,
  createdAt: '',
  updatedAt: '',
  securityLevel: 'low'
};

interface AppContextType {
  user: User;
  users: User[];
  products: Product[];
  transactions: Transaction[];
  adminRequests: AdminRequest[];
  watchlist: string[];
  uiConfig: UIConfig;
  marketStatusOverride: MarketOverride;
  tradeOrders: TradeOrder[];
  tradeTransactions: TradeTransaction[];
  priceTicks: PriceTick[];
  
  setMarketStatusOverride: (status: MarketOverride) => void;
  toggleWatchlist: (productId: string) => void;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  setAdminRequests: React.Dispatch<React.SetStateAction<AdminRequest[]>>;
  setUIConfig: React.Dispatch<React.SetStateAction<UIConfig>>;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  isAdmin: boolean;
  logout: () => void;
  
  updateUserBalance: (userId: string, newBalance: number) => void;
  updateUserHoldings: (userId: string, productId: string, newQuantity: number) => void;
  updateProductPrice: (productId: string, newPrice: number) => void;
  
  setTradeOrders: React.Dispatch<React.SetStateAction<TradeOrder[]>>;
  setTradeTransactions: React.Dispatch<React.SetStateAction<TradeTransaction[]>>;
  setPriceTicks: React.Dispatch<React.SetStateAction<PriceTick[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const DEFAULT_UI_CONFIG: UIConfig = {
  mallName: '钱库商城',
  banners: [
    { id: 'b1', title: '钱库商城APP', subtitle: '官方直营 • 艺术品收藏', gradient: 'from-red-600 to-red-500', order: 0, titleColor: '#ffffff', subtitleColor: '#ffffff90' },
    { id: 'b2', title: '二版币收藏专场', subtitle: '限量货品 • 寄存入库中', gradient: 'from-blue-600 to-blue-500', order: 1, titleColor: '#ffffff', subtitleColor: '#ffffff90' }
  ],
  announcements: [
    { id: 'a1', text: '钱库商城正式开启游客浏览模式，新用户注册需人工核验。', urgent: true },
    { id: 'a2', text: '关于货品寄售规则的补充通知：请确保物流信息真实有效。', urgent: false }
  ],
  announcementSpeed: 5,
  navIcons: [
    { label: '注册', visible: true, detailTitle: '新用户注册', detailText: '欢迎加入钱库。', detailImage: 'https://picsum.photos/seed/reg/800/400' },
    { label: '寄存', visible: true, detailTitle: '货品寄存', detailText: '线下寄存流程说明...', detailImage: 'https://picsum.photos/seed/dep/800/400' },
    { label: '促销', visible: true, detailTitle: '限时促销', detailText: '本月主打产品...', detailImage: 'https://picsum.photos/seed/sale/800/400' },
    { label: '公告', visible: true, detailTitle: '平台公告', detailText: '最新政策更新...', detailImage: 'https://picsum.photos/seed/news/800/400' },
    { label: '帮助', visible: true, detailTitle: '帮助中心', detailText: '常见问题解答...', detailImage: 'https://picsum.photos/seed/help/800/400' },
    { label: '客服', visible: true, detailTitle: '在线客服', detailText: '', detailImage: '' },
    { label: '建议', visible: true, detailTitle: '意见反馈', detailText: '', detailImage: '' },
  ],
  categoryTabs: ['钱币邮票', '艺数文旅'],
  homeNewArrivalIds: ['1', '2'],
  homePopularDailyIds: ['1', '3'],
  homePopularWeeklyIds: ['2', '1'],
  homePopularMonthlyIds: ['3', '2'],
  isCollectionOpen: true,
  startupPopup: {
    enabled: true,
    title: '钱库商城系统升级公告',
    content: '尊敬的用户，我们的系统已完成核心撮合逻辑升级。现在您可以体验更加流畅的手动撮合服务。',
    buttonText: '立即体验',
    frequency: 'daily',
    backgroundColor: '#ffffff',
    titleColor: '#000000',
    contentColor: '#666666',
    buttonColor: '#ef4444',
    buttonTextColor: '#ffffff',
    borderRadius: 32,
    textAlign: 'center',
    overlayBlur: 8,
    animation: 'zoom'
  },
  themeColor: '#ef4444',
  layoutOrder: ['banners', 'announcements', 'nav', 'newArrivals', 'popular'],
  adminBankInfo: {
    cardNo: '6228 4800 1234 5678 910',
    holder: '钱库艺术品管理有限公司',
    bankName: '中国工商银行北京东长安街支行',
    qrWechat: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=wechat_pay',
    qrAlipay: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=alipay_pay'
  },
  agreements: {
    '平台注册及服务协议': '欢迎注册成为钱库商城会员。在您注册之前，请务必审慎阅读并充分理解各条款内容。本协议是您与钱库商城（以下简称“本平台”）之间关于您注册、登录、使用本平台服务所订立的契约。',
    '钱库商城风险提示书': '艺术品、钱币、邮票交易具有较高的市场风险。市场价格受政策、宏观经济、市场供求等多种因素影响，可能出现大幅波动。请您在进行交易前，务必审慎评估自身的风险承受能力。',
    '用户信息同步协议': '为了向您提供更加便捷的开户服务，本平台将与相关合作方共享您的必要身份信息。我们承诺严格遵守数据保护法律，确保您的信息安全，严禁非法泄露。',
    '用户合规承诺书': '本人郑重承诺：提供的所有个人信息真实有效；资金来源合法合规；不利用本平台进行洗钱、非法集资、操纵市场等违法违规行为。'
  }
};

const App: React.FC = () => {
  // 修改：初始为游客
  const [user, setUser] = useState<User>(GUEST_USER);
  const [users, setUsers] = useState<User[]>([...INITIAL_USERS.map(u => ({ ...u, isGuest: false }))]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_HISTORY);
  const [adminRequests, setAdminRequests] = useState<AdminRequest[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [uiConfig, setUIConfig] = useState<UIConfig>(DEFAULT_UI_CONFIG);
  const [marketStatusOverride, setMarketStatusOverride] = useState<MarketOverride>('auto');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showGuestNotice, setShowGuestNotice] = useState(false);

  const [tradeOrders, setTradeOrders] = useState<TradeOrder[]>([]);
  const [tradeTransactions, setTradeTransactions] = useState<TradeTransaction[]>([]);
  const [priceTicks, setPriceTicks] = useState<PriceTick[]>([]);
  
  const navigate = useNavigate();
  const location = useLocation();

  const toggleWatchlist = (productId: string) => {
    if (user.isGuest) {
      setShowGuestNotice(true);
      return;
    }
    setWatchlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const logout = () => {
    setUser(GUEST_USER);
    setWatchlist([]);
    navigate('/');
  };

  const updateUserBalance = (userId: string, newBalance: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, balance: newBalance, updatedAt: new Date().toLocaleString() };
        if (userId === user.id) setUser(updated);
        return updated;
      }
      return u;
    }));
  };

  const updateUserHoldings = (userId: string, productId: string, newQuantity: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { 
          ...u, 
          holdings: { ...u.holdings, [productId]: newQuantity },
          updatedAt: new Date().toLocaleString()
        };
        if (userId === user.id) setUser(updated);
        return updated;
      }
      return u;
    }));
  };

  const updateProductPrice = (productId: string, newPrice: number) => {
    setProducts(prev => prev.map(p => {
      if (String(p.id) === String(productId)) {
        const openPrice = p.openPrice || p.price;
        const change = newPrice - openPrice;
        const changePercent = (change / openPrice) * 100;
        return { ...p, price: newPrice, change, changePercent };
      }
      return p;
    }));
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  // 当游客点击资产或持仓时拦截
  useEffect(() => {
    if (user.isGuest && (location.pathname === '/my-items' || location.pathname === '/watchlist' || location.pathname === '/balance')) {
      setShowGuestNotice(true);
      navigate('/');
    }
  }, [location.pathname, user.isGuest, navigate]);

  return (
    <AppContext.Provider value={{ 
      user, users, products, transactions, adminRequests, watchlist, uiConfig, marketStatusOverride,
      tradeOrders, tradeTransactions, priceTicks,
      setMarketStatusOverride, toggleWatchlist,
      setUser, setUsers, setProducts, setTransactions, setAdminRequests, setUIConfig, isAdmin, setIsAdmin,
      updateUserBalance, updateUserHoldings, updateProductPrice,
      setTradeOrders, setTradeTransactions, setPriceTicks, logout
    }}>
      <div className={`flex flex-col min-h-screen ${isAdminRoute ? 'bg-gray-100' : 'max-w-md mx-auto bg-white shadow-xl relative'}`}>
        
        {/* 全局游客公告轮播提醒 */}
        {showGuestNotice && (
          <div className="fixed top-0 left-0 right-0 z-[100] max-w-md mx-auto bg-gray-900 text-white p-4 flex items-center gap-3 animate-slide-up shadow-2xl">
            <BellRing className="text-red-500 shrink-0" size={20} />
            <div className="flex-1 overflow-hidden">
               <div className="whitespace-nowrap animate-marquee font-black italic uppercase text-[10px] tracking-widest">
                  您当前正处于游客模式，仅提供市场浏览权限。请立即前往 [注册] 开通交易账号！ • 
                  您当前正处于游客模式，仅提供市场浏览权限。请立即前往 [注册] 开通交易账号！
               </div>
            </div>
            <button onClick={() => { setShowGuestNotice(false); navigate('/register'); }} className="px-3 py-1 bg-red-600 rounded-lg text-[9px] font-black italic uppercase">前往注册</button>
            <button onClick={() => setShowGuestNotice(false)} className="text-gray-500"><X size={16}/></button>
          </div>
        )}

        <main className={`flex-1 overflow-y-auto ${!isAdminRoute ? 'pb-24 hide-scrollbar' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/market" element={<Market />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/balance" element={<BalanceDetail />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/consignment" element={<ConsignmentForm />} />
            <Route path="/history" element={<TradeHistory />} />
            <Route path="/my-items" element={<MyItems />} />
            <Route path="/trade/:id" element={<Trade />} />
            <Route path="/nav-detail/:label" element={<NavDetail />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
        </main>

        {!isAdminRoute && (
          <button 
            onClick={() => { setIsAdmin(true); navigate('/admin'); }}
            className="fixed top-4 right-4 z-50 p-2 bg-gray-800/20 text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            <ShieldCheck size={16} />
          </button>
        )}

        {!isAdminRoute && location.pathname !== '/chat' && location.pathname !== '/register' && (
          <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-4 py-2 flex justify-around items-center z-30">
            <TabItem icon={<HomeIcon size={24} />} label="首页" active={location.pathname === '/'} onClick={() => navigate('/')} />
            <TabItem icon={<ShoppingBag size={24} />} label="行情" active={location.pathname === '/market'} onClick={() => navigate('/market')} />
            <TabItem icon={<TrendingUp size={24} />} label="持仓" active={location.pathname === '/my-items'} onClick={() => navigate('/my-items')} />
            <TabItem icon={<UserIcon size={24} />} label="我的" active={location.pathname === '/profile'} onClick={() => navigate('/profile')} />
          </nav>
        )}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </AppContext.Provider>
  );
};

const TabItem = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center space-y-1 transition-colors ${active ? 'text-red-600' : 'text-gray-400'}`}>
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;
