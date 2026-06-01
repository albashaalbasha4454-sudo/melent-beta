import React from 'react';
import { motion } from 'motion/react';
import { Globe, Building2, ShieldCheck, HeartPulse } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';

export const About: React.FC = () => {
  const { t, isRTL } = useLanguage();

  return (
    <section id="about" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-[100px] -mr-64 -mt-64"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-square bg-white rounded-[4rem] shadow-2xl overflow-hidden p-12 border border-white">
              <div className="grid grid-cols-2 gap-8 h-full">
                <div className="space-y-8">
                  <div className="bg-brand-navy p-8 rounded-[2rem] text-brand-cyan aspect-square flex flex-col justify-between">
                    <Globe size={40} />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">International Reach</p>
                  </div>
                  <div className="bg-brand-green p-8 rounded-[2rem] text-brand-navy aspect-square flex flex-col justify-between">
                    <ShieldCheck size={40} />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Turkish Standards</p>
                  </div>
                </div>
                <div className="pt-20 space-y-8">
                  <div className="bg-brand-cyan p-8 rounded-[2rem] text-brand-navy aspect-square flex flex-col justify-between">
                    <Building2 size={40} />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">B2B Core System</p>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-[2rem] text-brand-navy border border-slate-100 aspect-square flex flex-col justify-between">
                    <HeartPulse size={40} />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Healthcare Focus</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Absolute Badge */}
            <div className="absolute -bottom-10 -right-10 bg-brand-navy text-white p-10 rounded-full shadow-2xl border-8 border-slate-50 hidden lg:flex flex-col items-center justify-center text-center">
               <span className="text-4xl font-black text-brand-green leading-none">TR</span>
               <span className="text-[8px] font-black uppercase tracking-widest mt-1">Gateway</span>
            </div>
          </div>

          <div className={isRTL ? 'text-right' : 'text-left'}>
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-navy text-brand-cyan text-[10px] font-black uppercase tracking-widest mb-6">
              About Melent Care
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-brand-navy leading-[1.1] tracking-tighter uppercase mb-8">
              The Bridge Between Health, Tourism <span className="text-brand-green font-serif italic">and Trade.</span>
            </h2>
            <p className="text-lg text-slate-600 font-bold leading-relaxed mb-8 uppercase tracking-tight">
              Melent Care is a Türkiye-based international trading company connecting reliable Turkish manufacturers and suppliers with healthcare institutions, distributors, clinics, hospitals, pharmacies, and business partners across the Middle East and Gulf region.
            </p>
            <div className="space-y-6 text-slate-500 font-medium">
               <p>We don't just sell products; we manage a comprehensive supply network and commercial cooperation ecosystem. Our mission is to facilitate secure, sustainable, and professional long-term partnerships bridging the gap between Turkish production excellence and the rising demands of international health markets.</p>
               <div className="grid grid-cols-2 gap-6 pt-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-3xl font-black text-brand-navy">100%</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Sources</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-3xl font-black text-brand-navy">ISO+</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Certifications</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
