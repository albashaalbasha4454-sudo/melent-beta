import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Patient, PartnerHospital, MedicalProgram, Doctor, Hotel } from '../types';

export const generateMedicalSummaryPDF = async (
  patient: Patient,
  hospital?: PartnerHospital,
  doctor?: Doctor,
  program?: MedicalProgram,
  hotel?: Hotel,
  translations?: Record<string, string>,
  isRTL: boolean = false
) => {
  // Create a temporary container for the report
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.background = '#fff';
  container.style.padding = '40px';
  container.style.fontFamily = isRTL ? 'Arial, sans-serif' : 'Inter, sans-serif';
  container.dir = isRTL ? 'rtl' : 'ltr';

  const t = (key: string) => translations?.[key] || key;

  container.innerHTML = `
    <div style="border: 2px solid #0f172a; padding: 30px; border-radius: 10px;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 30px;">
        <div style="${isRTL ? 'text-right' : 'text-left'}">
          <h1 style="font-size: 28px; font-weight: 900; color: #0f172a; margin: 0; text-transform: uppercase; letter-spacing: -0.025em;">MELENT CARE</h1>
          <p style="font-size: 10px; font-weight: 800; color: #94a3b8; margin: 5px 0 0; text-transform: uppercase; letter-spacing: 0.4em;">Global Medical Operations</p>
        </div>
        <div style="text-align: ${isRTL ? 'left' : 'right'}">
          <h2 style="font-size: 18px; font-weight: 900; color: #0f172a; margin: 0; text-transform: uppercase;">${t('medical_summary')}</h2>
          <p style="font-size: 12px; font-weight: 600; color: #64748b; margin: 5px 0 0;">ID: ${patient.id}</p>
          <p style="font-size: 12px; font-weight: 600; color: #64748b; margin: 2px 0 0;">${new Date().toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</p>
        </div>
      </div>

      <!-- Patient Info -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px;">
        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #f1f5f9;">
          <h3 style="font-size: 12px; font-weight: 900; color: #0f172a; margin: 0 0 15px; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">${t('patient_data')}</h3>
          <p style="font-size: 14px; margin: 8px 0;"><strong style="color: #64748b;">${t('full_name')}:</strong> ${patient.name}</p>
          <p style="font-size: 14px; margin: 8px 0;"><strong style="color: #64748b;">${t('nationality')}:</strong> ${patient.nationality || patient.country}</p>
          <p style="font-size: 14px; margin: 8px 0;"><strong style="color: #64748b;">${t('passport_number')}:</strong> ${patient.passportNumber || 'N/A'}</p>
          <p style="font-size: 14px; margin: 8px 0;"><strong style="color: #64748b;">${t('age_gender')}:</strong> ${patient.age} / ${patient.gender}</p>
        </div>
        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #f1f5f9;">
          <h3 style="font-size: 12px; font-weight: 900; color: #0f172a; margin: 0 0 15px; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">${t('medical_matrix')}</h3>
          <p style="font-size: 14px; margin: 8px 0;"><strong style="color: #64748b;">${t('status')}:</strong> ${patient.status}</p>
          <p style="font-size: 14px; margin: 8px 0;"><strong style="color: #64748b;">${t('assigned_hospital')}:</strong> ${hospital?.name || 'N/A'}</p>
          <p style="font-size: 14px; margin: 8px 0;"><strong style="color: #64748b;">${t('supervising_surgeon')}:</strong> ${doctor?.name || 'N/A'}</p>
          <p style="font-size: 14px; margin: 8px 0;"><strong style="color: #64748b;">${t('program')}:</strong> ${program?.name || 'N/A'}</p>
        </div>
      </div>

      <!-- Clinical Snapshot -->
      <div style="margin-bottom: 40px;">
        <h3 style="font-size: 14px; font-weight: 900; color: #0f172a; margin: 0 0 15px; text-transform: uppercase; letter-spacing: 0.1em; display: flex; align-items: center; gap: 8px;">
          <span style="width: 4px; height: 16px; background: #0ea5e9; border-radius: 2px;"></span>
          ${t('condition_and_notes')}
        </h3>
        <div style="background: #fff; border: 1px solid #f1f5f9; padding: 20px; border-radius: 12px; line-height: 1.6; color: #334155; font-size: 14px;">
          <p style="margin-top: 0;"><strong>${t('diagnosis')}:</strong></p>
          <p style="margin-bottom: 20px;">${patient.condition}</p>
          <p><strong>${t('operational_notes')}:</strong></p>
          <p style="margin-bottom: 0;">${patient.notes || t('no_strategic_notes')}</p>
        </div>
      </div>

      <!-- Logistics Summary -->
      <div style="margin-bottom: 40px;">
        <h3 style="font-size: 14px; font-weight: 900; color: #0f172a; margin: 0 0 15px; text-transform: uppercase; letter-spacing: 0.1em; display: flex; align-items: center; gap: 8px;">
          <span style="width: 4px; height: 16px; background: #f59e0b; border-radius: 2px;"></span>
          ${t('logistics_roadmap')}
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="padding: 15px; border-left: 3px solid #f1f5f9; background: #fcfcfc;">
            <p style="font-size: 11px; font-weight: 900; color: #94a3b8; margin: 0 0 5px; text-transform: uppercase;">${t('accommodation')}</p>
            <p style="font-size: 14px; font-weight: 700; margin: 0; color: #0f172a;">${hotel?.name || 'TBA'}</p>
            <p style="font-size: 12px; color: #64748b; margin: 2px 0 0;">${hotel?.location || ''}</p>
          </div>
          <div style="padding: 15px; border-left: 3px solid #f1f5f9; background: #fcfcfc;">
            <p style="font-size: 11px; font-weight: 900; color: #94a3b8; margin: 0 0 5px; text-transform: uppercase;">${t('duration')}</p>
            <p style="font-size: 14px; font-weight: 700; margin: 0; color: #0f172a;">${program?.durationDays || patient.treatmentPlan?.steps.length || 0} ${t('days')}</p>
            <p style="font-size: 12px; color: #64748b; margin: 2px 0 0;">Estimated clinical roadmap</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top: 60px; border-top: 1px solid #f1f5f9; padding-top: 20px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <p style="font-size: 10px; color: #94a3b8; margin: 0;">MELENT CARE - Strategic Medical Logistics</p>
          <p style="font-size: 10px; color: #94a3b8; margin: 2px 0 0;">Turkey | Global Operations</p>
        </div>
        <div style="text-align: right;">
          <div style="width: 100px; height: 1px; background: #64748b; margin-bottom: 8px; margin-left: auto;"></div>
          <p style="font-size: 10px; font-weight: 900; color: #0f172a; margin: 0; text-transform: uppercase;">Authorized Ops Signature</p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width / 2, canvas.height / 2]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
    pdf.save(`Medical_Summary_${patient.name.replace(/\s+/g, '_')}_${patient.id}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    document.body.removeChild(container);
  }
};

export const generateProfitAnalysisPDF = async (
  elementId: string,
  title: string,
  isRTL: boolean = false
) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 190; // A4 width minus margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Header
    pdf.setFillColor(0, 35, 75); // Brand Navy
    pdf.rect(0, 0, 210, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(24);
    pdf.text('MELENT CARE', 10, 20);
    
    pdf.setFontSize(10);
    pdf.text('GLOBAL MEDICAL OPERATIONS - PROFIT ANALYSIS REPORT', 10, 30);
    
    pdf.setFontSize(8);
    pdf.text(`Date: ${new Date().toLocaleString()}`, 10, 35);

    // Main Content
    pdf.addImage(imgData, 'PNG', 10, 50, imgWidth, imgHeight);

    pdf.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error generating Profit PDF:', error);
  }
};
