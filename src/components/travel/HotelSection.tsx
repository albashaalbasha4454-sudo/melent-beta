import React, { useState, useEffect } from 'react';
import { Hotel as HotelIcon, Plus, FileDown, MapPin, Star, Bed, Waves, Coffee, ShieldCheck, ChevronRight, Info } from 'lucide-react';
import { DataTable } from '../DataTable';
import { LocalStorageManager, MELENT_KEYS } from '../../services/localStorageManager';
import { Hotel } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

export const HotelSection: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    setHotels(LocalStorageManager.get(MELENT_KEYS.TRAVEL_HOTELS) || []);
  }, []);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(hotels, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "melent_accommodation_catalog.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const columns = [
    { header: t('hotel_property'), accessor: (h: Hotel) => (
      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
        <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-[1.8rem] flex items-center justify-center shadow-inner border border-amber-100 overflow-hidden relative group shrink-0">
           <HotelIcon size={24} className="group-hover:scale-110 transition-all" />
           <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-4 h-4 bg-amber-500/10 rounded-bl-xl`} />
        </div>
        <div>
          <p className="font-black text-brand-navy tracking-tight leading-none">{h.name}</p>
          <div className={`flex items-center gap-2 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
             <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none tabular-nums">{h.id}</span>
             <div className={`flex items-center gap-0.5 text-brand-gold ${isRTL ? 'mr-2' : 'ml-2'}`}>
                {[...Array(h.stars)].map((_, i) => <Star key={i} size={8} fill="currentColor" />)}
             </div>
          </div>
        </div>
      </div>
    )},
    { header: t('location_context'), accessor: (h: Hotel) => (
      <div className={`flex items-center gap-2 text-slate-500 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
        <MapPin size={14} className="text-amber-500 shrink-0" />
        <span className="text-sm font-bold truncate max-w-[200px]">{h.location}</span>
      </div>
    )},
    { header: t('available_amenities'), accessor: (h: Hotel) => (
      <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
         <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
            <Bed size={14} className="text-brand-navy" />
            <span className="text-[8px] font-black uppercase whitespace-nowrap">{t('post_op_rooms')}</span>
         </div>
         <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
            <Waves size={14} className="text-brand-navy" />
            <span className="text-[8px] font-black uppercase whitespace-nowrap">{t('spa_recovery')}</span>
         </div>
         <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
            <Coffee size={14} className="text-brand-navy" />
            <span className="text-[8px] font-black uppercase whitespace-nowrap">{t('halal_buffet')}</span>
         </div>
      </div>
    )},
    { header: t('preferential_prices'), accessor: (h: Hotel) => (
      <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
         <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-brand-navy tabular-nums">${h.pricePerNight}</span>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-tight">/ {t('night')}</span>
         </div>
         <span className="text-[8px] font-black text-brand-green uppercase mt-0.5 tracking-tighter">{t('melent_corporate_rate')}</span>
      </div>
    )},
    { header: t('efficiency_index'), accessor: (h: Hotel) => (
      <div className="flex items-center gap-2 font-black text-brand-navy text-xs">
         <ShieldCheck size={14} className="text-brand-cyan" />
         <span className="tabular-nums">9.2 / 10</span>
      </div>
    )},
  ];

  return (
    <div className={`space-y-10 animate-in fade-in duration-500 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
           <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <HotelIcon className="text-amber-500" size={24} />
              <h2 className="text-3xl font-black text-brand-navy tracking-tight uppercase leading-none">{t('hotel_concierge_ops')}</h2>
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none mb-1">{t('hotel_ops_desc')}</p>
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
              const name = prompt(t('enter_hotel_name'));
              if (name) {
                const newHotel: Hotel = {
                  id: 'htl' + Date.now() + Math.random().toString(36).substring(2, 9),
                  name,
                  location: t('istanbul'),
                  stars: 5,
                  roomTypes: ['Standard', 'Luxury Suite'],
                  basePricePerNight: 150,
                  pricePerNight: 150,
                  contractStatus: 'Active',
                  amenities: ['Spa', 'Halal Food', 'Accessible'],
                  contact: 'info@' + name.toLowerCase().replace(/ /g, '') + '.com'
                };
                const updated = [...hotels, newHotel];
                setHotels(updated);
                LocalStorageManager.save(MELENT_KEYS.TRAVEL_HOTELS, updated);
              }
            }}
            className="bg-brand-navy text-white px-8 py-5 rounded-2xl font-black text-xs shadow-2xl shadow-brand-navy/30 hover:bg-brand-green transition-all flex items-center gap-4 group uppercase tracking-[0.2em]"
          >
            <Plus size={20} className="text-brand-cyan group-hover:rotate-90 transition-transform" />
            {t('contract_new_property')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden p-2 text-left">
        <DataTable 
          data={hotels} 
          columns={columns}
          onEdit={() => {}}
          onDelete={() => {}}
          onView={(h) => console.log('View Accommodation Portfolio', h)}
        />
      </div>

      {/* Recovery Logistics Insight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 bg-slate-50 border border-slate-100 p-8 rounded-[3rem] flex flex-col md:flex-row gap-8 items-center">
            <div className="shrink-0 w-24 h-24 bg-white rounded-[2rem] border border-slate-200 flex items-center justify-center text-amber-500 shadow-sm">
               <Bed size={40} />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
               <h4 className="text-[11px] font-black text-brand-navy uppercase tracking-widest mb-2">{t('hotel_logistics_standards')}</h4>
               <p className="text-xs font-bold text-slate-500 leading-relaxed max-w-lg">
                 {t('hotel_logistics_desc')}
               </p>
            </div>
         </div>
         <div className="bg-brand-navy p-8 rounded-[3rem] text-white flex flex-col justify-between relative overflow-hidden group">
            <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-32 h-32 bg-brand-cyan/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000`} />
            <div className={`relative z-10 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
               <span className="text-[10px] font-black uppercase text-brand-cyan tracking-widest">{t('global_inventory')}</span>
               <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                  <Star size={14} className="text-brand-gold" fill="currentColor" />
               </div>
            </div>
            <div className={`relative z-10 mt-6 ${isRTL ? 'text-right' : 'text-left'}`}>
               <p className="text-4xl font-black tracking-tighter tabular-nums">{hotels.length * 45}</p>
               <p className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">{t('rooms_reserved_weekly')}</p>
            </div>
            <button 
              onClick={() => alert(t('check_availability_started'))}
              className="mt-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all text-[9px] font-black uppercase tracking-[0.2em] relative z-10"
            >
               {t('check_availability')}
            </button>
         </div>
      </div>
    </div>
  );
};
