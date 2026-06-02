import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart as PieChartIcon, 
  BarChart as BarChartIcon, 
  Activity, 
  AlertCircle,
  FileDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie,
  Legend
} from 'recharts';
import { MedicalOrder, Product } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { generateProfitAnalysisPDF } from '../../services/pdfService';

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

interface ProfitAnalysisSectionProps {
  orders: MedicalOrder[];
  products: Product[];
}

export const ProfitAnalysisSection: React.FC<ProfitAnalysisSectionProps> = ({ orders, products }) => {
  const { t, isRTL } = useLanguage();

  const profitabilityData = useMemo(() => {
    // 1. Calculate profit per product
    const productStats: Record<string, { name: string, revenue: number, cost: number, quantity: number, category: string }> = {};

    orders.forEach(order => {
      // Only non-cancelled orders count for profit analysis as per new centralized business logic
      if (order.status !== 'Cancelled' && order.status !== 'Rejected') {
        order.items.forEach(item => {
          const product = products.find(p => p.id === item.productId);
          const unitCost = product?.purchasePrice || 0;
          
          if (!productStats[item.productId]) {
            productStats[item.productId] = {
              name: item.name,
              revenue: 0,
              cost: 0,
              quantity: 0,
              category: item.category
            };
          }
          
          productStats[item.productId].revenue += item.total;
          productStats[item.productId].cost += (unitCost * item.quantity);
          productStats[item.productId].quantity += item.quantity;
        });
      }
    });

    const items = Object.entries(productStats).map(([id, stats]) => {
      const profit = stats.revenue - stats.cost;
      const margin = stats.revenue > 0 ? (profit / stats.revenue) * 100 : 0;
      return { id, ...stats, profit, margin };
    }).sort((a, b) => b.profit - a.profit);

    // 2. Category Analysis
    const categoryStats: Record<string, { profit: number, revenue: number }> = {};
    items.forEach(item => {
      if (!categoryStats[item.category]) {
        categoryStats[item.category] = { profit: 0, revenue: 0 };
      }
      categoryStats[item.category].profit += item.profit;
      categoryStats[item.category].revenue += item.revenue;
    });

    const categories = Object.entries(categoryStats).map(([name, stats]) => ({
      name,
      value: Math.max(0, stats.profit),
      revenue: stats.revenue
    }));

    return { items, categories };
  }, [orders, products]);

  const COLORS = ['#00234b', '#00d084', '#00c4cc', '#84cc16', '#d4af37', '#f43f5e'];

  return (
    <div id="profit-report-container" className="space-y-10 p-2">
      <div className="flex items-center justify-between">
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <p className="text-[10px] font-black uppercase text-brand-green tracking-[0.3em] mb-1">{t('active_global')}</p>
          <h2 className="text-3xl font-black text-brand-navy tracking-tighter uppercase">{t('profit_analysis')}</h2>
        </div>
        <button 
          onClick={() => generateProfitAnalysisPDF('profit-report-container', t('profit_analysis'), isRTL)}
          className="flex items-center gap-3 px-6 py-3 bg-brand-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          <FileDown size={14} className="text-brand-cyan" />
          {t('export')}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col gap-4">
           <div className="w-14 h-14 rounded-2xl bg-brand-navy flex items-center justify-center text-white shadow-lg">
             <Activity size={26} />
           </div>
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t('average_profit')}</p>
             <p className="text-2xl font-black text-brand-navy tracking-tighter">
               {(profitabilityData.items.reduce((acc, i) => acc + i.profit, 0) / (profitabilityData.items.length || 1)).toLocaleString()} $
             </p>
           </div>
        </div>
        <div className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col gap-4">
           <div className="w-14 h-14 rounded-2xl bg-brand-green flex items-center justify-center text-white shadow-lg">
             <ArrowUpRight size={26} />
           </div>
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t('profit_margin')}</p>
             <p className="text-2xl font-black text-brand-navy tracking-tighter">
               {(profitabilityData.items.reduce((acc, i) => acc + i.revenue, 0) > 0 
                  ? (profitabilityData.items.reduce((acc, i) => acc + i.profit, 0) / profitabilityData.items.reduce((acc, i) => acc + i.revenue, 0)) * 100 
                  : 0).toFixed(1)}%
             </p>
           </div>
        </div>
        <div className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col gap-4">
           <div className="w-14 h-14 rounded-2xl bg-brand-gold flex items-center justify-center text-white shadow-lg">
             <AlertCircle size={26} />
           </div>
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t('profitability_index')}</p>
             <p className="text-2xl font-black text-brand-navy tracking-tighter">A+ Optimal</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products Chart */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-navy flex items-center justify-center text-brand-cyan">
              <BarChartIcon size={24} />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h3 className="text-xl font-black text-brand-navy tracking-tighter">{t('top_products_by_profit')}</h3>
              <p className="text-[10px] font-black text-brand-green uppercase tracking-widest mt-0.5">{t('revenue_vs_cost')}</p>
            </div>
          </div>

          <ChartWrapper height={300}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitabilityData.items.slice(0, 5)} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
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
                          <p className="text-[10px] font-black text-brand-cyan uppercase tracking-widest mb-1">{payload[0].payload.name}</p>
                          <p className="text-lg font-black text-white">{payload[0].value.toLocaleString()} {t('currency_label') || '$'}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-1">{t('unit_profit')}: {payload[0].payload.margin.toFixed(1)}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="profit" radius={[10, 10, 10, 10]} barSize={40}>
                  {profitabilityData.items.slice(0, 5).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>

        {/* Category Profitability */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green">
              <PieChartIcon size={24} />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h3 className="text-xl font-black text-brand-navy tracking-tighter">{t('category_profitability')}</h3>
              <p className="text-[10px] font-black text-brand-green uppercase tracking-widest mt-0.5">{t('margin_analysis')}</p>
            </div>
          </div>

          <ChartWrapper height={300}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={profitabilityData.categories}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {profitabilityData.categories.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.1)" />
                  ))}
                </Pie>
                <Tooltip 
                   content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className={`bg-brand-navy p-4 rounded-2xl border border-slate-800 shadow-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
                          <p className="text-[10px] font-black text-brand-cyan uppercase tracking-widest mb-1">{payload[0].name}</p>
                          <p className="text-lg font-black text-white">{payload[0].value.toLocaleString()} $</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  iconType="circle"
                  formatter={(value) => <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>
      </div>

      {/* Detailed Analysis Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-brand-navy tracking-tighter uppercase">{t('profit_per_item')}</h3>
            <button className="flex items-center gap-2 text-brand-green text-[10px] font-black uppercase tracking-widest">
                <TrendingUp size={14} />
                {t('high_profit_items')}
            </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right" dir={isRTL ? 'rtl' : 'ltr'}>
            <thead>
              <tr className="bg-slate-50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('name')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t('quantity')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t('revenue')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t('unit_profit')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t('margin')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {profitabilityData.items.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-black text-brand-navy">{item.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{item.category}</p>
                  </td>
                  <td className="px-8 py-5 text-center font-bold text-slate-600">{item.quantity}</td>
                  <td className="px-8 py-5 text-center font-black text-brand-navy">{item.revenue.toLocaleString()} $</td>
                  <td className="px-8 py-5 text-center font-black text-brand-green">{item.profit.toLocaleString()} $</td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${item.margin > 20 ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'}`}>
                      {item.margin.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
