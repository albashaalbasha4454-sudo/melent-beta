import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Plane, 
  MapPin, 
  Calendar, 
  Bus, 
  Hotel, 
  Hospital, 
  FileText, 
  BarChart3,
  LogOut,
  Search,
  Bell,
  Settings,
  Menu,
  X,
  User,
  DollarSign,
  Activity
} from 'lucide-react';
import { TravelView, PatientStatus } from '../types';
import { PatientSection } from './travel/PatientSection';
import { HospitalSection } from './travel/HospitalSection';
import { ProgramSection } from './travel/ProgramSection';
import { DoctorSection } from './travel/DoctorSection';
import { HotelSection } from './travel/HotelSection';
import { FlightSection } from './travel/FlightSection';
import { TransferSection } from './travel/TransferSection';
import { TravelFinanceSection } from './travel/TravelFinanceSection';
import { TravelReportsSection } from './travel/TravelReportsSection';
import { TravelReservationsSection } from './travel/TravelReservationsSection';
import { SettingsSection } from './SettingsSection';
import { LocalStorageManager, MELENT_KEYS } from '../services/localStorageManager';
import { Logo } from './Logo';
import { mockPatients, mockHospitals } from '../data';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageSwitcher } from './LanguageSwitcher';

// New Sections (To be implemented)
const PlaceholderSection: React.FC<{ title: string }> = ({ title }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 min-h-[500px] flex items-center justify-center p-12 text-center">
      <div>
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-6">
          <LayoutDashboard size={48} />
        </div>
        <h3 className="text-xl font-black text-brand-navy mb-2 tracking-tighter uppercase">{title} {t('active_global')}</h3>
        <p className="text-slate-400 font-bold max-w-sm mx-auto text-sm italic">
          This module is under development for full management of {title}.
        </p>
      </div>
    </div>
  );
};

export const TravelDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<TravelView>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Initialize Data
  useEffect(() => {
    const isInitialized = localStorage.getItem('melent_database_initialized') === 'true';
    const storedPatients = LocalStorageManager.get(MELENT_KEYS.TRAVEL_PATIENTS);
    const storedHospitals = LocalStorageManager.get(MELENT_KEYS.TRAVEL_HOSPITALS); 

    if (!isInitialized) {
      if (!storedPatients || storedPatients.length === 0) {
        LocalStorageManager.save(MELENT_KEYS.TRAVEL_PATIENTS, mockPatients);
      }
      
      if (!storedHospitals || storedHospitals.length === 0) {
        LocalStorageManager.save(MELENT_KEYS.TRAVEL_HOSPITALS, mockHospitals);
      }
      localStorage.setItem('melent_database_initialized', 'true');
    }

    // Initialize all other keys if empty
    const ensureKey = (key: string, data: any = []) => {
      if (!LocalStorageManager.get(key)) {
        LocalStorageManager.save(key, data);
      }
    };

    ensureKey(MELENT_KEYS.TRAVEL_DOCTORS);
    ensureKey(MELENT_KEYS.TRAVEL_HOTELS);
    ensureKey(MELENT_KEYS.TRAVEL_FLIGHTS);
    ensureKey(MELENT_KEYS.TRAVEL_TRANSFERS);
    ensureKey(MELENT_KEYS.TRAVEL_PROGRAMS, LocalStorageManager.get(MELENT_KEYS.TRAVEL_PROGRAMS) || []);
  }, []);

  const menuItems: { id: TravelView; icon: any; label: string; color: string }[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard'), color: 'text-brand-cyan' },
    { id: 'patients', icon: Users, label: t('patients'), color: 'text-blue-500' },
    { id: 'programs', icon: Stethoscope, label: t('programs'), color: 'text-brand-green' },
    { id: 'hospitals', icon: Hospital, label: t('hospitals'), color: 'text-red-500' },
    { id: 'doctors', icon: User, label: t('doctors'), color: 'text-purple-500' },
    { id: 'hotels', icon: Hotel, label: t('hotels'), color: 'text-amber-500' },
    { id: 'flights', icon: Plane, label: t('flights'), color: 'text-cyan-500' },
    { id: 'transfers', icon: Bus, label: t('transfers'), color: 'text-orange-500' },
    { id: 'reservations', icon: Calendar, label: t('reservations'), color: 'text-indigo-500' },
    { id: 'finance', icon: FileText, label: t('travel_finance'), color: 'text-emerald-500' },
    { id: 'reports', icon: BarChart3, label: t('reports'), color: 'text-rose-500' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <OperationalPulse />;
      case 'patients':
        return <PatientSection />;
      case 'hospitals':
        return <HospitalSection />;
      case 'programs':
        return <ProgramSection />;
      case 'doctors':
        return <DoctorSection />;
      case 'hotels':
        return <HotelSection />;
      case 'flights':
        return <FlightSection />;
      case 'transfers':
        return <TransferSection />;
      case 'finance':
        return <TravelFinanceSection />;
      case 'reports':
        return <TravelReportsSection />;
      case 'reservations':
        return <TravelReservationsSection />;
      default:
        const item = menuItems.find(i => i.id === activeTab);
        return <PlaceholderSection title={item?.label || activeTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div 
            initial={{ x: isRTL ? 280 : -280 }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? 280 : -280 }}
            className={`w-72 bg-white h-screen ${isRTL ? 'border-l' : 'border-r'} border-slate-100 flex flex-col relative z-50 shadow-2xl`}
          >
            <div className={`p-8 overflow-y-auto custom-scrollbar ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center gap-3 mb-10">
                <Logo className="h-10" />
                <div>
                   <h2 className="text-xl font-black text-brand-navy leading-none">MELENT</h2>
                   <p className="text-[10px] font-black text-brand-green uppercase tracking-[0.2em] mt-1">{t('travel_panel')}</p>
                </div>
              </div>

              <div className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-black text-[11px] uppercase tracking-wider ${
                      activeTab === item.id 
                        ? 'bg-brand-navy text-white shadow-xl shadow-brand-navy/20' 
                        : 'text-slate-400 hover:bg-slate-50 hover:text-brand-navy'
                    } ${isRTL ? 'flex-row' : 'flex-row-reverse justify-end'}`}
                  >
                    <item.icon size={18} className={activeTab === item.id ? item.color : 'opacity-40'} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto p-8 pt-0 space-y-4">
               <button 
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-red-500 bg-red-50/50 hover:bg-red-50 transition-all font-black text-[11px] uppercase tracking-widest justify-center"
               >
                 <LogOut size={18} />
                 <span>{t('logout')}</span>
               </button>

               <div className={`p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3 ${isRTL ? 'flex-row' : 'flex-row'}`}>
                  <div className="w-10 h-10 rounded-xl bg-brand-navy flex items-center justify-center text-brand-cyan shadow-lg">
                    <User size={20} />
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="text-[10px] font-black text-brand-navy uppercase tracking-tighter">Travel Ops Manager</p>
                    <p className="text-[9px] font-bold text-slate-400">ops@melent.care</p>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-brand-navy transition-all"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="relative w-96 hidden lg:block">
              <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-300`} size={18} />
              <input 
                type="text" 
                placeholder={t('search')} 
                className={`w-full bg-slate-50 border-transparent rounded-xl py-2.5 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-xs font-black uppercase tracking-widest focus:bg-white focus:border-brand-navy/10 transition-all outline-none`}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
             <LanguageSwitcher />
             <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('active_global')}</span>
             </div>
             <button 
               onClick={() => alert('Check notifications panel.')}
               className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-brand-navy relative"
             >
                <Bell size={20} />
                <span className="absolute top-2.5 left-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

const OperationalPulse: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [patients, setPatients] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [notificationsDismissed, setNotificationsDismissed] = useState(false);

  useEffect(() => {
    setPatients(LocalStorageManager.get(MELENT_KEYS.TRAVEL_PATIENTS) || []);
    setInvoices(LocalStorageManager.get(MELENT_KEYS.TRAVEL_INVOICES) || []);
    setHospitals(LocalStorageManager.get(MELENT_KEYS.TRAVEL_HOSPITALS) || []);
    setDoctors(LocalStorageManager.get(MELENT_KEYS.TRAVEL_DOCTORS) || []);
    setHotels(LocalStorageManager.get(MELENT_KEYS.TRAVEL_HOTELS) || []);
  }, []);

  const totalRevenue = invoices.reduce((acc, inv) => acc + (inv.paidAmount || 0), 0);
  const activeLeads = patients.length;
  const networkNodes = hospitals.length + hotels.length;

  const inquiryCount = patients.filter(p => p.status === 'Inquiry').length;
  const treatmentCount = patients.filter(p => p.status === 'Active' || p.status === 'Treatment').length;
  const recoveryCount = patients.filter(p => p.status === 'Recovery').length;

  return (
    <div className={`space-y-10 animate-in fade-in duration-700 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <p className="text-[10px] font-black uppercase text-brand-green tracking-[0.4em] mb-2">{t('command_center')}</p>
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
             <h2 className="text-4xl font-black text-brand-navy tracking-tight uppercase">{t('dashboard')}</h2>
             <div className="px-3 py-1 bg-brand-cyan/20 border border-brand-cyan/30 rounded-full text-[9px] font-black text-brand-cyan animate-pulse">
                LIVE
             </div>
          </div>
        </div>
        <div className="flex gap-4">
           <div className={`bg-white p-5 rounded-[1.8rem] border border-slate-100 shadow-sm flex items-center gap-4 ${isRTL ? 'text-right flex-row-reverse' : 'text-left flex-row'}`}>
             <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green">
                <Activity size={20} />
             </div>
             <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t('status')}</p>
                <p className="text-xl font-black text-brand-navy tracking-tighter uppercase whitespace-nowrap">{t('active_global_node')}</p>
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className={`bg-brand-navy p-8 rounded-[3rem] text-white shadow-2xl shadow-brand-navy/30 relative overflow-hidden group ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-32 h-32 bg-brand-cyan/20 rounded-full blur-[60px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000`} />
                  <p className="text-[10px] font-black text-brand-cyan uppercase tracking-widest mb-4 leading-none">{t('total_revenue')}</p>
                  <p className="text-4xl font-black tabular-nums tracking-tighter mb-2 leading-none">${totalRevenue.toLocaleString()}</p>
                  <p className="text-[10px] font-black text-brand-green flex items-center gap-1 leading-none">+14.2% Growth</p>
               </div>

               <div className={`bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between group ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div>
                    <Users size={24} className={`text-blue-500 mb-4 group-hover:scale-110 transition-transform ${isRTL ? 'mr-auto' : 'ml-0'}`} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{t('patients')}</p>
                    <p className="text-3xl font-black text-brand-navy tracking-tighter leading-none">{activeLeads}</p>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-blue-500" style={{ width: `${Math.min((activeLeads / 50) * 100, 100)}%` }} />
                  </div>
               </div>

               <div className={`bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between group ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div>
                    <Hospital size={24} className={`text-red-500 mb-4 group-hover:scale-110 transition-transform ${isRTL ? 'mr-auto' : 'ml-0'}`} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{t('hospitals')}</p>
                    <p className="text-3xl font-black text-brand-navy tracking-tighter leading-none">{networkNodes}</p>
                  </div>
                  <div className="flex gap-1 mt-4">
                     {[1,2,3,4,5].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= Math.ceil(networkNodes / 10) ? 'bg-red-500' : 'bg-slate-100'}`} />)}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className={`bg-white rounded-[3.5rem] border border-slate-100 p-10 shadow-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                     <h3 className="text-lg font-black text-brand-navy tracking-tight uppercase leading-none">{t('operational_pipeline')}</h3>
                     <span className="text-[9px] font-black text-brand-cyan tracking-widest uppercase leading-none">{t('live_metrics')}</span>
                  </div>
                  <div className="space-y-6">
                     {[
                       { stage: t('inquiries'), val: inquiryCount, color: 'bg-brand-navy' },
                       { stage: t('treatment'), val: treatmentCount, color: 'bg-brand-cyan' },
                       { stage: t('recovery'), val: recoveryCount, color: 'bg-brand-green' },
                     ].map((item, i) => (
                       <div key={i} className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                          <span className={`text-[9px] font-black text-slate-400 uppercase tracking-widest w-24 ${isRTL ? 'text-right' : 'text-left'}`}>{item.stage}</span>
                          <div className="flex-1 h-3 bg-slate-50 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} animate={{ width: `${(item.val / patients.length || 1) * 100}%` }} className={`h-full ${item.color}`} />
                          </div>
                          <span className={`text-xs font-black tabular-nums w-8 underline ${isRTL ? 'text-right' : 'text-left'}`}>{item.val}</span>
                       </div>
                     ))}
                  </div>
               </div>

               <div className={`bg-slate-50 rounded-[3.5rem] border border-slate-100 p-10 flex flex-col justify-between ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div>
                     <h3 className="text-lg font-black text-brand-navy tracking-tight uppercase mb-2 leading-none">{t('strategy_insights')}</h3>
                     <p className="text-xs font-bold text-slate-400 leading-relaxed italic">
                       "Focus on Riyadh route optimization for Q3. Oncology cases up 12% MoM."
                     </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-8">
                     <div className="bg-white p-5 rounded-[2rem] border border-slate-200">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 leading-none">ARPU</p>
                        <p className="text-xl font-black text-brand-navy leading-none">$8,400</p>
                     </div>
                     <div className="bg-white p-5 rounded-[2rem] border border-slate-200">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 leading-none">Satisfaction</p>
                        <p className="text-xl font-black text-brand-green leading-none">98.4%</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Sidebar Alerts */}
         <div className="space-y-8">
            <div className={`bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm ${isRTL ? 'text-right' : 'text-left'}`}>
               <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <h3 className="text-xs font-black text-brand-navy uppercase tracking-widest leading-none">{t('active_alerts')}</h3>
                  <Bell className="text-brand-navy animate-bounce" size={18} />
               </div>
               <div className="space-y-4">
                   <AnimatePresence>
                    {!notificationsDismissed && (
                      <>
                        <motion.div 
                          exit={{ opacity: 0, height: 0, margin: 0, padding: 0 }}
                          className="p-5 bg-orange-50 border border-orange-100 rounded-3xl group cursor-pointer hover:bg-orange-100 transition-all overflow-hidden"
                        >
                           <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                              <Plane size={16} className="text-orange-600" />
                              <span className="text-[10px] font-black text-orange-600 uppercase leading-none">{t('flight_delay')}</span>
                           </div>
                           <p className="text-xs font-black text-brand-navy leading-tight group-hover:underline transition-all">Nasser's flight (TK1924) delayed 3 hours.</p>
                        </motion.div>
      
                        <motion.div 
                          exit={{ opacity: 0, height: 0, margin: 0, padding: 0 }}
                          className="p-5 bg-red-50 border border-red-100 rounded-3xl group cursor-pointer hover:bg-red-100 transition-all overflow-hidden"
                        >
                           <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                              <Hospital size={16} className="text-red-600" />
                              <span className="text-[10px] font-black text-red-600 uppercase leading-none">{t('conflict')}</span>
                           </div>
                           <p className="text-xs font-black text-brand-navy leading-tight group-hover:underline transition-all">Schedule conflict for Hospital Memorial Case #TK-924.</p>
                        </motion.div>
                      </>
                    )}
                   </AnimatePresence>
                  
                  {notificationsDismissed && (
                    <div className="py-10 text-center">
                       <Bell size={32} className="mx-auto text-slate-200 mb-2" />
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t('no_alerts')}</p>
                    </div>
                  )}
               </div>
               <button 
                onClick={() => setNotificationsDismissed(true)}
                disabled={notificationsDismissed}
                className="w-full mt-8 py-4 border-2 border-slate-50 hover:bg-slate-50 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-navy transition-all disabled:opacity-30 disabled:cursor-not-allowed uppercase"
               >
                  {t('dismiss_alerts')}
               </button>
            </div>

            {/* Quick Action Matrix */}
            <div className={`bg-brand-navy p-8 rounded-[3.5rem] text-white space-y-6 shadow-2xl shadow-brand-navy/30 ${isRTL ? 'text-right' : 'text-left'}`}>
               <h4 className="text-[10px] font-black text-brand-cyan uppercase tracking-[0.3em] leading-none">{t('master_operations')}</h4>
               <div className="grid grid-cols-1 gap-4">
                  <button 
                    className="w-full py-4 bg-white/10 hover:bg-white text-white hover:text-brand-navy rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                  >
                    {t('start_case_audit')}
                  </button>
                  <button 
                    className="w-full py-4 bg-white/10 hover:bg-white text-white hover:text-brand-navy rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                  >
                    {t('global_sync')}
                  </button>
               </div>
            </div>

            <div className="mt-8 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
               <p className="text-[10px] font-bold text-slate-400 leading-relaxed text-center">
                 {t('tech_support_msg')} <br/> 
                 <span className="font-black text-brand-navy underline decoration-brand-cyan underline-offset-4" dir="ltr">0096340392619</span>
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};
