import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Globe, Shield, Sparkles, Building2, Stethoscope, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';

interface HeroProps {
  onExplore: () => void;
  onPartner: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onPartner }) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-brand-navy">
      {/* Abstract Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-green/10 rounded-full blur-[120px] -mr-96 -mt-96 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-cyan/10 rounded-full blur-[100px] -ml-64 -mb-64 opacity-30"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
              <Sparkles size={16} className="text-brand-cyan" />
              <span className="text-[10px] font-black text-brand-cyan uppercase tracking-[0.3em]">{t('tagline')}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase mb-8">
              The <span className="text-brand-cyan">Bridge</span> <br />
              <span className="text-brand-green italic font-serif">Between</span> <br />
              Health & Trade
            </h1>

            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-12 max-w-2xl">
              Melent Care is a Türkiye-based international trading hub connecting reliable manufacturers with global partners across the Middle East and Gulf region.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button 
                onClick={onExplore}
                className="group relative px-10 py-5 bg-brand-green text-brand-navy rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-brand-cyan transition-all shadow-2xl shadow-brand-green/20"
              >
                Explore B2B Solutions
                <ArrowRight size={18} className={`transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
              
              <button 
                onClick={onPartner}
                className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-md"
              >
                Submit Partnership Request
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20 flex flex-col items-center gap-2"
      >
        <span className="text-[8px] font-black uppercase tracking-widest">Scroll to discover</span>
        <ChevronDown size={20} />
      </motion.div>
    </div>
  );
};
