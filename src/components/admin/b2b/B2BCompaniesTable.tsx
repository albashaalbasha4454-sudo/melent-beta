import React, { useState } from 'react';
import { Plus, Search, Filter, Globe, Phone, Mail, Building2, Trash2, Edit2, User, Table, FileDown } from 'lucide-react';
import { B2BCompany, B2BSource, B2BLanguage, B2BCompanyType, B2BInterestCategory, B2BExpectedDemand } from '../../../types';
import { useLanguage } from '../../../hooks/useLanguage';
import { DataTable } from '../../DataTable';
import { LocalStorageManager, MELENT_KEYS } from '../../../services/localStorageManager';
import { exportCompaniesToExcel, exportCompaniesToPDF } from '../../../services/b2bExportService';

interface B2BCompaniesTableProps {
  companies: B2BCompany[];
  onUpdate: (companies: B2BCompany[]) => void;
}

export const B2BCompaniesTable: React.FC<B2BCompaniesTableProps> = ({ companies, onUpdate }) => {
  const { t, isRTL } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<B2BCompany>>({
    language: 'English',
    source: 'LinkedIn',
    qualification: {
      type: 'Distributor',
      interestedCategories: [],
      targetProducts: '',
      expectedDemand: 'Medium'
    }
  });

  const handleAdd = () => {
    if (!formData.name || !formData.country) return;

    const newCompany: B2BCompany = {
      id: `MC-CO-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      name: formData.name!,
      country: formData.country!,
      city: formData.city,
      contactPerson: formData.contactPerson || '',
      phone: formData.phone || '',
      email: formData.email || '',
      source: formData.source || 'Other',
      language: formData.language || 'English',
      qualification: {
        type: formData.qualification?.type || 'Other',
        interestedCategories: formData.qualification?.interestedCategories || [],
        targetProducts: formData.qualification?.targetProducts || '',
        expectedDemand: formData.qualification?.expectedDemand || 'Medium'
      },
      createdAt: new Date().toISOString()
    };

    const updated = [newCompany, ...companies];
    onUpdate(updated);
    LocalStorageManager.save(MELENT_KEYS.B2B_COMPANIES, updated);
    setIsModalOpen(false);
    setFormData({
      language: 'English',
      source: 'LinkedIn',
      qualification: { type: 'Distributor', interestedCategories: [], targetProducts: '', expectedDemand: 'Medium' }
    });
  };

  const filtered = companies.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-300`} size={18} />
          <input 
            type="text" 
            placeholder={t('search_companies')} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-white border border-slate-100 rounded-2xl py-3 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-sm font-bold shadow-sm outline-none focus:border-brand-navy/20`}
          />
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => exportCompaniesToExcel(filtered)}
            className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-brand-green hover:border-brand-green/20 transition-all shadow-sm group"
            title="Export to Excel"
          >
            <Table size={18} />
          </button>
          <button 
            onClick={() => exportCompaniesToPDF(filtered)}
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
            {t('add_company')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right" dir={isRTL ? 'rtl' : 'ltr'}>
            <thead>
              <tr className="bg-slate-50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('id')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('company')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('contact_person_name')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('location')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('type')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(company => (
                <tr key={company.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 text-[10px] font-black text-brand-navy font-mono">{company.id}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-navy/5 flex items-center justify-center text-brand-navy">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <p className="font-black text-brand-navy">{company.name}</p>
                        <p className="text-[10px] font-bold text-slate-400">{company.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-bold text-brand-navy">{company.contactPerson}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-brand-green" />
                      <span className="font-bold text-slate-600">{company.country}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-brand-navy/5 text-brand-navy rounded-full text-[10px] font-black uppercase">
                      {company.qualification.type}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <button className="p-2 text-slate-400 hover:text-brand-navy hover:bg-slate-50 rounded-xl transition-all">
                         <Edit2 size={14} />
                       </button>
                       <button 
                         className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                         onClick={() => {
                           const updated = companies.filter(c => c.id !== company.id);
                           onUpdate(updated);
                           LocalStorageManager.save(MELENT_KEYS.B2B_COMPANIES, updated);
                         }}
                       >
                         <Trash2 size={14} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-slate-300 font-bold italic">No companies registered yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Company Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-brand-navy/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className="text-2xl font-black text-brand-navy tracking-tighter uppercase">{t('add_company')}</h3>
                <p className="text-[10px] font-black text-brand-green uppercase tracking-widest mt-1">B2B Business Registration</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-navy transition-all shadow-sm">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar shadow-inner">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="text-sm font-black text-brand-navy uppercase tracking-widest border-b border-brand-navy/10 pb-2">Basic Info</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('company_name')} *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name || ''}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('country')} *</label>
                          <input 
                            type="text" 
                            required
                            value={formData.country || ''}
                            onChange={(e) => setFormData({...formData, country: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('city')}</label>
                          <input 
                            type="text" 
                            value={formData.city || ''}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('contact_person_name')}</label>
                        <input 
                          type="text" 
                          value={formData.contactPerson || ''}
                          onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('phone')}</label>
                          <input 
                            type="text" 
                            value={formData.phone || ''}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('email')}</label>
                          <input 
                            type="email" 
                            value={formData.email || ''}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-sm font-black text-brand-navy uppercase tracking-widest border-b border-brand-navy/10 pb-2">Deal Qualification</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('type')}</label>
                          <select 
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all appearance-none"
                            value={formData.qualification?.type || 'Other'}
                            onChange={(e) => setFormData({...formData, qualification: {...formData.qualification!, type: e.target.value as any}})}
                          >
                            <option>Distributor</option>
                            <option>Hospital</option>
                            <option>Pharmacy</option>
                            <option>Clinic</option>
                            <option>Government</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('source')}</label>
                          <select 
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all appearance-none"
                            value={formData.source || 'Other'}
                            onChange={(e) => setFormData({...formData, source: e.target.value as any})}
                          >
                            <option>LinkedIn</option>
                            <option>Email</option>
                            <option>Exhibition</option>
                            <option>Referral</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Language *</label>
                         <div className="flex gap-2">
                           {['Arabic', 'English', 'Turkish'].map(lang => (
                             <button
                                key={lang}
                                onClick={() => setFormData({...formData, language: lang as any})}
                                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                                  formData.language === lang 
                                    ? 'bg-brand-navy text-white' 
                                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                }`}
                             >
                               {lang}
                             </button>
                           ))}
                         </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('expected_demand')}</label>
                        <select 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all appearance-none"
                          value={formData.qualification?.expectedDemand || 'Medium'}
                          onChange={(e) => setFormData({...formData, qualification: {...formData.qualification!, expectedDemand: e.target.value as any}})}
                        >
                          <option>Small</option>
                          <option>Medium</option>
                          <option>Large</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Target Products / Brands</label>
                        <textarea 
                          value={formData.qualification?.targetProducts || ''}
                          onChange={(e) => setFormData({...formData, qualification: {...formData.qualification!, targetProducts: e.target.value}})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all h-24"
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
                 {t('register_client')}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
