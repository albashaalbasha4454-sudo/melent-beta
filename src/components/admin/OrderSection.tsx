import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Search, Filter, Printer, Edit2, Trash2, FileDown, Layers, User, Building2, Plus, Check, Truck, MapPin } from 'lucide-react';
import { DataTable } from '../DataTable';
import { MedicalOrder } from '../../types';
import { LocalStorageManager, MELENT_KEYS } from '../../services/localStorageManager';
import { mockMedicalOrders } from '../../data';
import { useLanguage } from '../../hooks/useLanguage';

export const OrderSection: React.FC<{ 
  onEditOrder?: (order: MedicalOrder) => void,
  onViewInvoice?: (order: MedicalOrder) => void,
  onAddOrder?: () => void
}> = ({ onEditOrder, onViewInvoice, onAddOrder }) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [orders, setOrders] = useState<MedicalOrder[]>([]);
  const [typeFilter, setTypeFilter] = useState<'All' | 'Individual' | 'Corporate'>('All');

  useEffect(() => {
    const stored = LocalStorageManager.get(MELENT_KEYS.ORDERS);
    if (stored && stored.length > 0) {
      setOrders(stored);
    } else {
      setOrders(mockMedicalOrders);
      LocalStorageManager.save(MELENT_KEYS.ORDERS, mockMedicalOrders);
    }
  }, []);

  const filteredOrders = useMemo(() => {
    if (typeFilter === 'All') return orders;
    return orders.filter(o => {
      const isCorporate = o.clientType !== 'Individual';
      return typeFilter === 'Corporate' ? isCorporate : !isCorporate;
    });
  }, [orders, typeFilter]);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orders, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "melent_orders.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleDelete = (id: string, clientName: string) => {
    if (confirm(`هل أنت متأكد من أرشفة الطلب الخاص بـ ${clientName}؟`)) {
      if (LocalStorageManager.softDelete(MELENT_KEYS.ORDERS, id, 'ORDER', `طلب: ${clientName}`)) {
        setOrders(prev => prev.filter(o => o.id !== id));
      }
    }
  };

  const columns = [
    { header: t('id'), accessor: (o: MedicalOrder) => <span className="font-mono text-[10px] font-black">{o.id.slice(0, 8)}</span> },
    { header: t('clients') || 'Client', accessor: (o: MedicalOrder) => (
      <div className="flex items-center gap-2">
        {o.clientType === 'Individual' ? <User size={12} className="text-brand-cyan" /> : <Building2 size={12} className="text-brand-green" />}
        <span className="font-bold">{o.clientName}</span>
      </div>
    )},
    { header: t('date'), accessor: (o: MedicalOrder) => new Date(o.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : language === 'tr' ? 'tr-TR' : 'en-US') },
    { header: t('total') || 'Total', accessor: (o: MedicalOrder) => <span className="font-black text-brand-navy">{(o.financials?.total || 0).toLocaleString()} $</span> },
    { 
      header: t('status'), 
      accessor: (o: MedicalOrder) => {
        const statusColors: any = {
          'Delivered': 'bg-green-50 text-green-500',
          'Received': 'bg-brand-green/10 text-brand-green',
          'In Transit': 'bg-blue-50 text-blue-500',
          'Shipping': 'bg-brand-cyan/10 text-brand-cyan',
          'Processing': 'bg-amber-50 text-amber-500',
          'Awaiting Payment': 'bg-orange-50 text-orange-600',
          'Admin Review': 'bg-purple-50 text-purple-600',
          'Cancelled': 'bg-red-50 text-red-500',
        };
        const statusMap: Record<string, string> = {
          'Delivered': 'status_delivered',
          'Received': 'status_received',
          'In Transit': 'status_in_transit',
          'Shipping': 'status_shipping',
          'Processing': 'status_processing',
          'Awaiting Payment': 'status_awaiting_payment',
          'Admin Review': 'status_admin_review',
          'Cancelled': 'status_cancelled',
          'Draft': 'status_draft'
        };
        return (
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[o.status] || 'bg-slate-50 text-slate-400'}`}>
            {t(statusMap[o.status] || o.status)}
          </span>
        );
      }
    },
    {
      header: t('actions'),
      accessor: (o: MedicalOrder) => (
        <div className="flex items-center gap-2">
          {o.status === 'Admin Review' && (
            <button 
              onClick={() => {
                const updated = orders.map(ord => ord.id === o.id ? { ...ord, status: 'Processing' as any } : ord);
                setOrders(updated);
                LocalStorageManager.save(MELENT_KEYS.ORDERS, updated);
              }}
              className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-all flex items-center gap-2"
              title={t('approve')}
            >
              <Check size={14} />
              <span className="text-[10px] font-black uppercase">{t('approve')}</span>
            </button>
          )}
          {o.status === 'Processing' && (
            <button 
              onClick={() => {
                const updated = orders.map(ord => ord.id === o.id ? { ...ord, status: 'Shipping' as any } : ord);
                setOrders(updated);
                LocalStorageManager.save(MELENT_KEYS.ORDERS, updated);
              }}
              className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-600 hover:text-white transition-all flex items-center gap-2"
              title={t('prepare')}
            >
              <Check size={14} />
              <span className="text-[10px] font-black uppercase">{t('prepare')}</span>
            </button>
          )}
          {o.status === 'Shipping' && (
            <button 
              onClick={() => {
                const updated = orders.map(ord => ord.id === o.id ? { ...ord, status: 'In Transit' as any } : ord);
                setOrders(updated);
                LocalStorageManager.save(MELENT_KEYS.ORDERS, updated);
              }}
              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
              title={t('ship')}
            >
              <Truck size={14} />
              <span className="text-[10px] font-black uppercase">{t('ship')}</span>
            </button>
          )}
          {o.status === 'In Transit' && (
            <button 
              onClick={() => {
                const updated = orders.map(ord => ord.id === o.id ? { ...ord, status: 'Received' as any } : ord);
                setOrders(updated);
                LocalStorageManager.save(MELENT_KEYS.ORDERS, updated);
              }}
              className="p-2 bg-brand-green/10 text-brand-green rounded-lg hover:bg-brand-green hover:text-white transition-all flex items-center gap-2"
              title={t('receive')}
            >
              <MapPin size={14} />
              <span className="text-[10px] font-black uppercase">{t('receive')}</span>
            </button>
          )}
          <button 
            onClick={() => onViewInvoice?.(o)}
            className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-brand-navy"
            title={t('print_invoice')}
          >
            <Printer size={14} />
          </button>
          <button 
            onClick={() => onEditOrder?.(o)}
            className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-brand-navy"
            title={t('edit')}
          >
            <Edit2 size={14} />
          </button>
          <button 
            onClick={() => handleDelete(o.id, o.clientName)}
            className="p-2 bg-red-50 text-red-300 rounded-lg hover:text-red-600"
            title={t('delete')}
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h2 className="text-2xl font-black text-brand-navy tracking-tighter uppercase">{t('orders')}</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage individual orders and corporate contracts</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white border border-slate-100 p-1 rounded-2xl flex gap-1 shadow-sm overflow-x-auto">
            {[
              { id: 'All', label: language === 'ar' ? 'الكل' : language === 'tr' ? 'Hepsi' : 'All', icon: Layers },
              { id: 'Individual', label: language === 'ar' ? 'أفراد' : language === 'tr' ? 'Bireysel' : 'Individual', icon: User },
              { id: 'Corporate', label: language === 'ar' ? 'شركات' : language === 'tr' ? 'Kurumsal' : 'Corporate', icon: Building2 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTypeFilter(tab.id as any)}
                className={`flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl text-[9px] md:text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${
                  typeFilter === tab.id ? 'bg-brand-navy text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          <button 
            onClick={handleExport}
            className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-brand-navy transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-sm"
          >
            <FileDown size={16} />
            {t('export')}
          </button>

          <button 
            onClick={onAddOrder}
            className="p-3 bg-brand-navy text-brand-cyan rounded-2xl hover:bg-brand-green hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-navy/10"
          >
            <Plus size={16} />
            {t('add_new')}
          </button>
        </div>
      </div>

      <DataTable 
        data={filteredOrders} 
        columns={columns} 
        title={t('orders')} 
        icon={<ShoppingCart size={24} />} 
      />
    </div>
  );
};
