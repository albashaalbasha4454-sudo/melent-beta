import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Users, 
  Layers, 
  Clock, 
  Settings, 
  Plus, 
  Search, 
  Filter, 
  FileDown, 
  ArrowUpRight, 
  BarChart3,
  TrendingUp,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useData } from '../../hooks/useData';
import { B2BCompany, B2BDeal, B2BFollowUp, B2BProductB2B } from '../../types';

// Sub-components (we will define them in separate files for better modularity)
import { B2BDashboard } from './b2b/B2BDashboard';
import { B2BCompaniesTable } from './b2b/B2BCompaniesTable';
import { B2BDealsTable } from './b2b/B2BDealsTable';
import { B2BFollowUpsTable } from './b2b/B2BFollowUpsTable';
import { B2BPortfolioSection } from './b2b/B2BPortfolioSection';

export const B2BSection: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Companies' | 'Deals' | 'FollowUps' | 'Products'>('Dashboard');
  
  const { 
    b2bCompanies: companies, 
    b2bDeals: deals, 
    b2bFollowUps: followUps, 
    b2bProducts: products,
    setB2BCompanies,
    setB2BDeals,
    setB2BFollowUps,
    setB2BProducts
  } = useData();

  const tabs = [
    { id: 'Dashboard', label: t('dashboard'), icon: BarChart3 },
    { id: 'Companies', label: t('companies'), icon: Users },
    { id: 'Deals', label: t('deals'), icon: Layers },
    { id: 'FollowUps', label: t('follow_ups'), icon: Clock },
    { id: 'Products', label: t('b2b_products'), icon: Briefcase },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <p className="text-[10px] font-black uppercase text-brand-green tracking-[0.3em] mb-1">
            B2B Business Intelligence
          </p>
          <h2 className="text-3xl font-black text-brand-navy tracking-tighter uppercase">
            تطوير الأعمال والشركات
          </h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-navy text-white shadow-lg shadow-brand-navy/20'
                  : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={14} className={activeTab === tab.id ? 'text-brand-cyan' : ''} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[600px]">
        {activeTab === 'Dashboard' && (
          <B2BDashboard companies={companies} deals={deals} followUps={followUps} />
        )}
        {activeTab === 'Companies' && (
          <B2BCompaniesTable companies={companies} onUpdate={setB2BCompanies} />
        )}
        {activeTab === 'Deals' && (
          <B2BDealsTable deals={deals} companies={companies} onUpdate={setB2BDeals} />
        )}
        {activeTab === 'FollowUps' && (
          <B2BFollowUpsTable followUps={followUps} deals={deals} onUpdate={setB2BFollowUps} />
        )}
        {activeTab === 'Products' && (
          <B2BPortfolioSection products={products} onUpdate={setB2BProducts} />
        )}
      </div>
    </div>
  );
};
