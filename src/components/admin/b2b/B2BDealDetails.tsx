import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Building2, 
  Layers, 
  FileText, 
  Upload, 
  FileDown, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Mail, 
  Phone, 
  MapPin,
  Clock,
  DollarSign,
  AlertCircle,
  Globe
} from 'lucide-react';
import { B2BDeal, B2BDealStage } from '../../../types';
import { useLanguage } from '../../../hooks/useLanguage';
import { LocalStorageManager, MELENT_KEYS } from '../../../services/localStorageManager';

interface B2BDealDetailsProps {
  deal: B2BDeal;
  onBack: () => void;
}

export const B2BDealDetails: React.FC<B2BDealDetailsProps> = ({ deal, onBack }) => {
  const { t, isRTL } = useLanguage();
  const [activeDeal, setActiveDeal] = useState<B2BDeal>(deal);
  const [isClosureModalOpen, setIsClosureModalOpen] = useState(false);

  // Closure Form State
  const [closureData, setClosureData] = useState({
    outcome: 'Won' as 'Won' | 'Lost',
    reason: '',
    notes: ''
  });

  const handleCloseDeal = () => {
    const updatedDeal: B2BDeal = {
      ...activeDeal,
      stage: closureData.outcome === 'Won' ? 'Closed Won' : 'Closed Lost',
      closure: {
        isClosed: true,
        outcome: closureData.outcome,
        reason: closureData.reason,
        closedAt: new Date().toISOString(),
        notes: closureData.notes
      }
    };

    setActiveDeal(updatedDeal);
    const allDeals: B2BDeal[] = LocalStorageManager.get(MELENT_KEYS.B2B_DEALS) || [];
    const updatedAll = allDeals.map(d => d.id === updatedDeal.id ? updatedDeal : d);
    LocalStorageManager.save(MELENT_KEYS.B2B_DEALS, updatedAll);
    setIsClosureModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-brand-navy transition-all font-black text-[10px] uppercase tracking-widest"
        >
          <ChevronLeft size={16} />
          {t('back_to_list')}
        </button>
        
        {!activeDeal.closure?.isClosed && (
          <button 
            onClick={() => setIsClosureModalOpen(true)}
            className="px-8 py-3 bg-brand-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-green transition-all shadow-xl shadow-brand-navy/10"
          >
            {t('close_deal')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="flex items-center gap-6 relative z-10">
                <div className="w-20 h-20 rounded-[2rem] bg-brand-navy flex items-center justify-center text-brand-cyan shadow-xl shrink-0">
                  <Layers size={36} />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-brand-green tracking-widest uppercase">{activeDeal.id}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      activeDeal.stage === 'Closed Won' ? 'bg-green-50 text-green-500' :
                      activeDeal.stage === 'Closed Lost' ? 'bg-red-50 text-red-500' :
                      'bg-blue-50 text-blue-500'
                    }`}>
                      {activeDeal.stage}
                    </span>
                  </div>
                  <h2 className="text-3xl font-black text-brand-navy tracking-tighter uppercase">{activeDeal.companyName}</h2>
                  <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{activeDeal.productName || 'Strategic B2B Partnership'}</p>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
          </div>

          {/* Quotation & Commercial */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green">
                  <DollarSign size={24} />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-xl font-black text-brand-navy tracking-tighter uppercase">{t('commercial')} & {t('financials')}</h3>
                  <p className="text-[10px] font-black text-brand-green uppercase tracking-widest mt-0.5">Agreement Values</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('quotation_value')}</p>
                    <p className="text-3xl font-black text-brand-navy tracking-tighter">{activeDeal.quotation.valueUSD?.toLocaleString() || 0} <span className="text-sm">USD</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('payment_terms')}</p>
                    <p className="font-black text-brand-navy">{activeDeal.commercial.paymentTerms}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('payment_details')}</p>
                    <p className="text-sm text-slate-600 font-bold leading-relaxed">{activeDeal.commercial.paymentDetails || 'Terms pending final negotiation.'}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-brand-navy text-white px-6 py-4 rounded-2xl">
                    {activeDeal.commercial.paymentApproved ? <CheckCircle2 className="text-brand-cyan" /> : <AlertCircle className="text-brand-gold" />}
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                       <p className="text-[10px] font-black uppercase tracking-widest">{t('payment_approved')}</p>
                       <p className="text-xs font-black">{activeDeal.commercial.paymentApproved ? 'AUTHORIZED' : 'PENDING REVIEW'}</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>

          {/* Documents Archive */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
             <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-navy/5 flex items-center justify-center text-brand-navy">
                    <FileText size={24} />
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className="text-xl font-black text-brand-navy tracking-tighter uppercase">{t('documents')} & {t('files')}</h3>
                    <p className="text-[10px] font-black text-brand-green uppercase tracking-widest mt-0.5">Commercial Archive</p>
                  </div>
               </div>
               <button className="flex items-center gap-2 px-6 py-3 bg-brand-navy/10 text-brand-navy rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-navy hover:text-white transition-all">
                 <Upload size={14} />
                 {t('upload_doc')}
               </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {[
                 { label: 'Quotation File', status: 'Sent', date: '2024-05-20' },
                 { label: 'Agreement / Contract', status: 'Draft', date: 'Pending' },
                 { label: 'Client Request / RFQ', status: 'Verified', date: '2024-05-18' },
               ].map((doc, i) => (
                 <div key={i} className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex flex-col gap-4 group hover:bg-white hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between">
                       <FileText size={20} className="text-brand-navy" />
                       <span className="text-[8px] font-black text-brand-green bg-white px-2 py-1 rounded-md shadow-sm">{doc.status}</span>
                    </div>
                    <div>
                      <p className="text-xs font-black text-brand-navy truncate">{doc.label}</p>
                      <p className="text-[9px] font-bold text-slate-400 mt-1">{doc.date}</p>
                    </div>
                    <button className="w-full py-2.5 bg-white border border-slate-100 rounded-xl flex items-center justify-center gap-2 group-hover:bg-brand-navy group-hover:text-white transition-all">
                       <FileDown size={14} />
                       <span className="text-[9px] font-black uppercase tracking-widest">Download</span>
                    </button>
                 </div>
               ))}
             </div>
          </div>
        </div>

        <div className="space-y-8">
           {/* Company Quick Bio */}
           <div className="bg-brand-navy p-8 rounded-[3rem] text-white shadow-xl shadow-brand-navy/10 relative overflow-hidden">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-brand-cyan">
                  <Building2 size={24} />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-lg font-black tracking-tight">{t('company')} Bio</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Qualified Entity</p>
                </div>
             </div>
             
             <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Globe className="text-brand-cyan shrink-0" size={18} />
                  <div>
                    <p className="text-[8px] text-white/40 uppercase tracking-widest leading-none mb-1">HQ Location</p>
                    <p className="text-xs font-black">{deal.companyName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="text-brand-cyan shrink-0" size={18} />
                  <div>
                    <p className="text-[8px] text-white/40 uppercase tracking-widest leading-none mb-1">Contact Hub</p>
                    <p className="text-xs font-black">Direct Secure Channel</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <TrendingUp className="text-brand-cyan shrink-0" size={18} />
                  <div>
                    <p className="text-[8px] text-white/40 uppercase tracking-widest leading-none mb-1">Project Priority</p>
                    <p className="text-xs font-black uppercase">{deal.priority} IMPACT NODE</p>
                  </div>
                </div>
             </div>
             
             <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-green/20 rounded-full blur-3xl -mb-16 -mr-16"></div>
           </div>

           {/* Closure Recap */}
           {activeDeal.closure?.isClosed && (
             <div className="bg-green-50 p-8 rounded-[2.5rem] border border-green-100 animate-in zoom-in duration-500">
                <div className="flex items-center gap-3 mb-6">
                  {activeDeal.closure.outcome === 'Won' ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />}
                  <h3 className="text-lg font-black text-brand-navy tracking-tight">Closure Summary</h3>
                </div>
                <div className="space-y-4">
                   <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Outcome</p>
                     <p className={`text-xl font-black ${activeDeal.closure.outcome === 'Won' ? 'text-green-600' : 'text-red-600'}`}>{activeDeal.closure.outcome}</p>
                   </div>
                   <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Reason</p>
                     <p className="text-xs font-bold text-slate-600">{activeDeal.closure.reason}</p>
                   </div>
                   <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Notes</p>
                     <p className="text-xs font-bold text-slate-600 italic">"{activeDeal.closure.notes}"</p>
                   </div>
                   <div className="pt-4 border-t border-green-100">
                     <p className="text-[9px] font-bold text-slate-400 leading-none">Closed on {new Date(activeDeal.closure.closedAt!).toLocaleDateString()}</p>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Closure Modal */}
      {isClosureModalOpen && (
        <div className="fixed inset-0 bg-brand-navy/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
             <div className="p-8 border-b border-slate-50 flex items-center justify-between">
               <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-2xl font-black text-brand-navy tracking-tighter uppercase">{t('close_deal')}</h3>
                  <p className="text-[10px] font-black text-brand-green uppercase tracking-widest mt-1">Final Outcome Report</p>
               </div>
               <button onClick={() => setIsClosureModalOpen(false)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-brand-navy transition-all">
                  <XCircle size={20} />
               </button>
             </div>
             
             <div className="p-8 space-y-6">
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Final Outcome *</label>
                   <div className="flex gap-4">
                      {['Won', 'Lost'].map(outcome => (
                        <button
                          key={outcome}
                          onClick={() => setClosureData({...closureData, outcome: outcome as any})}
                          className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                            closureData.outcome === outcome 
                              ? (outcome === 'Won' ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-red-500 text-white shadow-lg shadow-red-200')
                              : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                          }`}
                        >
                          {outcome === 'Won' ? <CheckCircle2 className="inline mr-2" size={14} /> : <XCircle className="inline mr-2" size={14} />}
                          {outcome}
                        </button>
                      ))}
                   </div>
                </div>
                
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('closure_reason')}</label>
                   <select 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all appearance-none"
                      value={closureData.reason}
                      onChange={(e) => setClosureData({...closureData, reason: e.target.value})}
                   >
                     <option value="">-- {t('select_reason')} --</option>
                     <option>Deal completed successfully</option>
                     <option>Price competition</option>
                     <option>Competitor advantage</option>
                     <option>Payment terms conflict</option>
                     <option>Client no response</option>
                     <option>Regulatory hurdles</option>
                     <option>Budget constraints</option>
                     <option>Other</option>
                   </select>
                </div>
                
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Final Summary Notes</label>
                   <textarea 
                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all h-24"
                     placeholder="1-2 lines brief..."
                     value={closureData.notes}
                     onChange={(e) => setClosureData({...closureData, notes: e.target.value})}
                   />
                </div>
             </div>
             
             <div className="p-8 border-t border-slate-50 flex items-center justify-end gap-4 bg-slate-50/50">
                <button onClick={() => setIsClosureModalOpen(false)} className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('cancel')}</button>
                <button 
                  onClick={handleCloseDeal}
                  disabled={!closureData.reason}
                  className="px-10 py-3.5 bg-brand-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-green transition-all shadow-xl shadow-brand-navy/10 disabled:opacity-50"
                >
                   Confirm Closure
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
