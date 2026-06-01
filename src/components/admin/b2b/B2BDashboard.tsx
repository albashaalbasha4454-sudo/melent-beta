import React, { useMemo } from 'react';
import { 
  Users, 
  Layers, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  TrendingUp,
  BarChart3,
  Globe,
  Briefcase,
  ArrowUpRight
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
  Pie
} from 'recharts';
import { B2BCompany, B2BDeal, B2BFollowUp } from '../../../types';
import { useLanguage } from '../../../hooks/useLanguage';

interface B2BDashboardProps {
  companies: B2BCompany[];
  deals: B2BDeal[];
  followUps: B2BFollowUp[];
}

export const B2BDashboard: React.FC<B2BDashboardProps> = ({ companies, deals, followUps }) => {
  const { t, isRTL } = useLanguage();

  const stats = useMemo(() => {
    const activeDeals = deals.filter(d => !d.closure?.isClosed).length;
    const wonDeals = deals.filter(d => d.closure?.outcome === 'Won').length;
    const lostDeals = deals.filter(d => d.closure?.outcome === 'Lost').length;
    const totalValue = deals.reduce((acc, d) => acc + (d.quotation?.valueUSD || 0), 0);
    
    // Follow-ups due today
    const today = new Date().toISOString().split('T')[0];
    const followUpsToday = followUps.filter(f => f.nextFollowUpDate === today).length;
    const pendingFollowUps = followUps.filter(f => new Date(f.nextFollowUpDate) >= new Date()).length;

    return { activeDeals, wonDeals, lostDeals, totalValue, followUpsToday, pendingFollowUps };
  }, [deals, followUps]);

  const pipelineData = useMemo(() => {
    const stages = ['New Lead', 'Qualified', 'Opportunity', 'Proposal Sent', 'Negotiation'];
    return stages.map(s => ({
      name: s,
      count: deals.filter(d => d.stage === s).length
    }));
  }, [deals]);

  const categoryDistribution = useMemo(() => {
    const cats = [
      'Dermocosmetics', 
      'Medical Aesthetic Devices', 
      'Medical & Healthcare Devices', 
      'Disposable Medical Products', 
      'General Medical Supplies', 
      'Supplements & Nutrition'
    ];
    return cats.map(cat => ({
      name: cat,
      value: companies.filter(c => c.qualification.interestedCategories.includes(cat as any)).length
    })).filter(c => c.value > 0);
  }, [companies]);

  const COLORS = ['#00234b', '#00d084', '#00c4cc', '#84cc16', '#d4af37', '#6366f1'];

  return (
    <div className="space-y-10">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {[
          { label: t('companies'), value: companies.length, icon: Users, color: 'bg-brand-navy' },
          { label: 'Total Deal Value', value: `$${stats.totalValue.toLocaleString()}`, icon: TrendingUp, color: 'bg-brand-green' },
          { label: t('deals'), value: stats.activeDeals, icon: Layers, color: 'bg-brand-cyan' },
          { label: 'Won / Lost', value: `${stats.wonDeals} / ${stats.lostDeals}`, icon: CheckCircle2, color: 'bg-slate-400' },
          { label: 'Due Today', value: stats.followUpsToday, icon: Clock, color: 'bg-red-500' },
          { label: 'Total Pending', value: stats.pendingFollowUps, icon: BarChart3, color: 'bg-brand-gold' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center text-white shadow-md`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <p className="text-xl font-black text-brand-navy tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pipeline Chart */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-navy flex items-center justify-center text-brand-cyan">
              <TrendingUp size={24} />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h3 className="text-xl font-black text-brand-navy tracking-tighter uppercase">{t('deals')} {t('pipeline')}</h3>
              <p className="text-[10px] font-black text-brand-green uppercase tracking-widest mt-0.5">Commercial Progress</p>
            </div>
          </div>

          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900 }}
                  width={100}
                />
                <Tooltip 
                   cursor={{ fill: '#F8FAFC' }}
                   contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900 }}
                />
                <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={20}>
                  {pipelineData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green">
              <Globe size={24} />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h3 className="text-xl font-black text-brand-navy tracking-tighter uppercase">Market Interest</h3>
              <p className="text-[10px] font-black text-brand-green uppercase tracking-widest mt-0.5">Category Distribution</p>
            </div>
          </div>

          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution.length > 0 ? categoryDistribution : [{ name: 'No Data', value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(categoryDistribution.length > 0 ? categoryDistribution : [{ name: 'No Data', value: 1 }]).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

       {/* Top Recent Deals */}
       <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-brand-navy tracking-tighter uppercase">{t('recent_contracts')}</h3>
            <button className="flex items-center gap-2 text-brand-green text-[10px] font-black uppercase tracking-widest">
                <ArrowUpRight size={14} />
                {t('view_all')}
            </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right" dir={isRTL ? 'rtl' : 'ltr'}>
            <thead>
              <tr className="bg-slate-50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('id')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('company')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('status')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('total')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {deals.slice(0, 5).map(deal => (
                <tr key={deal.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5 text-[10px] font-black text-brand-navy font-mono uppercase">{deal.id}</td>
                  <td className="px-8 py-5">
                    <p className="font-black text-brand-navy">{deal.companyName}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{deal.productName || 'General Deal'}</p>
                  </td>
                  <td className="px-8 py-5">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                       deal.stage === 'Closed Won' ? 'bg-green-50 text-green-500' :
                       deal.stage === 'Closed Lost' ? 'bg-red-50 text-red-500' :
                       'bg-blue-50 text-blue-500'
                     }`}>
                       {deal.stage}
                     </span>
                  </td>
                  <td className="px-8 py-5 font-black text-brand-navy">
                    {deal.quotation.valueUSD?.toLocaleString() || 0} $
                  </td>
                </tr>
              ))}
              {deals.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-10 text-center text-slate-300 font-bold italic">No active B2B deals found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
