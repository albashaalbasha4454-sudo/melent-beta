import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, User, Building2, Globe, Phone, Mail, Upload, MessageSquare } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';
import { LocalStorageManager, MELENT_KEYS } from '../../../services/localStorageManager';
import { B2BCompany } from '../../../types';

export const ContactPartner: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    entryLanguage: 'English',
    companyName: '',
    country: '',
    city: '',
    contactPerson: '',
    phone: '',
    email: '',
    source: 'Other',
    companyType: 'Distributor',
    interestedCategory: 'Dermocosmetics',
    targetProducts: '',
    orderSize: 'Medium',
    message: '',
    preferredCommunication: 'Email'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate submission
    setTimeout(() => {
      // Register as a B2B Company (Lead)
      const newCompany: B2BCompany = {
        id: `MC-LEAD-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        name: formData.companyName,
        country: formData.country,
        city: formData.city,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        source: formData.source as any,
        language: formData.entryLanguage as any,
        qualification: {
          type: formData.companyType as any,
          interestedCategories: [formData.interestedCategory as any],
          targetProducts: formData.targetProducts,
          expectedDemand: formData.orderSize as any
        },
        createdAt: new Date().toISOString(),
        isPublicLead: true // Flag to identify public entries
      };

      const existing: B2BCompany[] = LocalStorageManager.get(MELENT_KEYS.B2B_COMPANIES) || [];
      LocalStorageManager.save(MELENT_KEYS.B2B_COMPANIES, [newCompany, ...existing]);

      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <section id="partner" className="py-24 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-brand-navy rounded-[4rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
            {/* Left Info Panel */}
            <div className="lg:w-1/3 bg-brand-green p-12 lg:p-16 text-brand-navy flex flex-col justify-between">
              <div>
                <h3 className="text-4xl font-black tracking-tighter uppercase leading-tight mb-8">
                  Submit <br />
                  Partnership <br />
                  <span className="text-white italic font-serif">Request</span>
                </h3>
                <p className="text-xs font-black uppercase tracking-widest leading-loose mb-12 opacity-80">
                  Melent Care builds sustainable commercial bridges. Start your verified B2B journey with Turkiye's trusted hub today.
                </p>
                
                <div className="space-y-8">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-navy/10 flex items-center justify-center">
                        <CheckCircle2 size={20} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Verified Manufacturers</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-navy/10 flex items-center justify-center">
                        <CheckCircle2 size={20} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Strategic B2B Terms</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-navy/10 flex items-center justify-center">
                        <CheckCircle2 size={20} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Global Logistics Support</span>
                   </div>
                </div>
              </div>

              <div className="pt-12 mt-12 border-t border-brand-navy/10">
                <p className="text-[10px] font-black uppercase tracking-widest mb-2">Corporate Channel</p>
                <p className="text-lg font-black tracking-tight">contact@melentcare.com</p>
              </div>
            </div>

            {/* Form Panel */}
            <div className="lg:w-2/3 p-12 lg:p-20 bg-white">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="space-y-10"
                  >
                    {/* Header Inline */}
                    <div className="flex items-center gap-4 mb-4">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Entry Language:</span>
                       <div className="flex gap-2">
                         {['Arabic', 'English', 'Turkish'].map(lang => (
                           <button
                             key={lang}
                             type="button"
                             onClick={() => setFormData({...formData, entryLanguage: lang})}
                             className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                               formData.entryLanguage === lang ? 'bg-brand-navy text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                             }`}
                           >
                             {lang}
                           </button>
                         ))}
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-6">
                          <h4 className="text-[10px] font-black text-brand-green uppercase tracking-[0.3em] mb-4">Company Context</h4>
                          <div className="space-y-4">
                            <div>
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Company Name *</label>
                               <div className="relative group">
                                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-navy transition-colors shadow-inner" size={16} />
                                  <input 
                                    type="text" required placeholder="Legal Entity Name"
                                    value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:bg-white focus:border-brand-navy/10 transition-all" 
                                  />
                               </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Country *</label>
                                  <input 
                                    type="text" required placeholder="Target Market"
                                    value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-sm font-bold outline-none focus:bg-white focus:border-brand-navy/10 transition-all" 
                                  />
                               </div>
                               <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">City</label>
                                  <input 
                                    type="text" placeholder="Base City"
                                    value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-sm font-bold outline-none focus:bg-white focus:border-brand-navy/10 transition-all" 
                                  />
                               </div>
                            </div>
                            <div>
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Contact Person</label>
                               <input 
                                 type="text" placeholder="Full Name"
                                 value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-sm font-bold outline-none focus:bg-white focus:border-brand-navy/10 transition-all" 
                               />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">WhatsApp / Phone</label>
                                  <input 
                                    type="tel" placeholder="+00..."
                                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-sm font-bold outline-none focus:bg-white focus:border-brand-navy/10 transition-all" 
                                  />
                               </div>
                               <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Corporate Email</label>
                                  <input 
                                    type="email" placeholder="name@company.com"
                                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-sm font-bold outline-none focus:bg-white focus:border-brand-navy/10 transition-all" 
                                  />
                               </div>
                            </div>
                          </div>
                       </div>

                       <div className="space-y-6">
                          <h4 className="text-[10px] font-black text-brand-green uppercase tracking-[0.3em] mb-4">Business Intent</h4>
                          <div className="space-y-4">
                             <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Business Type</label>
                                <select 
                                  value={formData.companyType} onChange={e => setFormData({...formData, companyType: e.target.value})}
                                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-sm font-bold outline-none focus:bg-white focus:border-brand-navy/10 transition-all appearance-none"
                                >
                                  <option>Distributor</option>
                                  <option>Hospital</option>
                                  <option>Pharmacy</option>
                                  <option>Clinic</option>
                                  <option>Government</option>
                                  <option>Manufacturer</option>
                                </select>
                             </div>
                             <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Interest Sector</label>
                                <select 
                                  value={formData.interestedCategory} onChange={e => setFormData({...formData, interestedCategory: e.target.value})}
                                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-sm font-bold outline-none focus:bg-white focus:border-brand-navy/10 transition-all appearance-none"
                                >
                                  <option>Dermocosmetics</option>
                                  <option>Medical Aesthetic Devices</option>
                                  <option>Disposable Medical Products</option>
                                  <option>Medical & Healthcare Devices</option>
                                  <option>General Medical Supplies</option>
                                  <option>Supplements & Nutrition</option>
                                </select>
                             </div>
                             <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Target Products / Brands</label>
                                <input 
                                  type="text" placeholder="Specific interests"
                                  value={formData.targetProducts} onChange={e => setFormData({...formData, targetProducts: e.target.value})}
                                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-sm font-bold outline-none focus:bg-white focus:border-brand-navy/10 transition-all" 
                                />
                             </div>
                             <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Preferred Communication</label>
                                <div className="flex gap-2">
                                  {['Email', 'WhatsApp', 'Call'].map(method => (
                                    <button
                                      key={method}
                                      type="button"
                                      onClick={() => setFormData({...formData, preferredCommunication: method})}
                                      className={`flex-1 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                        formData.preferredCommunication === method ? 'bg-brand-navy text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                      }`}
                                    >
                                      {method}
                                    </button>
                                  ))}
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-6 bg-brand-navy text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-brand-green transition-all shadow-2xl shadow-brand-navy/20 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Send size={18} />
                          Submit Partnership Proposal
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="w-24 h-24 rounded-[2rem] bg-brand-green flex items-center justify-center text-brand-navy mb-8 shadow-2xl shadow-brand-green/20">
                      <CheckCircle2 size={48} />
                    </div>
                    <h3 className="text-3xl font-black text-brand-navy uppercase tracking-tighter mb-4">Proposal Received</h3>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] max-w-md mx-auto leading-loose">
                      Your business profile has been registered in our B2B lead system. A regional director will review your context and contact you via your preferred channel within 48 hours.
                    </p>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="mt-12 text-brand-navy font-black text-[10px] uppercase tracking-widest border-b-2 border-brand-navy/10 pb-1 hover:border-brand-green transition-all"
                    >
                       Back to form
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
