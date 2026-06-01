import React, { useState } from 'react';
import { 
  Plus, 
  Briefcase, 
  Tag, 
  Layers, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Search,
  ShoppingCart,
  Boxes,
  Stethoscope,
  Sparkles
} from 'lucide-react';
import { B2BProductB2B, B2BInterestCategory, B2BMarketPositioning } from '../../../types';
import { useLanguage } from '../../../hooks/useLanguage';
import { LocalStorageManager, MELENT_KEYS } from '../../../services/localStorageManager';

interface B2BPortfolioSectionProps {
  products: B2BProductB2B[];
  onUpdate: (products: B2BProductB2B[]) => void;
}

export const B2BPortfolioSection: React.FC<B2BPortfolioSectionProps> = ({ products, onUpdate }) => {
  const { t, isRTL } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<B2BInterestCategory | 'All'>('All');

  // Form State
  const [formData, setFormData] = useState<Partial<B2BProductB2B>>({
    category: 'Dermocosmetics',
    marketPositioning: 'Premium'
  });

  const handleAdd = () => {
    if (!formData.name) return;

    const newProduct: B2BProductB2B = {
      id: `P-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      name: formData.name!,
      type: formData.type || 'General',
      category: formData.category || 'Dermocosmetics',
      marketPositioning: formData.marketPositioning || 'Premium'
    };

    const updated = [newProduct, ...products];
    onUpdate(updated);
    LocalStorageManager.save(MELENT_KEYS.B2B_PRODUCTS, updated);
    setIsModalOpen(false);
    setFormData({ category: 'Dermocosmetics', marketPositioning: 'Premium' });
  };

  const categories: B2BInterestCategory[] = ['Dermocosmetics', 'Cosmetics', 'Supplements', 'Medical Devices', 'Laboratory', 'Consumables'];

  const filtered = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-2">
           <button 
             onClick={() => setActiveCategory('All')}
             className={`px-6 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
               activeCategory === 'All' ? 'bg-brand-navy text-white' : 'bg-white text-slate-400 border border-slate-100'
             }`}
           >
             All
           </button>
           {categories.map(cat => (
             <button 
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={`px-6 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                 activeCategory === cat ? 'bg-brand-navy text-white' : 'bg-white text-slate-400 border border-slate-100'
               }`}
             >
               {cat}
             </button>
           ))}
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-navy text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-brand-green transition-all shadow-xl"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map(product => (
          <div key={product.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center text-center">
             <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 shrink-0 group-hover:scale-110 transition-transform ${
               product.category === 'Dermocosmetics' ? 'bg-brand-cyan/10 text-brand-cyan' :
               product.category === 'Medical Devices' ? 'bg-brand-navy/5 text-brand-navy' :
               'bg-brand-green/10 text-brand-green'
             }`}>
               {product.category === 'Dermocosmetics' ? <Sparkles size={32} /> : product.category === 'Medical Devices' ? <Stethoscope size={32} /> : <Boxes size={32} />}
             </div>
             
             <p className="text-[9px] font-black text-brand-green uppercase tracking-widest mb-1">{product.category}</p>
             <h4 className="text-lg font-black text-brand-navy leading-tight mb-2">{product.name}</h4>
             <p className="text-xs font-bold text-slate-400 italic mb-6">Positioning: {product.marketPositioning}</p>
             
             <div className="w-full pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-black text-slate-400">
               <span>{product.id}</span>
               <span className="text-brand-navy uppercase">{product.type}</span>
             </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-300 font-bold italic bg-white rounded-[3rem] border border-dashed border-slate-200">
             No products found in this category
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-brand-navy/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
             <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-2xl font-black text-brand-navy tracking-tighter uppercase">Add B2B Product</h3>
                  <p className="text-[10px] font-black text-brand-green uppercase tracking-widest mt-1">Portfolio Expansion</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-brand-navy transition-all">
                  <Plus size={24} className="rotate-45" />
                </button>
             </div>
             
             <div className="p-8 space-y-6">
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('product_name')} *</label>
                   <input 
                      type="text" 
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all"
                   />
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('category')}</label>
                   <select 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all appearance-none"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                   >
                     {categories.map(cat => <option key={cat}>{cat}</option>)}
                   </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('market_positioning')}</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all appearance-none"
                        value={formData.marketPositioning}
                        onChange={(e) => setFormData({...formData, marketPositioning: e.target.value as any})}
                      >
                        <option>Premium</option>
                        <option>Mid-range</option>
                      </select>
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('type')}</label>
                      <input 
                        type="text" 
                        value={formData.type || ''}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        placeholder="e.g. Skin Care"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-brand-navy focus:bg-white focus:border-brand-navy/20 outline-none transition-all"
                      />
                   </div>
                </div>
             </div>
             
             <div className="p-8 border-t border-slate-50 flex items-center justify-end gap-4 bg-slate-50/50">
                <button onClick={() => setIsModalOpen(false)} className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('cancel')}</button>
                <button 
                   onClick={handleAdd}
                   className="px-10 py-3.5 bg-brand-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-green transition-all shadow-xl shadow-brand-navy/10"
                >
                   Add to Portfolio
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
