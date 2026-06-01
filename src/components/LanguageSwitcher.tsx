
import React, { useState } from 'react';
import { Languages, ChevronDown, Check } from 'lucide-react';
import { useLanguage, Language } from '../hooks/useLanguage';
import { motion, AnimatePresence } from 'motion/react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: Language, label: string, native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'tr', label: 'Turkish', native: 'Türkçe' },
    { code: 'ar', label: 'Arabic', native: 'العربية' }
  ];

  const currentLang = languages.find(l => l.code === language);

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
      >
        <Languages size={18} className="text-brand-navy" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 hidden md:inline">
          {currentLang?.label}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`absolute top-full mt-2 w-48 bg-white border border-slate-100 rounded-3xl shadow-2xl p-2 z-50 ${isRTL ? 'left-0' : 'right-0'}`}
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                    language === lang.code 
                      ? 'bg-brand-navy text-white' 
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-black uppercase tracking-widest">{lang.label}</span>
                    <span className="text-[9px] opacity-60">{lang.native}</span>
                  </div>
                  {language === lang.code && <Check size={14} />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
