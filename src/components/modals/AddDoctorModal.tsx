import React, { useState, useEffect } from 'react';
import { X, User, Award, Star, Briefcase, GraduationCap, CheckCircle2, AlertCircle, Phone, Mail, Globe, Hospital } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Doctor, PartnerHospital } from '../../types';
import { LocalStorageManager, MELENT_KEYS } from '../../services/localStorageManager';
import { useLanguage } from '../../hooks/useLanguage';

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (doctor: Doctor) => void;
  doctorToEdit?: Doctor | null;
}

export const AddDoctorModal: React.FC<AddDoctorModalProps> = ({ isOpen, onClose, onAdd, doctorToEdit }) => {
  const { t, isRTL } = useLanguage();
  const [formData, setFormData] = useState<Partial<Doctor>>({
    name: '',
    specialty: '',
    experienceYears: 10,
    hospitalId: '',
    rating: 4.5,
    bio: '',
    availability: 'Full-time',
    contact: '',
    education: '',
    languages: ['English']
  });
  const [hospitals, setHospitals] = useState<PartnerHospital[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setHospitals(LocalStorageManager.get(MELENT_KEYS.TRAVEL_HOSPITALS) || []);
    }
    
    if (doctorToEdit) {
      setFormData(doctorToEdit);
    } else {
      setFormData({ 
        name: '', 
        specialty: '', 
        experienceYears: 10, 
        hospitalId: '', 
        rating: 4.5, 
        bio: '', 
        availability: 'Full-time', 
        contact: '', 
        education: '', 
        languages: ['English', 'Turkish', 'Arabic'] 
      });
    }
  }, [doctorToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.specialty || !formData.hospitalId) {
      setError(t('hospital_data_error')); // Reuse for now or create specific
      return;
    }

    const finalDoctor: Doctor = {
      ...formData as Doctor,
      id: doctorToEdit?.id || `DOC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    };

    onAdd(finalDoctor);
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
            <div className="w-14 h-14 bg-brand-navy rounded-2xl flex items-center justify-center text-brand-cyan shadow-xl shadow-brand-navy/20">
              <User size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-brand-navy leading-none">
                {doctorToEdit ? t('edit_consultant_details') : t('recruit_new_specialist')}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 leading-none">{t('specialist_roster_management')}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-slate-300 hover:text-brand-navy shadow-sm transition-all"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className={`p-10 space-y-8 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
          {error && (
            <div className={`p-4 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 mx-2 tracking-widest">{t('doctor_full_name')}</label>
              <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-transparent rounded-2xl p-4 focus:bg-white focus:ring-4 focus:ring-brand-cyan/5 transition-all font-bold text-sm outline-none" placeholder="e.g. Dr. Adam Smith" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 mx-2 tracking-widest">{t('medical_specialty_label')}</label>
              <div className="relative">
                <Briefcase className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-300`} size={18} />
                <input type="text" value={formData.specialty || ''} onChange={e => setFormData({...formData, specialty: e.target.value})} className={`w-full bg-slate-50 border-transparent rounded-2xl p-4 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} focus:bg-white transition-all font-bold text-sm outline-none`} placeholder="e.g. Plastic Surgeon" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 mx-2 tracking-widest">{t('years_of_experience')}</label>
              <div className="relative">
                <Award className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-300`} size={18} />
                <input type="number" value={formData.experienceYears || 0} onChange={e => setFormData({...formData, experienceYears: Number(e.target.value)})} className={`w-full bg-slate-50 border-transparent rounded-2xl p-4 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} focus:bg-white transition-all font-black text-sm outline-none tabular-nums`} />
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 mx-2 tracking-widest">{t('primary_hospital_affiliation')}</label>
              <div className="relative">
                <Hospital className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-300`} size={18} />
                <select value={formData.hospitalId || ''} onChange={e => setFormData({...formData, hospitalId: e.target.value})} className={`w-full bg-slate-50 border-transparent rounded-2xl p-4 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} focus:bg-white transition-all font-bold text-sm outline-none appearance-none`}>
                  <option value="">{t('select_hospital')}</option>
                  {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 mx-2 tracking-widest">{t('short_professional_bio')}</label>
              <textarea value={formData.bio || ''} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-slate-50 border-transparent rounded-2xl p-6 focus:bg-white transition-all font-bold text-sm outline-none min-h-[100px]" placeholder={t('bio_placeholder')} />
            </div>
          </div>

          <div className={`pt-6 flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
             <button type="submit" className="flex-1 bg-brand-navy text-white py-5 rounded-[1.5rem] font-black text-sm shadow-2xl shadow-brand-navy/20 hover:bg-brand-green transition-all flex items-center justify-center gap-3">
               <CheckCircle2 size={20} className="text-brand-cyan" />
               {doctorToEdit ? t('update_specialist_record') : t('register_new_consultant')}
             </button>
             <button type="button" onClick={onClose} className="px-10 bg-slate-50 text-slate-400 py-5 rounded-[1.5rem] font-black text-sm hover:bg-slate-100 transition-all whitespace-nowrap">{t('cancel')}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
