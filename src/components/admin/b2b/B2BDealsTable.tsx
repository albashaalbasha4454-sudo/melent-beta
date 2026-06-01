import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Layers, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Edit2, 
  FileDown, 
  ChevronRight,
  MoreVertical,
  XCircle,
  Briefcase,
  BarChart3,
  Table
} from 'lucide-react';
import { B2BDeal, B2BCompany, B2BDealStage, B2BPriority, B2BPaymentTermsType } from '../../../types';
import { useLanguage } from '../../../hooks/useLanguage';
import { LocalStorageManager, MELENT_KEYS } from '../../../services/localStorageManager';
import { B2BDealDetails } from './B2BDealDetails';
import { exportDealsToExcel, exportDealsToPDF } from '../../../services/b2bExportService';

interface B2BDealsTableProps {
  deals: B2BDeal[];
  companies: B2BCompany[];
  onUpdate: (deals: B2BDeal[]) => void;
}

export const B2BDealsTable: React.FC<B2BDealsTableProps> = ({ deals, companies, onUpdate }) => {
  const { t, isRTL } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<B2BDeal | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [countryFilter, setCountryFilter] = useState<string>('All');

  // Form State
  const [formData, setFormData] = useState<Partial<B2BDeal>>({
    stage: 'New Lead',
    priority: 'Medium',
    quotation: { sent: false },
    commercial: { paymentTerms: 'Advance Payment 100%', paymentDetails: '', paymentApproved: false },
    documents: { relatedDocs: [] }
  });

  const handleAdd = () => {
    if (!formData.companyId) return;

    const company = companies.find(c => c.id === formData.companyId);
    const countrySuffix = company?.country.substring(0, 3).toUpperCase() || 'TR';
    const dealCode = `MC-DEAL-${countrySuffix}-${Math.floor(100 + Math.random() * 900)}`;

    const newDeal: B2BDeal = {
      id: dealCode,
      companyId: formData.companyId!,
      companyName: company?.name || 'Unknown',
      productName: formData.productName,
      priority: formData.priority || 'Medium',
      stage: formData.stage || 'New Lead',
      quotation: formData.quotation || { sent: false },
      commercial: formData.commercial || { paymentTerms: 'Advance Payment 100%', paymentDetails: '', paymentApproved: false },
      documents: formData.documents || { relatedDocs: [] },
      createdAt: new Date().toISOString()
    };

    const updated = [newDeal, ...deals];
    onUpdate(updated);
    LocalStorageManager.save(MELENT_KEYS.B2B_DEALS, updated);
    setIsModalOpen(false);
    setFormData({
      stage: 'New Lead',
      priority: 'Medium',
      quotation: { sent: false },
      commercial: { paymentTerms: 'Advance Payment 100%', paymentDetails: '', paymentApproved: false },
      documents: { relatedDocs: [] }
    });
  };

  const filtered = deals.filter(d => {
    const matchesSearch = d.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         d.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || d.stage === statusFilter;
    const matchesPriority = priorityFilter === 'All' || d.priority === priorityFilter;
    
    // Find company to check country
    const company = companies.find(c => c.id === d.companyId);
    const matchesCountry = countryFilter === 'All' || company?.country === countryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCountry;
  });

  const countries = Array.from(new Set(companies.map(c => c.country))).sort();
  const stages: B2BDealStage[] = ['New Lead', 'Qualified', 'Opportunity', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'];
  const priorities: B2BPriority[] = ['High', 'Medium', 'Low'];

  const getStageColor = (stage: B2BDealStage) => {
    switch (stage) {
      case 'New Lead': return 'bg-blue-50 text-blue-500';
      case 'Qualified': return 'bg-cyan-50 text-cyan-500';
      case 'Opportunity': return 'bg-indigo-50 text-indigo-500';
      case 'Proposal Sent': return 'bg-amber-50 text-amber-500';
      case 'Negotiation': return 'bg-purple-50 text-purple-500';
      case 'Closed Won': return 'bg-green-50 text-green-500';
      case 'Closed Lost': return 'bg-red-50 text-red-500';
      default: return 'bg-slate-50 text-slate-500';
    }
  };

  if (selectedDeal) {
    return <B2BDealDetails deal={selectedDeal} onBack={() => setSelectedDeal(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-300`} size={18} />
          <input 
            type="text" 
            placeholder={t('search_deals')} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-white border border-slate-100 rounded-2xl py-3 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-sm font-bold shadow-sm outline-none focus:border-brand-navy/20`}
          />
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => exportDealsToExcel(filtered, companies)}
            className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-brand-green hover:border-brand-green/20 transition-all shadow-sm group"
            title="Export to Excel"
          >
            <Table size={18} />
          </button>
          <button 
            onClick={() => exportDealsToPDF(filtered, companies)}
            className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-red-500 hover:border-red-500/20 transition-all shadow-sm group"
            title="Export to PDF"
          >
            <FileDown size={18} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-navy text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-brand-green transition-all shadow-xl"
          >
            <Plus size={16} />
            {t('create_deal')}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-2">Status</label>
          <select 
            className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-brand-navy outline-none shadow-sm focus:border-brand-navy/20 appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {stages.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-2">Priority</label>
          <select 
            className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-brand-navy outline-none shadow-sm focus:border-brand-navy/20 appearance-none"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>
            {priorities.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-2">Country</label>
          <select 
            className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-brand-navy outline-none shadow-sm focus:border-brand-navy/20 appearance-none"
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
          >
            <option value="All">All Countries</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button 
          onClick={() => {
            setStatusFilter('All');
            setPriorityFilter('All');
            setCountryFilter('All');
            setSearchQuery('');
          }}
          className="self-end mb-1 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-navy transition-all"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(deal => (
          <div 
            key={deal.id} 
            onClick={() => setSelectedDeal(deal)}
            className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all cursor-pointer group"
          >
            <div className={`flex flex-col lg:flex-row lg:items-center gap-6 ${isRTL ? 'lg:flex-row' : 'lg:flex-row'}`}>
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-navy group-hover:bg-brand-navy group-hover:text-white transition-all shrink-0">
                <Layers size={24} />
              </div>
              
              <div className={`grow ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-brand-green uppercase tracking-widest">{deal.id}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${
                    deal.priority === 'High' ? 'bg-red-100 text-red-600' : 
                    deal.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {deal.priority}
                  </span>
                </div>
                <h4 className="text-lg font-black text-brand-navy">{deal.companyName}</h4>
                <p className="text-xs font-bold text-slate-400 mt-0.5">{deal.productName || 'General Inquiry'}</p>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex flex-col items-center">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('deal_stage')}</p>
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase ${getStageColor(deal.stage)}`}>
                    {deal.stage}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('total')}</p>
                  <p className="text-sm font-black text-brand-navy">{deal.quotation.valueUSD?.toLocaleString() || 0} $</p>
                </div>

                <ChevronRight size={20} className={`text-slate-200 group-hover:text-brand-navy transition-all ${isRTL ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-[3rem] py-20 border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
             <BarChart3 size={48} className="mb-4 opacity-20" />
             <p className="font-bold italic">No deals found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Create Deal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-brand-navy/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
             <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className="text-2xl font-black text-brand-navy tracking-tighter uppercase">{t('create_deal')}</h3>
                <p className="text-[10px] font-black text-brand-green uppercase tracking-widest mt-1">Opportunity Management</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-navy transition-all shadow-sm">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="text-sm font-black text-brand-navy uppercase tracking-widest border-b border-brand-navy/10 pb-2">Opportunity Context</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('company')} *</label>
                        <select 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all appearance-none"
                          value={formData.companyId || ''}
                          onChange={(e) => setFormData({...formData, companyId: e.target.value})}
                        >
                          <option value="">-- {t('select_company')} --</option>
                          {companies.map(c => (
                            <option key={c.id} value={c.id}>{c.name} ({c.country})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('product')} Name</label>
                        <input 
                          type="text" 
                          value={formData.productName || ''}
                          onChange={(e) => setFormData({...formData, productName: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('priority')}</label>
                          <select 
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all appearance-none"
                            value={formData.priority || 'Medium'}
                            onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                          >
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('deal_stage')}</label>
                          <select 
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all appearance-none"
                            value={formData.stage || 'New Lead'}
                            onChange={(e) => setFormData({...formData, stage: e.target.value as any})}
                          >
                            <option>New Lead</option>
                            <option>Qualified</option>
                            <option>Opportunity</option>
                            <option>Proposal Sent</option>
                            <option>Negotiation</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-sm font-black text-brand-navy uppercase tracking-widest border-b border-brand-navy/10 pb-2">Commercial Brief</h4>
                    <div className="space-y-4">
                       <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('payment_terms')}</label>
                        <select 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all appearance-none"
                          value={formData.commercial?.paymentTerms || 'Advance Payment 100%'}
                          onChange={(e) => setFormData({...formData, commercial: {...formData.commercial!, paymentTerms: e.target.value as any}})}
                        >
                          <option>Advance Payment 100%</option>
                          <option>50% Advance + 50% on Delivery</option>
                          <option>LC</option>
                          <option>Promissory Note / Bank Guarantee</option>
                          <option>Custom</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('payment_details')}</label>
                        <textarea 
                          value={formData.commercial?.paymentDetails || ''}
                          onChange={(e) => setFormData({...formData, commercial: {...formData.commercial!, paymentDetails: e.target.value}})}
                          placeholder="Specific agreement details..."
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all h-32"
                        />
                      </div>
                       <div className="flex items-center gap-3">
                         <input 
                           type="checkbox" 
                           id="payment-approved"
                           checked={formData.commercial?.paymentApproved || false}
                           onChange={(e) => setFormData({...formData, commercial: {...formData.commercial!, paymentApproved: e.target.checked}})}
                           className="w-5 h-5 rounded-lg border-slate-200 text-brand-navy focus:ring-brand-navy"
                         />
                         <label htmlFor="payment-approved" className="text-[10px] font-black text-brand-navy uppercase tracking-widest">{t('payment_approved')} (Internal)</label>
                       </div>
                    </div>
                  </div>
               </div>
            </div>

            <div className="p-8 border-t border-slate-50 flex items-center justify-end gap-4 bg-slate-50/50">
               <button 
                 onClick={() => setIsModalOpen(false)}
                 className="px-8 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-navy transition-all"
               >
                 {t('cancel')}
               </button>
               <button 
                 onClick={handleAdd}
                 className="px-10 py-3.5 bg-brand-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-navy/10 hover:bg-brand-green transition-all"
               >
                 {t('create_deal')}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
