import React, { useState } from 'react';
import { Plus, Search, Clock, Phone, Mail, MessageSquare, Handshake, ChevronRight, CheckCircle2, XCircle, MoreVertical } from 'lucide-react';
import { B2BFollowUp, B2BDeal, B2BCommunicationType } from '../../../types';
import { useLanguage } from '../../../hooks/useLanguage';
import { LocalStorageManager, MELENT_KEYS } from '../../../services/localStorageManager';

interface B2BFollowUpsTableProps {
  followUps: B2BFollowUp[];
  deals: B2BDeal[];
  onUpdate: (followUps: B2BFollowUp[]) => void;
}

export const B2BFollowUpsTable: React.FC<B2BFollowUpsTableProps> = ({ followUps, deals, onUpdate }) => {
  const { t, isRTL } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<B2BFollowUp>>({
    communicationType: 'Call',
    interestLevel: 'Medium',
    date: new Date().toISOString().split('T')[0],
    nextStep: 'Follow-up call'
  });

  const handleAdd = () => {
    if (!formData.dealId) return;

    const deal = deals.find(d => d.id === formData.dealId);
    
    const newFollowUp: B2BFollowUp = {
      id: `FU-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      dealId: formData.dealId!,
      companyName: deal?.companyName || 'Unknown',
      contactPerson: deal?.companyName || 'Unknown', // In a real app we'd get the actual contact person
      date: formData.date || new Date().toISOString(),
      communicationType: formData.communicationType || 'Call',
      interestLevel: formData.interestLevel || 'Medium',
      notes: formData.notes || '',
      nextStep: formData.nextStep || 'Follow-up call',
      nextFollowUpDate: formData.nextFollowUpDate || ''
    };

    const updated = [newFollowUp, ...followUps];
    onUpdate(updated);
    LocalStorageManager.save(MELENT_KEYS.B2B_FOLLOWUPS, updated);
    setIsModalOpen(false);
    setFormData({
      communicationType: 'Call',
      interestLevel: 'Medium',
      date: new Date().toISOString().split('T')[0],
      nextStep: 'Follow-up call'
    });
  };

  const filtered = followUps.filter(f => 
    f.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.dealId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCommIcon = (type: B2BCommunicationType) => {
    switch (type) {
      case 'Call': return <Phone size={14} />;
      case 'WhatsApp': return <MessageSquare size={14} />;
      case 'Email': return <Mail size={14} />;
      case 'Meeting': return <Handshake size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-300`} size={18} />
          <input 
            type="text" 
            placeholder={t('search_followups')} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-white border border-slate-100 rounded-2xl py-3 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-sm font-bold shadow-sm outline-none focus:border-brand-navy/20`}
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-navy text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-brand-green transition-all shadow-xl"
        >
          <Plus size={16} />
          {t('add_follow_up')}
        </button>
      </div>

      <div className="space-y-4">
        {filtered.map(f => (
          <div key={f.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center gap-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              f.interestLevel === 'High' ? 'bg-green-50 text-green-500' :
              f.interestLevel === 'Medium' ? 'bg-amber-50 text-amber-500' :
              'bg-slate-50 text-slate-400'
            }`}>
              {getCommIcon(f.communicationType)}
            </div>

            <div className={`grow ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-[10px] font-black text-brand-green uppercase tracking-widest">{f.dealId}</span>
                 <span className="text-[10px] font-bold text-slate-400">•</span>
                 <span className="text-[10px] font-bold text-slate-400">{new Date(f.date).toLocaleDateString()}</span>
              </div>
              <h4 className="text-lg font-black text-brand-navy">{f.companyName}</h4>
              <p className="text-sm font-bold text-slate-600 mt-1 line-clamp-1 italic">"{f.notes}"</p>
            </div>

            <div className="flex flex-wrap items-center gap-6">
               <div className="flex flex-col items-center">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('next_step')}</p>
                  <span className="px-4 py-1.5 bg-brand-navy/5 text-brand-navy rounded-xl text-[10px] font-black uppercase">
                    {f.nextStep}
                  </span>
               </div>
               <div className="flex flex-col items-center">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('next_follow_up')}</p>
                  <p className="text-xs font-black text-brand-navy">{f.nextFollowUpDate || 'TBD'}</p>
               </div>
               <button className="p-2 text-slate-300 hover:text-brand-navy transition-all">
                 <MoreVertical size={20} />
               </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-[3rem] py-20 border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
             <Clock size={48} className="mb-4 opacity-20" />
             <p className="font-bold italic">No follow-ups recorded yet</p>
          </div>
        )}
      </div>

      {/* Add Follow-up Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-brand-navy/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className="text-2xl font-black text-brand-navy tracking-tighter uppercase">{t('add_follow_up')}</h3>
                <p className="text-[10px] font-black text-brand-green uppercase tracking-widest mt-1">CRM Task Management</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-navy transition-all shadow-sm">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="text-sm font-black text-brand-navy uppercase tracking-widest border-b border-brand-navy/10 pb-2">Activity Detail</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('deal')} Code *</label>
                        <select 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all appearance-none"
                          value={formData.dealId || ''}
                          onChange={(e) => setFormData({...formData, dealId: e.target.value})}
                        >
                          <option value="">-- {t('select_deal')} --</option>
                          {deals.map(d => (
                            <option key={d.id} value={d.id}>{d.id} - {d.companyName}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('date')}</label>
                          <input 
                            type="date" 
                            value={formData.date || ''}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('communication_type')}</label>
                          <select 
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all appearance-none"
                            value={formData.communicationType || 'Call'}
                            onChange={(e) => setFormData({...formData, communicationType: e.target.value as any})}
                          >
                            <option>Call</option>
                            <option>WhatsApp</option>
                            <option>Email</option>
                            <option>Meeting</option>
                          </select>
                        </div>
                      </div>
                      <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('notes')}</label>
                         <textarea 
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all h-32"
                           value={formData.notes || ''}
                           onChange={(e) => setFormData({...formData, notes: e.target.value})}
                         />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-sm font-black text-brand-navy uppercase tracking-widest border-b border-brand-navy/10 pb-2">Retention & Planning</h4>
                    <div className="space-y-4">
                       <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('customer_interest')}</label>
                        <select 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all appearance-none"
                          value={formData.interestLevel || 'Medium'}
                          onChange={(e) => setFormData({...formData, interestLevel: e.target.value as any})}
                        >
                          <option>High</option>
                          <option>Medium</option>
                          <option>Low</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('next_step')}</label>
                        <select 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all appearance-none"
                          value={formData.nextStep || 'Follow-up call'}
                          onChange={(e) => setFormData({...formData, nextStep: e.target.value as any})}
                        >
                          <option>Send quotation</option>
                          <option>Follow-up call</option>
                          <option>Meeting</option>
                          <option>Send samples</option>
                          <option>Waiting response</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('next_follow_up')}</label>
                        <input 
                          type="date" 
                          value={formData.nextFollowUpDate || ''}
                          onChange={(e) => setFormData({...formData, nextFollowUpDate: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all"
                        />
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
                 {t('add_follow_up')}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
