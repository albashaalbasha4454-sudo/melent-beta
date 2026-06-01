import React, { useState, useEffect } from 'react';
import { Hospital, Plus, MapPin, Star, Phone, FileDown, ShieldCheck, Award, Users, ChevronRight, Activity } from 'lucide-react';
import { DataTable } from '../DataTable';
import { LocalStorageManager, MELENT_KEYS } from '../../services/localStorageManager';
import { PartnerHospital } from '../../types';
import { AddHospitalModal } from '../modals/AddHospitalModal';
import { useLanguage } from '../../hooks/useLanguage';

export const HospitalSection: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [hospitals, setHospitals] = useState<PartnerHospital[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<PartnerHospital | null>(null);

  useEffect(() => {
    setHospitals(LocalStorageManager.get(MELENT_KEYS.TRAVEL_HOSPITALS) || []);
  }, []);

  const handleAddOrUpdate = (hospital: PartnerHospital) => {
    const updated = editingHospital 
      ? hospitals.map(h => h.id === hospital.id ? hospital : h)
      : [hospital, ...hospitals];
    
    setHospitals(updated);
    LocalStorageManager.save(MELENT_KEYS.TRAVEL_HOSPITALS, updated);
    setEditingHospital(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`${t('confirm_delete')} "${name}"?`)) {
      if (LocalStorageManager.softDelete(MELENT_KEYS.TRAVEL_HOSPITALS, id, 'HOSPITAL', name)) {
        setHospitals(prev => prev.filter(h => h.id !== id));
      }
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(hospitals, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "melent_hospital_network.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const columns = [
    { header: t('partner_hospital'), accessor: (h: PartnerHospital) => (
      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
        <div className="w-12 h-12 bg-brand-navy/5 text-brand-navy rounded-[1.5rem] flex items-center justify-center shadow-sm border border-slate-100 group-hover:bg-brand-navy group-hover:text-white transition-all shrink-0">
          <Hospital size={20} />
        </div>
        <div>
          <p className="font-black text-brand-navy tracking-tight leading-none">{h.name}</p>
          <div className={`flex items-center gap-2 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] leading-none tabular-nums">{h.id}</span>
             {h.rating >= 4.5 && (
                <span className="text-[8px] font-black bg-brand-gold/10 text-brand-gold px-1.5 py-0.5 rounded uppercase flex items-center gap-1 leading-none">
                  <Award size={10} /> Tier 1
                </span>
             )}
          </div>
        </div>
      </div>
    )},
    { header: t('geographic_location'), accessor: (h: PartnerHospital) => (
      <div className={`flex items-center gap-2 text-slate-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <MapPin size={14} className="text-brand-cyan shrink-0" />
        <span className="text-sm font-bold">{h.location}</span>
      </div>
    )},
    { header: t('medical_capabilities'), accessor: (h: PartnerHospital) => (
      <div className={`flex flex-wrap gap-1.5 max-w-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
        {h.specialties.slice(0, 3).map((s, i) => (
          <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-brand-navy uppercase tracking-widest leading-none">
            {s}
          </span>
        ))}
        {h.specialties.length > 3 && (
          <span className="text-[9px] font-black text-slate-300 py-1 px-1">+ {h.specialties.length - 3} {t('additional_nodes') || 'More'}</span>
        )}
      </div>
    )},
    { header: t('performance_index'), accessor: (h: PartnerHospital) => (
      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-1 text-brand-gold font-black bg-brand-gold/5 px-2 py-1 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Star size={12} fill="currentColor" className="shrink-0" />
          <span className="text-xs tabular-nums">{h.rating}</span>
        </div>
        <div className={`flex items-center gap-2 text-brand-green ${isRTL ? 'flex-row-reverse' : ''}`}>
           <Activity size={14} className="shrink-0" />
           <span className="text-[10px] font-black uppercase whitespace-nowrap">98% Satisfied</span>
        </div>
      </div>
    )},
    { header: t('contract_status'), accessor: (h: PartnerHospital) => (
      <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border ${
        h.contractStatus === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-400 border-slate-100'
      }`}>
        {h.contractStatus === 'Active' ? t('status_processing') : h.contractStatus}
      </span>
    )},
  ];

  return (
    <div className={`space-y-10 animate-in fade-in duration-500 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
           <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse justify-start' : 'flex-row'}`}>
              <Hospital className="text-red-500" size={24} />
              <h2 className="text-3xl font-black text-brand-navy tracking-tight uppercase leading-none">{t('hospital_network_matrix')}</h2>
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none mb-1">{t('hospital_network_desc')}</p>
        </div>
        <div className={`flex flex-wrap items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button 
            onClick={handleExport}
            className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-brand-navy shadow-sm transition-all hover:shadow-md"
            title={t('export_network_map')}
          >
            <FileDown size={20} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-navy text-white px-8 py-5 rounded-2xl font-black text-xs shadow-2xl shadow-brand-navy/30 hover:bg-brand-green transition-all flex items-center gap-4 group uppercase tracking-[0.2em]"
          >
            <Plus size={20} className="text-brand-cyan group-hover:rotate-90 transition-transform" />
            {t('integrate_new_partner')}
          </button>
        </div>
      </div>

      {/* Network Stats Card */}
      <div className="bg-brand-navy rounded-[3.5rem] p-10 text-white relative overflow-hidden flex flex-col lg:flex-row items-center gap-10 shadow-2xl shadow-brand-navy/30">
         <div className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} w-96 h-96 bg-brand-cyan/10 rounded-full blur-[100px] ${isRTL ? '-mr-48' : '-ml-48'} -mt-48`} />
         <div className={`flex-1 space-y-6 relative z-10 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h3 className="text-3xl font-black tracking-tight leading-tight">
              {isRTL ? 'تحسين البنية التحتية ' : t('optimize_infra').split(' ').slice(0,-1).join(' ') + ' '}
              <span className="text-brand-cyan">{isRTL ? 'العالمية' : t('optimize_infra').split(' ').pop()}</span>
            </h3>
            <p className="text-brand-cyan/60 font-medium text-sm max-w-xl">
              {t('hospital_partners_desc')}
            </p>
            <div className={`flex flex-wrap items-center ${isRTL ? 'justify-end' : 'justify-start'} gap-8 pt-4`}>
               <div>
                  <p className="text-[10px] font-black text-brand-cyan uppercase tracking-widest mb-1 leading-none">{t('total_reserved_beds')}</p>
                  <p className="text-3xl font-black tracking-tighter tabular-nums">{hospitals.length * 25}+</p>
               </div>
               <div className="h-12 w-px bg-white/10 hidden md:block" />
               <div>
                  <p className="text-[10px] font-black text-brand-cyan uppercase tracking-widest mb-1 leading-none">{t('avg_jci_rating')}</p>
                  <p className="text-3xl font-black tracking-tighter tabular-nums">4.9/5</p>
               </div>
               <div className="h-12 w-px bg-white/10 hidden md:block" />
               <div>
                  <p className="text-[10px] font-black text-brand-cyan uppercase tracking-widest mb-1 leading-none">{t('operational_efficiency')}</p>
                  <p className="text-3xl font-black tracking-tighter tabular-nums">84%</p>
               </div>
            </div>
         </div>
         <div className="w-full lg:w-80 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 relative z-10">
            <h4 className={`text-[10px] font-black uppercase tracking-widest text-brand-cyan mb-6 leading-none ${isRTL ? 'text-right' : 'text-left'}`}>{t('network_health')}</h4>
            <div className="space-y-6">
               <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                     <ShieldCheck className="text-brand-cyan shrink-0" size={18} />
                     <p className="text-xs font-bold leading-none">{t('standards_compliance')}</p>
                  </div>
                  <span className="text-xs font-black tabular-nums">100%</span>
               </div>
               <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                     <Users className="text-brand-cyan shrink-0" size={18} />
                     <p className="text-xs font-bold leading-none">{t('active_patient_nodes')}</p>
                  </div>
                  <span className="text-xs font-black tabular-nums">{hospitals.length * 4}</span>
               </div>
            </div>
            <button 
              onClick={() => alert(t('network_audit_started'))}
              className="w-full mt-8 py-3 bg-white text-brand-navy rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-cyan transition-all"
            >
              {t('network_audit')}
            </button>
         </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden p-2 text-left">
        <DataTable 
          data={hospitals} 
          columns={columns}
          onEdit={(h) => {
            setEditingHospital(h);
            setIsModalOpen(true);
          }}
          onDelete={(h) => handleDelete(h.id, h.name)}
          onView={(h) => console.log('View Node Portfolio', h)}
        />
      </div>

      <AddHospitalModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingHospital(null);
        }}
        onAdd={handleAddOrUpdate}
        hospitalToEdit={editingHospital}
      />
    </div>
  );
};

