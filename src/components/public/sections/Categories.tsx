import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Stethoscope, 
  Package, 
  ShieldCheck, 
  Activity, 
  Boxes,
  Microscope,
  Baby,
  HeartPulse
} from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';

export const Categories: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const businessCategories = [
    {
      title: "Dermocosmetic Products",
      icon: Sparkles,
      color: "text-brand-cyan",
      bg: "bg-brand-cyan/5",
      items: [
        "Clinical Skin Care & Hydration",
        "Anti-Aging & Rejuvenation",
        "Sun Protection (SPF 30/50+)",
        "Hair & Body Care Solutions",
        "Private Label (Basimul Alama) Production"
      ],
      description: "Focused on hospitals, clinics, and specialized pharmacies with full branding support."
    },
    {
      title: "Medical Aesthetic Devices",
      icon: HeartPulse,
      color: "text-brand-green",
      bg: "bg-brand-green/5",
      items: [
        "RF Skin Tightening & IPL Systems",
        "Laser Resurfacing & Carbon Peeling",
        "Hydrafacial & Vacuum Systems",
        "Cryolipolysis & Body Contouring",
        "Fractional & LED Therapy"
      ],
      description: "High-value clinical equipment certified for professional dermatology and aesthetic centers."
    },
    {
      title: "Medical & Healthcare Devices",
      icon: Stethoscope,
      color: "text-brand-navy",
      bg: "bg-brand-navy/5",
      items: [
        "Ultrasound & Diagnostic Systems",
        "ECG & Patient Monitoring",
        "Operating Room Support Systems",
        "Dental Unit Systems",
        "Rehabilitation & Sterilization"
      ],
      description: "General medical technology bridging Turkish manufacturers with Gulf healthcare providers."
    },
    {
      title: "Disposable Medical Products",
      icon: Package,
      color: "text-brand-cyan",
      bg: "bg-brand-cyan/10",
      items: [
        "Masks & Respiratory Consumables",
        "Surgical Gowns & Cap Covers",
        "Catheters & Cannulas",
        "Sterile Gauzes & Gloves",
        "Syringes & Sample Containers"
      ],
      description: "High-volume, cost-effective supplies for continuous hospital chain requirements."
    },
    {
      title: "General Medical Supplies",
      icon: Boxes,
      color: "text-brand-green",
      bg: "bg-brand-green/10",
      items: [
        "Ward & Nursing Support Materials",
        "Orthopedic Supports & Braces",
        "Reusable Surgical Textiles",
        "Infection Control Solutions",
        "Stabilization & Bandaging"
      ],
      description: "Supportive materials excluding devices and disposables, focused on long-term clinic utility."
    },
    {
      title: "Industrial & Skincare Cooperation",
      icon: Microscope,
      color: "text-brand-navy",
      bg: "bg-brand-navy/10",
      items: [
        "Nutraceuticals & Supplements",
        "Vitamins & Mineral Solutions",
        "Medical Skincare Cooperation",
        "Technical Documentation Support",
        "International Certificates (ISO/CE)"
      ],
      description: "Strategic industrial partnerships for pharmaceutical and health-retail chains."
    }
  ];

  return (
    <section id="categories" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-brand-navy tracking-tighter uppercase mb-6">
            B2B Product <span className="text-brand-green font-serif italic">Categories</span>
          </h2>
          <p className="text-slate-400 font-bold max-w-2xl mx-auto uppercase text-xs tracking-widest leading-loose">
            Structured trade sectors connecting reliable Turkish sources with international standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businessCategories.map((cat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 hover:shadow-2xl hover:shadow-brand-navy/5 transition-all group"
            >
              <div className={`w-16 h-16 rounded-2xl ${cat.bg} ${cat.color} flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
                <cat.icon size={32} />
              </div>
              
              <h3 className="text-xl font-black text-brand-navy tracking-tight mb-4 uppercase">{cat.title}</h3>
              <p className="text-xs font-bold text-slate-400 leading-relaxed mb-6 italic">"{cat.description}"</p>
              
              <ul className="space-y-3">
                {cat.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <ShieldCheck size={14} className="text-brand-green mt-0.5 shrink-0" />
                    <span className="text-[11px] font-bold text-slate-600 leading-tight uppercase tracking-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
