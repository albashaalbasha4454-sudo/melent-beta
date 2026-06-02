import React, { useState, useEffect } from 'react';
import { FileText, FileCheck, Clock, Download, Plus, XCircle, Trash2 } from 'lucide-react';
import { DataTable } from '../DataTable';
import { useData } from '../../hooks/useData';

export const ContractSection: React.FC = () => {
  const { orders, setOrders, deleteOrder, syncInventory } = useData();

  // Deriving contracts from orders for demo
  const contracts = orders.map((o: any) => ({
    id: `CON-${o.id}`,
    orderId: o.id,
    client: o.clientName,
    date: o.date,
    status: o.status === 'Cancelled' ? 'Cancelled' : o.status === 'Delivered' ? 'Active' : 'Draft',
    value: o.financials?.total || 0,
    clientName: o.clientName
  }));

  const handleCancelContract = (orderId: string) => {
    if (confirm('هل أنت متأكد من إلغاء هذا العقد؟ سيتم إلغاء الطلب المرتبط به تلقائياً.')) {
      const updated = orders.map(ord => ord.id === orderId ? { ...ord, status: 'Cancelled' as any } : ord);
      setOrders(updated);
      syncInventory();
    }
  };

  const handleDeleteContract = (orderId: string, clientName: string) => {
    if (confirm(`هل أنت متأكد من حذف وأرشفة العقد الخاص بـ ${clientName}؟`)) {
      deleteOrder(orderId);
      syncInventory();
    }
  };

  const handleDownload = (c: any) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(c, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `contract_${c.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const columns = [
    { header: 'كود العقد', accessor: (c: any) => <span className="font-mono text-[10px] font-black">{c.id}</span> },
    { header: 'الجهة/العميل', accessor: (c: any) => c.client },
    { header: 'تاريخ الإبرام', accessor: (c: any) => new Date(c.date).toLocaleDateString('ar-EG') },
    { header: 'الحالة', accessor: (c: any) => (
      <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${
        c.status === 'Active' ? 'bg-green-50 text-green-500' : 
        c.status === 'Cancelled' ? 'bg-red-50 text-red-500' :
        'bg-slate-50 text-slate-400'
      }`}>
        {c.status === 'Active' ? 'ساري' : c.status === 'Cancelled' ? 'ملغى' : 'مسودة'}
      </span>
    )},
    { header: 'الإجراءات', accessor: (c: any) => (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => handleDownload(c)}
          className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-brand-navy"
          title="تحميل العقد"
        >
          <Download size={14} />
        </button>
        {c.status !== 'Cancelled' && (
          <button 
            onClick={() => handleCancelContract(c.orderId)}
            className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
            title="إلغاء العقد"
          >
            <XCircle size={14} />
          </button>
        )}
        <button 
          onClick={() => handleDeleteContract(c.orderId, c.clientName)}
          className="p-2 bg-slate-50 text-slate-300 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all"
          title="حذف نهائي"
        >
          <Trash2 size={14} />
        </button>
      </div>
    )}
  ];

  const handleAddContract = () => {
    alert('بدأ إنشاء عقد قانوني جديد. سيتم توجيهك لنظام صياغة العقود...');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-brand-navy tracking-tighter uppercase">توثيق العقود والاتفاقيات</h2>
          <p className="text-[10px] font-black text-brand-green uppercase tracking-[0.3em] mt-1">مركز الأرشفة القانونية وإدارة الامتثال</p>
        </div>
        <button 
          onClick={handleAddContract}
          className="bg-brand-navy text-white px-6 py-3 rounded-2xl flex items-center gap-3 font-bold text-sm shadow-xl shadow-brand-navy/10 hover:bg-brand-green transition-all"
        >
          <Plus size={18} className="text-brand-cyan" />
          عقد جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 text-right" dir="rtl">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-6">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
            <FileCheck size={28} />
          </div>
          <div>
            <h4 className="font-black text-brand-navy">عقود سارية</h4>
            <p className="text-xs font-bold text-slate-400">{contracts.filter(c => c.status === 'Active').length} اتفاقية مفعلة</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-6">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
            <Clock size={28} />
          </div>
          <div>
            <h4 className="font-black text-brand-navy">قيد المراجعة</h4>
            <p className="text-xs font-bold text-slate-400">{contracts.filter(c => c.status === 'Draft').length} مسودة عمل</p>
          </div>
        </div>
      </div>

      <DataTable 
        data={contracts} 
        columns={columns} 
        title="أرشيف العقود" 
        icon={<FileText size={24} />} 
      />
    </div>
  );
};
