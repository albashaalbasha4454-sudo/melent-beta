import React, { useState, useEffect } from 'react';
import { 
  X, User, MapPin, Calendar, Activity, 
  FileText, Globe, Phone, Mail, Award, 
  Hospital, Stethoscope, Hotel, Plane, 
  ShieldCheck, FileDown, Plus, ExternalLink,
  ChevronRight, ClipboardList, CreditCard, Trash2,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Patient, MedicalProgram, PartnerHospital, Doctor, Hotel as HotelType } from '../../types';
import { LocalStorageManager, MELENT_KEYS } from '../../services/localStorageManager';
import { generateMedicalSummaryPDF } from '../../services/pdfService';
import { translations as allTranslations } from '../../translations';

import { useLanguage } from '../../hooks/useLanguage';

interface QuickNote {
  id: string;
  text: string;
  timestamp: string;
}

interface PatientProfileProps {
  patient: Patient;
  onClose: () => void;
  hospital?: PartnerHospital;
  program?: MedicalProgram;
  doctor?: Doctor;
  hotel?: HotelType;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({ 
  patient, 
  onClose,
  hospital,
  program,
  doctor,
  hotel
}) => {
  const { t, isRTL, language } = useLanguage();
  const [quickNotes, setQuickNotes] = useState<QuickNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await generateMedicalSummaryPDF(
        patient,
        hospital,
        doctor,
        program,
        hotel,
        allTranslations[language as 'en' | 'tr' | 'ar'],
        isRTL
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  // Load notes
  useEffect(() => {
    const allNotes = LocalStorageManager.get(MELENT_KEYS.PATIENT_QUICK_NOTES) || {};
    setQuickNotes(allNotes[patient.id] || []);
  }, [patient.id]);

  // Save notes helper
  const saveNotes = (updatedNotes: QuickNote[]) => {
    const allNotes = LocalStorageManager.get(MELENT_KEYS.PATIENT_QUICK_NOTES) || {};
    allNotes[patient.id] = updatedNotes;
    LocalStorageManager.save(MELENT_KEYS.PATIENT_QUICK_NOTES, allNotes);
    setQuickNotes(updatedNotes);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const note: QuickNote = {
      id: Math.random().toString(36).substr(2, 9),
      text: newNote,
      timestamp: new Date().toISOString()
    };

    saveNotes([note, ...quickNotes]);
    setNewNote('');
  };

  const handleDeleteNote = (noteId: string) => {
    saveNotes(quickNotes.filter(n => n.id !== noteId));
  };

  const statusMap: Record<string, any> = {
    'Active': t('status_processing'),
    'Confirmed': t('status_confirmed'),
    'Inquiry': t('status_inquiry'),
    'Lead': t('status_lead'),
    'Discharged': t('status_discharged'),
    'Cancelled': t('status_cancelled')
  };

  const locale = isRTL ? 'ar-EG' : 'en-US';

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden"
    >
      {/* Profile Header */}
      <div className="bg-brand-navy p-10 text-white relative overflow-hidden">
        <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-64 h-64 bg-brand-cyan/10 rounded-full blur-3xl ${isRTL ? '-ml-20' : '-mr-20'} -mt-20`} />
        
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10 ${isRTL ? 'md:flex-row-reverse' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
          <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 flex items-center justify-center text-4xl font-black text-brand-cyan shadow-2xl shrink-0">
              {patient.name.charAt(0)}
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h2 className="text-3xl font-black tracking-tight">{patient.name}</h2>
                <span className="px-3 py-1 bg-brand-cyan/20 border border-brand-cyan/30 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-cyan whitespace-nowrap">
                  {statusMap[patient.status] || patient.status}
                </span>
              </div>
              <div className={`flex flex-wrap items-center gap-4 text-white/60 text-xs font-bold ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <MapPin size={14} className="text-brand-cyan" />
                  <span>{patient.country} / {patient.nationality || t('missing_data')}</span>
                </div>
                <div className={`flex items-center gap-1.5 border-white/10 ${isRTL ? 'border-l pl-4' : 'border-r pr-4'} ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <ShieldCheck size={14} className="text-brand-cyan" />
                  <span className="tabular-nums">{patient.id}</span>
                </div>
                <div className={`flex items-center gap-1.5 border-white/10 ${isRTL ? 'border-l pl-4' : 'border-r pr-4'} ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Calendar size={14} className="text-brand-cyan" />
                  <span>{t('last_update')}: <span className="tabular-nums">{new Date(patient.lastContact).toLocaleDateString(locale)}</span></span>
                </div>
              </div>
            </div>
          </div>

          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
             <button 
                onClick={handleExportPDF}
                disabled={isExporting}
                className="px-6 py-3 bg-brand-cyan text-brand-navy hover:bg-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl disabled:opacity-50 whitespace-nowrap"
             >
                <FileText size={16} className={isExporting ? 'animate-pulse' : ''} />
                {isExporting ? t('exporting') || 'Exporting...' : t('medical_summary')}
             </button>
             <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 border border-white/10 whitespace-nowrap">
                <FileDown size={16} />
                {t('export_dossier')}
             </button>
             <button onClick={onClose} className="w-12 h-12 bg-white text-brand-navy rounded-2xl flex items-center justify-center hover:bg-brand-cyan transition-all shadow-xl">
                <X size={20} />
             </button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-10" dir={isRTL ? 'rtl' : 'ltr'}>
        
        {/* Left Column: Logistics & Medical Matrix */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Section: Medical Matrix */}
          <section className="space-y-6">
            <div className={`flex items-center justify-between border-b border-slate-100 pb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 bg-brand-green/10 rounded-lg flex items-center justify-center text-brand-green">
                  <Stethoscope size={18} />
                </div>
                <h3 className="text-sm font-black text-brand-navy uppercase tracking-widest">{t('medical_matrix')}</h3>
              </div>
              <button className="text-[10px] font-black text-brand-cyan uppercase tracking-widest flex items-center gap-1">
                {t('edit_status')} <ChevronRight size={14} className={isRTL ? 'rotate-180' : ''} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className={`bg-slate-50 p-6 rounded-[2rem] border border-slate-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 leading-none">{t('treatment_status')}</p>
                  <p className="text-sm font-bold text-brand-navy leading-relaxed">{patient.condition}</p>
               </div>
               <div className={`bg-slate-50 p-6 rounded-[2rem] border border-slate-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 leading-none">{t('strategic_notes')}</p>
                  <p className="text-sm font-bold text-slate-500 leading-relaxed italic">{patient.notes || t('no_strategic_notes')}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {hospital && (
                 <div className={`p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-3 shadow-sm ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <Hospital className="text-red-500 shrink-0" size={20} />
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{t('assigned_hospital')}</p>
                      <p className="text-xs font-black text-brand-navy leading-none">{hospital.name}</p>
                    </div>
                 </div>
               )}
               {program && (
                 <div className={`p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-3 shadow-sm ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <Award className="text-brand-gold shrink-0" size={20} />
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{t('active_program')}</p>
                      <p className="text-xs font-black text-brand-navy leading-none">{program.name}</p>
                    </div>
                 </div>
               )}
               {doctor && (
                 <div className={`p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-3 shadow-sm ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <User className="text-purple-500 shrink-0" size={20} />
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{t('supervising_surgeon')}</p>
                      <p className="text-xs font-black text-brand-navy leading-none">{doctor.name}</p>
                    </div>
                 </div>
               )}
            </div>
          </section>

          {/* Section: Project Roadmap (Treatment Plan) */}
          <section className="space-y-6">
            <div className={`flex items-center gap-3 border-b border-slate-100 pb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 bg-brand-cyan/10 rounded-lg flex items-center justify-center text-brand-cyan">
                <ClipboardList size={18} />
              </div>
              <h3 className="text-sm font-black text-brand-navy uppercase tracking-widest">{t('project_roadmap')}</h3>
            </div>

            <div className="space-y-4">
               {[
                 { step: t('create_file'), status: 'Completed', label: t('step_completed'), date: '2024-05-20' },
                 { step: t('hospital_check_in'), status: 'Completed', label: t('step_completed'), date: '2024-05-22' },
                 { step: t('program_activation'), status: 'Completed', label: t('step_completed'), date: '2024-05-25' },
                 { step: t('flight_permits_clearance'), status: 'In Progress', label: t('step_in_progress'), date: 'TBA' },
                 { step: t('treatment_commencement'), status: 'Scheduled', label: t('step_scheduled'), date: '2024-06-12' },
               ].map((step, i) => (
                 <div key={i} className={`flex items-center gap-6 p-4 hover:bg-slate-50 rounded-2xl transition-all group ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-12 text-center">
                       {step.status === 'Completed' ? (
                         <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-green-500/20">
                            <Activity size={14} />
                         </div>
                       ) : step.status === 'In Progress' ? (
                         <div className="w-8 h-8 bg-brand-cyan rounded-full flex items-center justify-center text-white mx-auto animate-pulse">
                            <Plane size={14} />
                         </div>
                       ) : (
                         <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mx-auto">
                            {i+1}
                         </div>
                       )}
                    </div>
                    <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                       <p className={`text-sm font-black tracking-tight ${step.status === 'Completed' ? 'text-brand-navy' : 'text-slate-400'}`}>
                         {step.step}
                       </p>
                       <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">{step.label}</p>
                    </div>
                    <div className={`font-mono text-[10px] text-slate-400 tabular-nums ${isRTL ? 'text-right' : 'text-left'}`}>
                      {step.date}
                    </div>
                 </div>
               ))}
            </div>
          </section>
        </div>

        {/* Right Column: Dossier & Financials */}
        <div className="space-y-10">
          
          {/* Travel Dossier */}
          <section className={`bg-slate-50 p-8 rounded-[3rem] border border-slate-100 space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h4 className="text-[11px] font-black text-brand-navy uppercase tracking-[0.2em] mb-4 leading-none">{t('travel_dossier')}</h4>
            
            <div className="space-y-4">
               <div className={`bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Plane className="text-brand-cyan shrink-0" size={18} />
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{t('pnr_code')}</p>
                      <p className="text-xs font-black text-brand-navy uppercase tracking-widest leading-none tabular-nums">TK-X9248</p>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-slate-300" />
               </div>

               <div className={`bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Hotel className="text-amber-500 shrink-0" size={18} />
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{t('hotel_room')}</p>
                      <p className="text-xs font-black text-brand-navy leading-none">{hotel?.name || t('pending_clearance')}</p>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-slate-300" />
               </div>

               <div className={`bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <FileText className="text-slate-400 shrink-0" size={18} />
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{t('passport_scan')}</p>
                      <p className="text-xs font-black text-brand-navy leading-none tabular-nums">{patient.passportNumber || t('missing_data')}</p>
                    </div>
                  </div>
                  <button className="text-brand-cyan hover:text-brand-navy transition-colors">
                    <FileDown size={14} />
                  </button>
               </div>
            </div>

            <button className={`w-full py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-brand-navy uppercase tracking-widest hover:bg-brand-navy hover:text-white transition-all flex items-center justify-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Plus size={14} />
              {t('add_attachment')}
            </button>
          </section>

          <section className={`bg-slate-50 p-8 rounded-[3rem] border border-slate-100 space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h4 className="text-[11px] font-black text-brand-navy uppercase tracking-[0.2em]">{t('quick_reminders')}</h4>
              <div className="w-7 h-7 bg-brand-cyan/20 rounded-full flex items-center justify-center text-brand-cyan">
                <FileText size={14} />
              </div>
            </div>

            <form onSubmit={handleAddNote} className="relative">
              <input 
                type="text" 
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder={t('add_note_placeholder')}
                className={`w-full bg-white border border-slate-200 rounded-2xl p-4 ${isRTL ? 'pr-4 pl-12' : 'pl-4 pr-12'} text-xs font-bold outline-none focus:border-brand-cyan transition-all`}
              />
              <button 
                type="submit"
                className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-navy text-white rounded-xl flex items-center justify-center hover:bg-brand-cyan transition-all`}
              >
                <Plus size={16} />
              </button>
            </form>

            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {quickNotes.map((note) => (
                  <motion.div 
                    key={note.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative"
                  >
                    <button 
                      onClick={() => handleDeleteNote(note.id)}
                      className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'} p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all`}
                    >
                      <Trash2 size={12} />
                    </button>
                    <p className={`text-[11px] font-bold text-brand-navy leading-relaxed mb-2 ${isRTL ? 'pr-4 pl-1' : 'pl-4 pr-1'}`}>
                      {note.text}
                    </p>
                    <div className={`flex items-center gap-1.5 text-[8px] font-black text-slate-300 uppercase tracking-widest ${isRTL ? 'justify-start' : 'justify-end'}`}>
                       <Clock size={10} />
                       <span className="tabular-nums" dir="ltr">{new Date(note.timestamp).toLocaleString(locale)}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {quickNotes.length === 0 && (
                <div className="py-6 text-center">
                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">{t('no_current_reminders') || 'No current reminders'}</p>
                </div>
              )}
            </div>
          </section>

          {/* Financial Posture */}
          <section className={`bg-brand-navy/5 p-8 rounded-[3rem] border border-blue-100/30 space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h4 className="text-[11px] font-black text-brand-navy uppercase tracking-[0.2em]">{t('financial_flow_title')}</h4>
              <CreditCard size={18} className="text-brand-navy opacity-20" />
            </div>

            <div className="space-y-4">
               <div className={`flex justify-between items-center text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                 <span className="font-bold text-slate-500">{t('program_value')}</span>
                 <span className="font-black text-brand-navy tabular-nums">$12,400.00</span>
               </div>
               <div className={`flex justify-between items-center text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                 <span className="font-bold text-slate-500">{t('total_logistics')}</span>
                 <span className="font-black text-brand-navy tabular-nums">$3,150.00</span>
               </div>
               <div className="h-px bg-slate-200" />
               <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('grand_total')}</span>
                 <span className="text-xl font-black text-brand-navy tabular-nums">$15,550.00</span>
               </div>
            </div>

            <div className={`grid grid-cols-2 gap-3 mt-4 ${isRTL ? 'rtl' : ''}`}>
               <div className="bg-brand-green/10 p-3 rounded-xl border border-brand-green/20 text-center">
                 <p className="text-[9px] font-black text-brand-green uppercase mb-0.5 leading-none">{t('paid_so_far')}</p>
                 <p className="text-sm font-black text-brand-green tabular-nums leading-none mt-1">$5,000</p>
               </div>
               <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-center">
                 <p className="text-[9px] font-black text-red-500 uppercase mb-0.5 leading-none">{t('remaining_balance')}</p>
                 <p className="text-sm font-black text-red-500 tabular-nums leading-none mt-1">$10,550</p>
               </div>
            </div>
          </section>

          {/* Rapid Actions */}
          <div className="grid grid-cols-1 gap-4">
             <button className="bg-brand-navy text-white py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-brand-navy/20 hover:bg-brand-green transition-all transform hover:-translate-y-1">
               {t('issue_new_invoice')}
             </button>
             <button className={`bg-white border-2 border-brand-navy/10 text-brand-navy py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
               <Mail size={16} />
               {t('send_email_patient')}
             </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
