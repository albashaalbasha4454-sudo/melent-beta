import React, { useState, useMemo, useEffect, ChangeEvent } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Briefcase, 
  History, 
  FileText, 
  Settings,
  X,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  ShoppingCart,
  Truck,
  Filter,
  LogOut,
  Bell,
  Menu,
  CheckCircle2,
  Edit2,
  Printer,
  ChevronLeft,
  Database,
  ShieldCheck,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const ChartWrapper: React.FC<{ children: React.ReactNode; height: number | string }> = ({ children, height }) => {
  const [isReady, setIsReady] = React.useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ height, width: '100%', minWidth: 0, overflow: 'hidden' }}>
      {isReady && children}
    </div>
  );
};

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Logo } from './Logo';
import { AddOrderModal } from './AddOrderModal';
import { InvoiceModal } from './InvoiceModal';
import { AdminDashboardProps, MedicalOrder, Expense, Product } from '../types';
import { mockMedicalOrders, mockExpenses, mockProducts } from '../data';
import { ProductSection } from './admin/ProductSection';
import { UserSection } from './admin/UserSection';
import { SettingsSection } from './SettingsSection';
import { OrderSection } from './admin/OrderSection';
import { InventorySection } from './admin/InventorySection';
import { FinanceSection } from './admin/FinanceSection';
import { ContractSection } from './admin/ContractSection';
import { LogisticsSection } from './admin/LogisticsSection';
import { ReportsSection } from './admin/ReportsSection';
import { ProfitAnalysisSection } from './admin/ProfitAnalysisSection';
import { B2BSection } from './admin/B2BSection';
import { SystemManagementSection } from './admin/SystemManagementSection';
import { LocalDB, LocalStorageManager, MELENT_KEYS } from '../services/localStorageManager';
import { useLanguage } from '../hooks/useLanguage';
import { useData } from '../hooks/useData';
import { LanguageSwitcher } from './LanguageSwitcher';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { t, isRTL } = useLanguage();
  const { 
    orders, products, expenses, 
    addOrder, refreshData, getProfitSummary, syncInventory
  } = useData();
  
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize System
  useEffect(() => {
    LocalDB.initialize();
    // Ensure initial data is loaded if empty
    const isInitialized = localStorage.getItem('melent_database_initialized') === 'true';
    if (!isInitialized) {
      LocalStorageManager.save(MELENT_KEYS.ORDERS, mockMedicalOrders);
      LocalStorageManager.save(MELENT_KEYS.PRODUCTS, mockProducts);
      LocalStorageManager.save('melent_initial_products', mockProducts);
      LocalStorageManager.save(MELENT_KEYS.EXPENSES, mockExpenses);
      localStorage.setItem('melent_database_initialized', 'true');
      refreshData();
    }
    syncInventory();
  }, [refreshData, syncInventory]);

  // Modal States
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<MedicalOrder | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<MedicalOrder | null>(null);

  const chartRef = React.useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`melent-weekly-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert(t('pdf_error'));
    }
  };

  // Stats Calculations
  const stats = useMemo(() => {
    const summary = getProfitSummary();
    const totalOrderValue = orders.reduce((acc, o) => acc + (o.financials?.total || 0), 0);
    const activeContracts = orders.filter(o => o.status !== 'Cancelled' && o.status !== 'Delivered').length;

    return { 
      totalRevenue: summary.revenue, 
      totalExpenses: summary.costs, 
      activeContracts, 
      margin: summary.margin 
    };
  }, [orders, getProfitSummary]);

  // Weekly Chart Data
  const weeklyChartData = useMemo(() => {
    const days = [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')];
    const now = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(now.getDate() - (6 - i));
      return {
        dateStr: d.toISOString().split('T')[0],
        dayName: days[d.getDay()],
        count: 0
      };
    });

    orders.forEach(order => {
      const orderDate = order.date.split('T')[0];
      const foundDay = last7Days.find(d => d.dateStr === orderDate);
      if (foundDay) {
        foundDay.count += 1;
      }
    });

    return last7Days;
  }, [orders, t]);

  const handleAddOrder = (order: MedicalOrder) => {
    addOrder(order);
    setEditingOrder(null);
    setIsAddOrderOpen(false);
  };

  const openAddOrder = () => {
    setEditingOrder(null);
    setIsAddOrderOpen(true);
  };

  const openEditOrder = (order: MedicalOrder) => {
    setEditingOrder(order);
    setIsAddOrderOpen(true);
  };

  const menuItems = [
    { id: 'Dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { id: 'Clients', icon: Users, label: t('clients') },
    { id: 'Suppliers', icon: Briefcase, label: t('suppliers') },
    { id: 'Products', icon: Package, label: t('products') },
    { id: 'Inventory', icon: History, label: t('inventory') },
    { 
      id: 'Orders', 
      icon: ShoppingCart, 
      label: t('orders'),
      badge: orders.filter(o => ['Admin Review', 'Processing', 'Shipping'].includes(o.status)).length
    },
    { id: 'Contracts', icon: FileText, label: t('contracts') },
    { 
      id: 'Logistics', 
      icon: Truck, 
      label: t('logistics'),
      badge: orders.filter(o => o.status === 'Shipping' || o.status === 'In Transit').length
    },
    { id: 'Finance', icon: ArrowUpRight, label: t('finance') },
    { id: 'B2B', icon: Briefcase, label: t('b2b_mgmt') },
    { id: 'Profitability', icon: TrendingUp, label: t('profit_analysis') },
    { id: 'Reports', icon: CheckCircle2, label: t('reports') },
    { id: 'Settings', icon: Settings, label: t('settings') },
    { id: 'System', icon: Database, label: t('system') },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             exit={{ opacity: 0 }}
             onClick={() => setIsSidebarOpen(false)}
             className="fixed inset-0 bg-brand-navy/20 backdrop-blur-sm z-[45] lg:hidden"
           />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div 
            initial={{ x: isRTL ? 280 : -280 }} animate={{ x: 0 }} exit={{ x: isRTL ? 280 : -280 }}
            className={`fixed lg:relative w-72 bg-white h-screen ${isRTL ? 'border-l' : 'border-r'} border-slate-100 flex flex-col z-50 shrink-0 shadow-2xl lg:shadow-none`}
          >
            <div className={`p-8 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center gap-3 mb-10">
                <Logo className="h-10" />
                <div>
                   <h2 className="text-xl font-black text-brand-navy leading-none tracking-tighter">MELENT</h2>
                   <p className="text-[10px] font-black text-brand-green uppercase tracking-widest mt-1">{t('admin_panel')}</p>
                </div>
              </div>

              <div className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm relative ${
                      activeTab === item.id 
                        ? 'bg-brand-navy text-white shadow-lg shadow-brand-navy/10' 
                        : 'text-slate-400 hover:bg-slate-50 hover:text-brand-navy'
                    } ${isRTL ? 'flex-row' : 'flex-row-reverse justify-end'}`}
                  >
                    <item.icon size={18} className={activeTab === item.id ? 'text-brand-cyan' : ''} />
                    <span className="grow text-right">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="bg-brand-green text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto p-8 pt-0 space-y-4">
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-black text-brand-navy uppercase tracking-widest leading-none">تأمين البيانات</p>
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse"></div>
                  </div>
                  <p className="text-[9px] font-black text-brand-green italic tracking-widest">تشفير محلي متكامل</p>
               </div>
               
               <button onClick={onLogout} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm ${isRTL ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
                 <LogOut size={18} />
                 <span>{t('logout')}</span>
               </button>
               <div className={`mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3 ${isRTL ? 'flex-row' : 'flex-row'}`}>
                  <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-white font-black">A</div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="text-xs font-black text-brand-navy">General Manager</p>
                    <p className="text-[10px] font-bold text-slate-400">admin@melent.care</p>
                  </div>
               </div>
               <div className="mt-4 p-4 bg-brand-navy/5 rounded-2xl border border-brand-navy/5">
                   <p className={`text-[10px] font-bold text-brand-navy leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                     {t('tech_support_msg')} <span className="font-black underline decoration-brand-cyan underline-offset-4" dir="ltr">0096340392619</span>
                   </p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2 lg:gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-brand-navy transition-colors shrink-0">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="relative w-full max-w-sm hidden md:block">
              <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-300`} size={18} />
              <input 
                type="text" 
                placeholder={t('search')} 
                className={`w-full bg-slate-50 border-transparent rounded-xl py-2.5 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-sm font-bold focus:bg-white focus:border-brand-navy/10 transition-all outline-none`}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 lg:gap-6">
             <LanguageSwitcher />
             <div className="hidden lg:flex items-center gap-4 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
               <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></div>
               <p className="text-[10px] font-black text-brand-navy uppercase tracking-widest">{t('system_online')}</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-brand-navy transition-colors cursor-pointer">
               <Bell size={20} />
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'Dashboard' ? (
              <>
                <div className="flex items-center justify-between mb-10">
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="text-[10px] font-black uppercase text-brand-green tracking-[0.3em] mb-1">{t('active_global')}</p>
                    <h2 className="text-3xl font-black text-brand-navy tracking-tighter uppercase">{t('dashboard')}</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  {[
                    { label: t('total_revenue'), value: stats.totalRevenue.toLocaleString() + ' $', color: 'bg-brand-navy', icon: ArrowUpRight, trend: '+12.5%' },
                    { label: t('total_expenses'), value: stats.totalExpenses.toLocaleString() + ' $', color: 'bg-brand-green', icon: ArrowDownRight, trend: '-2.4%' },
                    { label: t('active_contracts'), value: stats.activeContracts, color: 'bg-brand-cyan', icon: FileText, trend: '+4' },
                    { label: t('profit_margin'), value: stats.margin.toFixed(1) + '%', color: 'bg-brand-gold', icon: Briefcase, trend: '+1.2%' },
                  ].map((stat, i) => (
                    <div key={i} className={`bg-white p-7 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                       <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                            <stat.icon size={26} />
                          </div>
                          <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${i === 1 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                            {stat.trend}
                          </span>
                       </div>
                       <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
                         <p className="text-2xl font-black text-brand-navy tracking-tighter">{stat.value}</p>
                       </div>
                    </div>
                  ))}
                </div>

                {/* Financial Insights Chart */}
                <div ref={chartRef} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm mb-10 overflow-hidden">
                  <div className={`flex flex-col md:flex-row items-center justify-between mb-8 gap-6 ${isRTL ? 'md:flex-row' : 'md:flex-row'}`}>
                     <div className={`flex items-center gap-4 ${isRTL ? 'flex-row' : 'flex-row'}`}>
                        <div className="w-12 h-12 rounded-2xl bg-brand-navy flex items-center justify-center text-brand-cyan">
                           <TrendingUp size={24} />
                        </div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                           <h3 className="text-xl font-black text-brand-navy tracking-tighter">{t('daily_order_volume')}</h3>
                           <p className="text-[10px] font-black text-brand-green uppercase tracking-widest mt-0.5">{t('weekly_activity_analysis')}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-black text-slate-400">
                           <Calendar size={14} className="text-brand-navy" />
                           <span>{t('current_week')}</span>
                        </div>
                        <button 
                          onClick={handleDownloadPDF}
                          className="flex items-center gap-3 px-4 py-2 bg-brand-navy text-brand-cyan rounded-xl border border-brand-navy/10 text-[10px] font-black hover:bg-brand-green hover:text-white transition-all shadow-lg"
                        >
                          <Printer size={14} />
                          <span>{t('export_pdf')}</span>
                        </button>
                     </div>
                  </div>

                  <ChartWrapper height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0F172A" />
                            <stop offset="100%" stopColor="#2DD4BF" />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis 
                          dataKey="dayName" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900 }}
                          dy={10} 
                          reversed={isRTL}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900 }}
                          orientation={isRTL ? 'right' : 'left'}
                        />
                        <Tooltip 
                          cursor={{ fill: '#F8FAFC' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className={`bg-brand-navy p-4 rounded-2xl border border-slate-800 shadow-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
                                  <p className="text-[10px] font-black text-brand-cyan uppercase tracking-widest mb-1">{payload[0].payload.dayName}</p>
                                  <p className="text-lg font-black text-white">{payload[0].value} {t('financial_item')}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar 
                          dataKey="count" 
                          radius={[10, 10, 10, 10]} 
                          barSize={40}
                        >
                          {weeklyChartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill="url(#barGradient)" 
                              fillOpacity={entry.count > 0 ? 1 : 0.1}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartWrapper>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="text-xl font-black text-brand-navy flex items-center gap-3 tracking-tighter uppercase">آخر العمليات والتوريدات</h3>
                       <button onClick={() => setActiveTab('Orders')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-brand-navy">عرض السجل الكامل</button>
                    </div>
                    <div className="space-y-4">
                       {orders.slice(0, 5).map(order => (
                         <div key={order.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 hover:shadow-xl hover:shadow-slate-200 transition-all cursor-pointer group">
                            <div className={`flex flex-col sm:flex-row items-center gap-5 ${isRTL ? 'sm:flex-row' : 'sm:flex-row'}`}>
                              <div className="w-16 h-16 rounded-2xl bg-brand-navy/5 flex items-center justify-center text-brand-navy shrink-0 group-hover:bg-brand-navy group-hover:text-white transition-colors">
                                <Briefcase size={28} />
                              </div>
                              <div className={`grow w-full ${isRTL ? 'text-right' : 'text-left'}`}>
                                <h4 className="font-black text-brand-navy text-lg">{order.clientName}</h4>
                                <p className="text-[10px] text-brand-green font-black uppercase tracking-widest mt-1.5">{order.category} • {order.status}</p>
                              </div>
                              <div className={`flex items-center gap-6 ${isRTL ? 'text-left' : 'text-right'}`}>
                                <p className="text-xl font-black text-brand-navy tracking-tighter">{(order.financials?.total || 0).toLocaleString()} $</p>
                                <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-brand-navy" onClick={() => openEditOrder(order)}><Edit2 size={16} /></button>
                              </div>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                  
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className="text-xl font-black text-brand-navy mb-6 tracking-tighter uppercase">الوصول السريع</h3>
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-4">
                       {[
                         { label: 'إنشاء طلب جديد', icon: ShoppingCart, tab: 'Orders', color: 'text-brand-green' },
                         { label: 'إضافة منتج للكتالوج', icon: Package, tab: 'Products', color: 'text-brand-cyan' },
                         { label: 'مراجعة التقارير المالية', icon: ArrowUpRight, tab: 'Finance', color: 'text-brand-navy' },
                         { label: 'تحديث اللوجستيات', icon: Truck, tab: 'Logistics', color: 'text-brand-gold' },
                       ].map((action, i) => (
                         <button 
                          key={i}
                          onClick={() => setActiveTab(action.tab)}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-brand-navy hover:text-white transition-all group"
                         >
                            <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                              <action.icon size={20} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest">{action.label}</span>
                         </button>
                       ))}
                    </div>
                  </div>
                </div>
              </>
            ) : activeTab === 'Products' ? (
              <ProductSection />
            ) : activeTab === 'Clients' || activeTab === 'Suppliers' ? (
              <UserSection type={activeTab} />
            ) : activeTab === 'Orders' ? (
              <OrderSection onEditOrder={openEditOrder} onViewInvoice={setSelectedInvoice} onAddOrder={openAddOrder} />
            ) : activeTab === 'Inventory' ? (
              <InventorySection />
            ) : activeTab === 'Finance' ? (
              <FinanceSection />
            ) : activeTab === 'Contracts' ? (
              <ContractSection />
            ) : activeTab === 'Logistics' ? (
              <LogisticsSection />
            ) : activeTab === 'Reports' ? (
              <ReportsSection />
            ) : activeTab === 'B2B' ? (
              <B2BSection />
            ) : activeTab === 'Profitability' ? (
              <ProfitAnalysisSection orders={orders} products={products} />
            ) : activeTab === 'System' ? (
              <SystemManagementSection />
            ) : activeTab === 'Settings' ? (
              <SettingsSection />
            ) : (
              <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 min-h-[600px] flex items-center justify-center p-12 text-center text-slate-300">
                <div>
                   <Package size={64} className="mx-auto mb-6 opacity-20" />
                   <h3 className="text-2xl font-black text-brand-navy tracking-tighter">{t('system_local')}</h3>
                   <p className="font-bold text-sm max-w-sm mx-auto mt-2 italic">{activeTab} {t('module_stored_locally')}</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <AddOrderModal isOpen={isAddOrderOpen} onClose={() => { setIsAddOrderOpen(false); setEditingOrder(null); }} onAdd={handleAddOrder} orderToEdit={editingOrder} />
      <InvoiceModal isOpen={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} order={selectedInvoice!} />
    </div>
  );
};
