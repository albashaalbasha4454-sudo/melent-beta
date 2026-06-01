import React from 'react';
import { motion } from 'motion/react';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Categories } from './sections/Categories';
import { ContactPartner } from './sections/ContactPartner';
import { Logo } from '../Logo';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useLanguage } from '../../hooks/useLanguage';
import { User, LogIn } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  const { t, isRTL } = useLanguage();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Logo className="h-10" />
          
          <div className="hidden lg:flex items-center gap-10">
            {['about', 'categories', 'partner'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-navy transition-all"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button 
              onClick={onLoginClick}
              className="px-6 py-2.5 bg-brand-navy text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-brand-green transition-all shadow-lg shadow-brand-navy/10"
            >
              <LogIn size={14} />
              B2B Login
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Hero 
          onExplore={() => scrollToSection('categories')} 
          onPartner={() => scrollToSection('partner')} 
        />
        <About />
        <Categories />
        <ContactPartner />
      </main>

      {/* Footer */}
      <footer className="bg-brand-navy py-20 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 border-b border-white/5 pb-20">
             <div className="max-w-sm">
                <Logo className="h-10 mb-6 bg-white p-2 rounded-xl" />
                <p className="text-xs font-bold text-white/40 leading-relaxed uppercase tracking-tight">
                  Türkiye-based international trading hub. Bridging reliable manufacturers with global partners across the Middle East and Gulf.
                </p>
             </div>
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-12">
                <div className="space-y-4">
                   <h5 className="text-[10px] font-black uppercase tracking-widest text-brand-cyan">Sectors</h5>
                   <ul className="space-y-2 text-xs font-bold text-white/60">
                      <li className="hover:text-white cursor-pointer transition-colors">Dermocosmetics</li>
                      <li className="hover:text-white cursor-pointer transition-colors">Medical Devices</li>
                      <li className="hover:text-white cursor-pointer transition-colors">Disposables</li>
                   </ul>
                </div>
                <div className="space-y-4">
                   <h5 className="text-[10px] font-black uppercase tracking-widest text-brand-cyan">Company</h5>
                   <ul className="space-y-2 text-xs font-bold text-white/60">
                      <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                      <li className="hover:text-white cursor-pointer transition-colors">How we work</li>
                      <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
                   </ul>
                </div>
                <div className="space-y-4 hidden lg:block">
                   <h5 className="text-[10px] font-black uppercase tracking-widest text-brand-cyan">Contact</h5>
                   <ul className="space-y-2 text-xs font-bold text-white/60">
                      <li className="hover:text-white cursor-pointer transition-colors">contact@melentcare.com</li>
                      <li className="hover:text-white cursor-pointer transition-colors">Antalya, Türkiye</li>
                   </ul>
                </div>
             </div>
          </div>
          <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-4 text-white/20 text-[9px] font-black uppercase tracking-[0.2em]">
             <p>© 2026 MELENT CARE INTERNATIONAL TRADE. ALL RIGHTS RESERVED.</p>
             <div className="flex gap-6">
                <span>Privacy Strategy</span>
                <span>Terms of Trade</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
