import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, FileDown, Clock, Search, Filter, ShieldCheck, Info, ChevronLeft, ChevronRight, Activity, Plane, Hospital, Hotel } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LocalStorageManager, MELENT_KEYS } from '../../services/localStorageManager';
import { Patient, PartnerHospital, MedicalProgram } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

export const TravelReservationsSection: React.FC = () => {
  const { t, isRTL, language } = useLanguage();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    setPatients(LocalStorageManager.get(MELENT_KEYS.TRAVEL_PATIENTS) || []);
  }, []);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  // Mock schedule data for visualization
  const scheduleData: Record<number, { type: 'Flight' | 'Surgery' | 'Checkout', client: string }[]> = {
    4: [{ type: 'Flight', client: 'Al-Anzi' }],
    8: [{ type: 'Surgery', client: 'Nasser K.' }],
    12: [{ type: 'Flight', client: 'Fahad S.' }, { type: 'Surgery', client: 'Sara M.' }],
    15: [{ type: 'Checkout', client: 'Mohammed A.' }],
    21: [{ type: 'Surgery', client: 'Khalid T.' }],
    25: [{ type: 'Flight', client: 'Ahmed J.' }],
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleString(language === 'ar' ? 'ar-EG' : language === 'tr' ? 'tr-TR' : 'en-US', { month: 'long' });
  };

  return (
    <div className={`space-y-10 animate-in fade-in duration-500 pb-20 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
           <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse justify-start' : 'flex-row'}`}>
              <CalendarIcon className="text-indigo-500" size={24} />
              <h2 className="text-3xl font-black text-brand-navy tracking-tight uppercase leading-none">{t('master_schedule')}</h2>
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{t('schedule_desc')}</p>
        </div>
        <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
           <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-brand-navy shadow-sm transition-all">
             <Filter size={20} />
           </button>
           <button className="bg-brand-navy text-white px-8 py-5 rounded-2xl font-black text-xs shadow-2xl shadow-brand-navy/30 hover:bg-brand-green transition-all flex items-center gap-4 group uppercase tracking-[0.2em] whitespace-nowrap">
             <Plus size={20} className="text-brand-cyan group-hover:rotate-90 transition-transform" />
             {t('sync_reservation')}
           </button>
        </div>
      </div>

      {/* Calendar Matrix */}
      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden p-10">
         <div className={`flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
               <h3 className="text-3xl font-black text-brand-navy tracking-tighter uppercase tabular-nums leading-none">
                 {getMonthName(currentMonth)} {currentMonth.getFullYear()}
               </h3>
               <div className={`flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-brand-navy hover:bg-white transition-all shadow-sm">
                    {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                  </button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-brand-navy hover:bg-white transition-all shadow-sm">
                    {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                  </button>
               </div>
            </div>
            
            <div className={`flex flex-wrap gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
               <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-3 h-3 rounded-full bg-cyan-500" />
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mt-0.5">{t('flight_node')}</span>
               </div>
               <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mt-0.5">{t('clinical_event')}</span>
               </div>
               <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mt-0.5">{t('lodging_logic')}</span>
               </div>
            </div>
         </div>

         <div className={`grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-[2.5rem] overflow-hidden ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            {[t('sunday_short'), t('monday_short'), t('tuesday_short'), t('wednesday_short'), t('thursday_short'), t('friday_short'), t('saturday_short')].map(day => (
              <div key={day} className="bg-slate-50 py-4 text-center font-black text-[10px] uppercase tracking-widest text-slate-400 leading-none">
                {day}
              </div>
            ))}
            
            {emptyDays.map(i => (
              <div key={`empty-${i}`} className="bg-white min-h-[140px] p-4 opacity-20" />
            ))}

            {days.map(day => (
              <div key={day} className="bg-white min-h-[140px] p-4 group hover:bg-slate-50/50 transition-colors">
                 <span className={`text-xs font-black text-slate-300 group-hover:text-brand-navy transition-colors tabular-nums block ${isRTL ? 'text-right' : 'text-left'}`}>
                    {day < 10 ? `0${day}` : day}
                 </span>
                 <div className="mt-4 space-y-2">
                    {scheduleData[day]?.map((event, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 5 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-2 rounded-xl border flex flex-col gap-1 shadow-sm ${
                          event.type === 'Flight' ? 'bg-cyan-50 border-cyan-100' :
                          event.type === 'Surgery' ? 'bg-red-50 border-red-100' :
                          'bg-amber-50 border-amber-100'
                        } ${isRTL ? 'text-right' : 'text-left'}`}
                      >
                         <p className={`text-[8px] font-black uppercase tracking-widest leading-none ${
                           event.type === 'Flight' ? 'text-cyan-600' :
                           event.type === 'Surgery' ? 'text-red-500' :
                           'text-amber-600'
                         }`}>
                           {event.type === 'Flight' ? t('flight') : event.type === 'Surgery' ? t('surgery') : t('checkout')}
                         </p>
                         <p className="text-[10px] font-black text-brand-navy tracking-tight leading-none">{event.client}</p>
                      </motion.div>
                    ))}
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Resource Allocation Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className={`bg-brand-navy rounded-[3rem] p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-brand-navy/30 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-64 h-64 bg-brand-cyan/20 rounded-full blur-[100px] ${isRTL ? '-ml-32' : '-mr-32'} -mt-32`} />
            <div className={`relative z-10 flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
               <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest leading-none">{t('resource_utilization')}</span>
               <Activity size={20} className="text-brand-cyan animate-pulse" />
            </div>
            <div className="relative z-10 space-y-6">
               <div className={`flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[10px] font-black uppercase text-white/50 leading-none">{t('ot_capacity')}</span>
                  <span className="text-xl font-black text-brand-cyan tabular-nums leading-none">84%</span>
               </div>
               <div className={`flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[10px] font-black uppercase text-white/50 leading-none">{t('lodging_yield')}</span>
                  <span className="text-xl font-black text-brand-cyan tabular-nums leading-none">92%</span>
               </div>
            </div>
            <button className="mt-8 py-3 bg-white/10 hover:bg-white border border-white/10 hover:text-brand-navy h-12 rounded-xl transition-all text-[10px] font-black uppercase tracking-[0.2em] relative z-10 leading-none">
              {t('generate_capacity_audit')}
            </button>
         </div>

         <div className={`lg:col-span-2 bg-slate-50 border border-slate-100 rounded-[3rem] p-10 flex flex-col justify-between ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
               <h4 className={`text-[11px] font-black text-brand-navy uppercase tracking-widest flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                 <ShieldCheck className="text-brand-green" size={18} />
                 {t('upcoming_checkpoints')}
               </h4>
               <span className="text-[9px] font-black text-slate-300 uppercase leading-none">{t('live_ops_stream')}</span>
            </div>
            
            <div className="space-y-4">
               {[
                 { time: '14:20', task: 'Patient AK-924 Airport Pickup Dispatch', unit: 'Fleet Unit 04', status: 'Active' },
                 { time: '16:00', task: 'Hospital Pre-Op Audit (Patient Nasser)', unit: 'Clinical Team', status: 'Scheduled' },
                 { time: '19:30', task: 'Patient Sara M. Post-Op Hotel Verification', unit: 'Account Mgmt', status: 'Pending' },
               ].map((item, i) => (
                 <div key={i} className={`bg-white p-5 rounded-[2rem] border border-slate-200 flex items-center justify-between group hover:border-brand-cyan transition-all ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                       <span className="text-xs font-black text-brand-navy tabular-nums px-3 py-1 bg-slate-50 rounded-lg whitespace-nowrap">{item.time}</span>
                       <div>
                          <p className={`text-sm font-black text-brand-navy tracking-tight leading-none ${isRTL ? 'text-right' : 'text-left'}`}>{item.task}</p>
                          <p className={`text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 leading-none ${isRTL ? 'text-right' : 'text-left'}`}>{item.unit}</p>
                       </div>
                    </div>
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                       <span className="text-[9px] font-black text-brand-cyan uppercase tracking-widest px-3 py-1 bg-brand-cyan/5 rounded-full whitespace-nowrap">{item.status}</span>
                       {isRTL ? <ChevronLeft className="text-slate-200 group-hover:text-brand-navy transition-colors" size={16} /> : <ChevronRight className="text-slate-200 group-hover:text-brand-navy transition-colors" size={16} />}
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};
