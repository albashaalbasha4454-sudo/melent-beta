import React, { useState, useEffect } from 'react';
import { X, User, MapPin, Phone, Mail, Globe, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Client, ClientType } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (client: Client) => void;
  clientToEdit?: Client | null;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose, onAdd, clientToEdit }) => {
  const { t, isRTL } = useLanguage();
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    type: 'Individual',
    location: '',
    contactPerson: '',
    phone: '',
    email: ''
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clientToEdit) {
      setFormData(clientToEdit);
    } else {
      setFormData({ name: '', type: 'Individual', location: '', contactPerson: '', phone: '', email: '' });
    }
  }, [clientToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setError(t('complete_fields_error'));
      return;
    }

    const finalClient: Client = {
      ...formData as Client,
      id: clientToEdit?.id || `CLI-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    };

    onAdd(finalClient);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-brand-navy/60 backdrop-blur-md" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} 
        className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden"
      >
        <div className={`p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green border-2 border-brand-green/20">
              <Building2 size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-brand-navy leading-none">
                {clientToEdit ? t('edit_client_details') : t('add_new_client')}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 leading-none">{t('crm_desc')}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-slate-300 hover:text-brand-navy shadow-sm transition-all"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className={`p-10 space-y-8 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
          {error && (
            <div className={`p-4 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-xs animate-in slide-in-from-top ${isRTL ? 'flex-row-reverse' : ''}`}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 mx-2 tracking-widest">{t('client_full_name')}</label>
              <div className="relative">
                <User className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-300`} size={18} />
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} focus:bg-white focus:border-brand-green/20 transition-all font-bold text-sm`} placeholder={t('client_name_placeholder')} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 mx-2 tracking-widest">{t('client_classification')}</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as ClientType})} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 focus:bg-white focus:border-brand-green/20 transition-all font-bold text-sm">
                <option value="Individual">{t('individual')}</option>
                <option value="Company">{t('company')}</option>
                <option value="Hospital">{t('hospital_category')}</option>
                <option value="Clinic">{t('clinic_category')}</option>
                <option value="Distributor">{t('distributor')}</option>
              </select>
            </div>

            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase text-slate-400 mx-2 tracking-widest">{t('location_country')}</label>
              <div className="relative">
                <Globe className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-300`} size={18} />
                <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className={`w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} focus:bg-white focus:border-brand-green/20 transition-all font-bold text-sm text-left`} placeholder={t('country_city_placeholder')} />
              </div>
            </div>

            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase text-slate-400 mx-2 tracking-widest">{t('phone_number')}</label>
              <div className="relative">
                <Phone className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-300`} size={18} />
                <input type="tel" dir="ltr" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={`w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} focus:bg-white focus:border-brand-green/20 transition-all font-bold text-sm text-left font-mono`} placeholder="+90 XXX XXX XX XX" />
              </div>
            </div>

            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase text-slate-400 mx-2 tracking-widest">{t('email_label')}</label>
              <div className="relative">
                <Mail className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-300`} size={18} />
                <input type="email" dir="ltr" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={`w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} focus:bg-white focus:border-brand-green/20 transition-all font-bold text-sm text-left`} placeholder="client@melentcare.com" />
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
               <label className="text-[10px] font-black uppercase text-slate-400 mx-2 tracking-widest">{t('responsible_person')}</label>
              <input type="text" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 focus:bg-white focus:border-brand-green/20 transition-all font-bold text-sm" placeholder={t('contact_person_placeholder')} />
            </div>
          </div>

          <div className={`pt-6 flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
             <button type="submit" className="flex-1 bg-brand-navy text-white py-5 rounded-[1.5rem] font-black text-sm shadow-2xl shadow-brand-navy/20 hover:bg-brand-green transition-all flex items-center justify-center gap-3 group">
               <CheckCircle2 size={20} className="text-brand-cyan group-hover:scale-110 transition-transform" />
               {clientToEdit ? t('update_client_details') : t('register_client')}
             </button>
             <button type="button" onClick={onClose} className="px-10 bg-slate-50 text-slate-400 py-5 rounded-[1.5rem] font-black text-sm hover:bg-slate-100 transition-all uppercase tracking-widest whitespace-nowrap">{t('cancel')}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
