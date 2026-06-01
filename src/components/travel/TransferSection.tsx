import React, { useState, useEffect } from 'react';
import { Bus, Plus, FileDown, MapPin, Calendar, Clock, User, ShieldCheck, Map, ChevronRight, Activity } from 'lucide-react';
import { DataTable } from '../DataTable';
import { LocalStorageManager, MELENT_KEYS } from '../../services/localStorageManager';
import { TransferService, Patient } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

export const TransferSection: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [transfers, setTransfers] = useState<TransferService[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    setTransfers(LocalStorageManager.get(MELENT_KEYS.TRAVEL_TRANSFERS) || []);
    setPatients(LocalStorageManager.get(MELENT_KEYS.TRAVEL_PATIENTS) || []);
  }, []);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transfers, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "melent_ground_ops_manifest.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const columns = [
    { header: t('task_patient'), accessor: (trans: TransferService) => {
      const p = patients.find(pat => pat.id === trans.patientId);
      return (
        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center font-black border border-orange-100 shadow-sm shrink-0">
             <Bus size={20} />
          </div>
          <div>
            <p className="font-black text-brand-navy tracking-tight leading-none">{p?.name || 'Unknown Request'}</p>
            <div className={`flex items-center gap-2 mt-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
               <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none tabular-nums">{trans.id}</span>
               <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest leading-none px-1.5 py-0.5 bg-orange-50 rounded-md whitespace-nowrap">
                 {trans.vehicleType}
               </span>
            </div>
          </div>
        </div>
      );
    }},
    { header: t('ground_path'), accessor: (trans: TransferService) => (
      <div className={`flex flex-col gap-1 ${isRTL ? 'items-end' : 'items-start'}`}>
         <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="text-xs font-bold text-slate-400 capitalize">{trans.pickupLocation}</span>
         </div>
         <div className={`h-4 border-slate-100 ${isRTL ? 'border-l-2 ml-[3px]' : 'border-r-2 mr-[3px]'}`} />
         <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
            <span className="text-xs font-black text-brand-navy capitalize">{trans.dropoffLocation}</span>
         </div>
      </div>
    )},
    { header: t('operational_timing'), accessor: (trans: TransferService) => (
      <div className={`flex flex-col gap-1 ${isRTL ? 'items-end' : 'items-start'}`}>
         <div className={`flex items-center gap-2 text-slate-400 whitespace-nowrap ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Calendar size={12} className="shrink-0" />
            <span className="text-[11px] font-black tabular-nums">{new Date(trans.date).toLocaleDateString()}</span>
         </div>
         <div className={`flex items-center gap-2 text-brand-navy whitespace-nowrap ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Clock size={12} className="shrink-0" />
            <span className="text-[11px] font-black tabular-nums">{trans.time || 'TBA'}</span>
         </div>
      </div>
    )},
    { header: t('service_driver'), accessor: (trans: TransferService) => (
       <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
             <User size={14} />
          </div>
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-tight">{t('global_fleet_authorized')}</span>
       </div>
    )},
    { header: t('table_header_status'), accessor: (trans: TransferService) => (
      <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border ${
        trans.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' :
        trans.status === 'Scheduled' ? 'bg-blue-50 text-blue-600 border-blue-100' :
        'bg-slate-50 text-slate-400 border-slate-100'
      }`}>
        {trans.status}
      </span>
    )},
  ];

  return (
    <div className={`space-y-10 animate-in fade-in duration-500 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
           <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Bus className="text-orange-500" size={24} />
              <h2 className="text-3xl font-black text-brand-navy tracking-tight uppercase leading-none">{t('ground_transfer_matrix')}</h2>
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none mb-1">{t('transfer_ops_desc')}</p>
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
              const driver = prompt(t('enter_driver_name'));
              if (driver) {
                const newTransfer: TransferService = {
                  id: 'trn' + Date.now() + Math.random().toString(36).substring(2, 9),
                  patientId: patients[0]?.id || '',
                  patientName: patients[0]?.name || 'Unknown Patient',
                  type: t('airport_hotel'),
                  driverName: driver,
                  driverPhone: '+90 555 000 0000',
                  plateNumber: '34 MEL ' + Math.floor(100 + Math.random() * 899),
                  pickupLocation: t('ist_airport'),
                  dropoffLocation: t('sheraton_hotel'),
                  date: new Date().toISOString().split('T')[0],
                  time: '11:00 AM',
                  pickupTime: '11:00 AM',
                  status: 'Scheduled',
                  vehicleType: 'Luxury Van'
                };
                const updated = [...transfers, newTransfer];
                setTransfers(updated);
                LocalStorageManager.save(MELENT_KEYS.TRAVEL_TRANSFERS, updated);
              }
            }}
            className="bg-brand-navy text-white px-8 py-5 rounded-2xl font-black text-xs shadow-2xl shadow-brand-navy/30 hover:bg-brand-green transition-all flex items-center gap-4 group uppercase tracking-[0.2em]"
          >
            <Plus size={20} className="text-brand-cyan group-hover:rotate-90 transition-transform" />
            {t('dispatch_unit')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden p-2 text-left">
        <DataTable 
          data={transfers} 
          columns={columns}
          onEdit={() => {}}
          onDelete={() => {}}
          onView={(t) => console.log('View Route Matrix', t)}
        />
      </div>

      {/* Fleet Efficiency Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className={`bg-white border border-slate-100 p-8 rounded-[3rem] flex items-center gap-6 group hover:border-brand-cyan transition-all cursor-default ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform shrink-0">
               <Map size={32} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('route_efficiency')}</p>
               <p className="text-2xl font-black text-brand-navy tracking-tighter tabular-nums">94.2%</p>
            </div>
         </div>

         <div className={`bg-white border border-slate-100 p-8 rounded-[3rem] flex items-center gap-6 group hover:border-brand-green transition-all cursor-default ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
            <div className="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green group-hover:scale-110 transition-transform shrink-0">
               <ShieldCheck size={32} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('safety_protocols')}</p>
               <p className="text-2xl font-black text-brand-navy tracking-tighter uppercase">{t('certified')}</p>
            </div>
         </div>

         <div className={`bg-brand-navy p-8 rounded-[3.5rem] text-white relative overflow-hidden group ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} w-32 h-32 bg-brand-cyan/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000`} />
            <div className="relative z-10">
               <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="text-[10px] font-black uppercase text-brand-cyan tracking-widest leading-none">{t('realtime_flow')}</span>
                  <Activity size={18} className="text-brand-cyan animate-pulse" />
               </div>
               <p className="text-3xl font-black tracking-tighter">{transfers.length} {t('active_tasks')}</p>
            </div>
         </div>
      </div>
    </div>
  );
};
