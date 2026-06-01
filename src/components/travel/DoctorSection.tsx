import React, { useState, useEffect } from 'react';
import { User, Plus, FileDown, Award, Star, Activity, Briefcase, GraduationCap, Hospital, HeartPulse } from 'lucide-react';
import { DataTable } from '../DataTable';
import { LocalStorageManager, MELENT_KEYS } from '../../services/localStorageManager';
import { Doctor, PartnerHospital } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { AddDoctorModal } from '../modals/AddDoctorModal';

export const DoctorSection: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<PartnerHospital[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState<Doctor | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setDoctors(LocalStorageManager.get(MELENT_KEYS.TRAVEL_DOCTORS) || []);
    setHospitals(LocalStorageManager.get(MELENT_KEYS.TRAVEL_HOSPITALS) || []);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(doctors, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "melent_specialist_roster.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleAddOrUpdate = (doctor: Doctor) => {
    let updated;
    if (doctorToEdit) {
      updated = doctors.map(d => d.id === doctor.id ? doctor : d);
    } else {
      updated = [...doctors, doctor];
    }
    setDoctors(updated);
    LocalStorageManager.save(MELENT_KEYS.TRAVEL_DOCTORS, updated);
    setDoctorToEdit(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('confirm_delete'))) {
      const updated = doctors.filter(d => d.id !== id);
      setDoctors(updated);
      LocalStorageManager.save(MELENT_KEYS.TRAVEL_DOCTORS, updated);
    }
  };

  const columns = [
    { header: t('consultant_doctor'), accessor: (d: Doctor) => (
      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center font-black border border-purple-100 shadow-sm overflow-hidden group-hover:scale-110 transition-transform shrink-0">
           {d.name.includes('Dr.') ? d.name.split(' ')[1]?.charAt(0) || d.name.charAt(4) : d.name.charAt(0)}
        </div>
        <div>
          <p className="font-black text-brand-navy tracking-tight leading-none">{d.name}</p>
          <div className={`flex items-center gap-2 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
             <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest leading-none px-2 py-0.5 bg-purple-50/50 border border-purple-100/30 rounded-md whitespace-nowrap inline-block">
               {d.specialty}
             </span>
          </div>
        </div>
      </div>
    )},
    { header: t('academic_hospital'), accessor: (d: Doctor) => {
      const h = hospitals.find(hosp => hosp.id === d.hospitalId);
      return (
        <div className={`flex items-center gap-2 text-slate-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Hospital size={14} className="text-brand-cyan shrink-0" />
          <span className="text-sm font-bold truncate max-w-[150px]">{h?.name || "Independent"}</span>
        </div>
      );
    }},
    { header: t('experience_degree'), accessor: (d: Doctor) => (
      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-1.5 font-bold text-slate-500 whitespace-nowrap ${isRTL ? 'flex-row-reverse' : ''}`}>
           <GraduationCap size={14} className="text-slate-300" />
           <span className="text-xs">{d.experienceYears} {t('years_exp')}</span>
        </div>
      </div>
    )},
    { header: t('efficiency_index'), accessor: (d: Doctor) => (
      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-1 text-brand-gold font-black bg-brand-gold/5 px-2 py-1 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Star size={12} fill="currentColor" />
          <span className="text-xs">{d.rating}</span>
        </div>
        <div className={`flex items-center gap-2 text-brand-green ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
           <HeartPulse size={14} />
           <span className="text-[10px] font-black uppercase leading-none">{t('elite_status')}</span>
        </div>
      </div>
    )},
    { header: t('table_header_status'), accessor: (d: Doctor) => (
      <span className="px-4 py-1.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 text-[9px] font-black uppercase tracking-[0.2em] shadow-sm whitespace-nowrap">
        {t('authorized')}
      </span>
    )},
  ];

  return (
    <div className={`space-y-10 animate-in fade-in duration-500 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        <div>
           <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <User className="text-purple-500" size={24} />
              <h2 className="text-3xl font-black text-brand-navy tracking-tight uppercase leading-none">{t('consultants_roster')}</h2>
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none mb-1">{t('consultants_desc')}</p>
        </div>
        <div className={`flex flex-wrap items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button 
            onClick={handleExport}
            className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-brand-navy shadow-sm transition-all hover:shadow-md"
            title={t('export_data')}
          >
            <FileDown size={20} />
          </button>
          <button 
            onClick={() => {
              setDoctorToEdit(null);
              setIsModalOpen(true);
            }}
            className="bg-brand-navy text-white px-8 py-5 rounded-2xl font-black text-xs shadow-2xl shadow-brand-navy/30 hover:bg-brand-green transition-all flex items-center gap-4 group uppercase tracking-[0.2em]"
          >
            <Plus size={20} className="text-brand-cyan group-hover:rotate-90 transition-transform" />
            {t('hire_consultant')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden p-2">
        <DataTable 
          data={doctors} 
          columns={columns}
          onEdit={(d) => {
            setDoctorToEdit(d);
            setIsModalOpen(true);
          }}
          onDelete={(d) => handleDelete(d.id)}
          onView={(d) => console.log('View Surgeon Portfolio', d)}
        />
      </div>

      {/* Roster Optimization Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-purple-600 rounded-[3rem] p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[240px] shadow-2xl shadow-purple-600/20">
            <div className={`absolute -top-10 ${isRTL ? '-left-10' : '-right-10'} w-48 h-48 bg-white/10 rounded-full blur-3xl`} />
            <div className={`relative z-10 flex items-center gap-4 ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
               <div className="shrink-0 w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                 <Briefcase size={28} />
               </div>
               <div>
                 <p className="text-[10px] font-black text-white/60 uppercase tracking-widest leading-none mt-1">{t('active_surgical_slots')}</p>
                 <p className="text-3xl font-black tracking-tighter tabular-nums">24 Scheduled</p>
               </div>
            </div>
            <div className={`relative z-10 p-6 bg-black/10 rounded-[2rem] border border-white/10 ${isRTL ? 'text-right' : 'text-left'}`}>
               <p className="text-xs font-bold text-white/80 leading-relaxed italic">
                 "{t('consultant_quote_desc')}"
               </p>
            </div>
         </div>

         <div className={`bg-white rounded-[3rem] border border-slate-100 p-8 flex flex-col justify-between shadow-sm ${isRTL ? 'text-right' : 'text-left'}`}>
            <h4 className="text-[11px] font-black text-brand-navy uppercase tracking-widest mb-6 leading-none">{t('medical_expertise_distribution')}</h4>
            <div className="space-y-4">
               {[
                 { field: 'Plastic Surgery', value: 45 },
                 { field: 'Dental Implantology', value: 30 },
                 { field: 'Orthopedics', value: 15 },
                 { field: 'Cardiology', value: 10 },
               ].map((item, i) => (
                 <div key={i} className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                   <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden relative">
                      <div className={`h-full bg-purple-500 absolute top-0 ${isRTL ? 'right-0' : 'left-0'}`} style={{ width: `${item.value}%` }} />
                   </div>
                   <div className={`w-40 shrink-0 ${isRTL ? 'text-left' : 'text-right'}`}>
                      <p className="text-[10px] font-black text-brand-navy uppercase tabular-nums truncate">{item.field}</p>
                   </div>
                 </div>
               ))}
            </div>
            <button 
              onClick={() => alert(t('consultant_analytics_started'))}
              className="w-full mt-8 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100"
            >
               {t('load_consultant_analytics')}
            </button>
         </div>
      </div>

      <AddDoctorModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setDoctorToEdit(null);
        }}
        onAdd={handleAddOrUpdate}
        doctorToEdit={doctorToEdit}
      />
    </div>
  );
};
