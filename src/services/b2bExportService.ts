import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { B2BDeal, B2BCompany } from '../types';

// Extend jsPDF with autotable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export const exportDealsToExcel = (deals: B2BDeal[], companies: B2BCompany[]) => {
  const data = deals.map(deal => {
    const company = companies.find(c => c.id === deal.companyId);
    return {
      'Deal ID': deal.id,
      'Company': deal.companyName,
      'Country': company?.country || 'N/A',
      'Product': deal.productName || 'General',
      'Stage': deal.stage,
      'Priority': deal.priority,
      'Value (USD)': deal.quotation.valueUSD || 0,
      'Payment Terms': deal.commercial.paymentTerms,
      'Created At': new Date(deal.createdAt).toLocaleDateString(),
      'Status': deal.closure?.isClosed ? `Closed (${deal.closure.outcome})` : 'Active'
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "B2B Deals");
  
  XLSX.writeFile(wb, `Melent_B2B_Deals_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportCompaniesToExcel = (companies: B2BCompany[]) => {
  const data = companies.map(c => ({
    'ID': c.id,
    'Name': c.name,
    'Country': c.country,
    'City': c.city || 'N/A',
    'Contact': c.contactPerson,
    'Phone': c.phone,
    'Email': c.email,
    'Source': c.source,
    'Type': c.qualification.type,
    'Interests': c.qualification.interestedCategories.join(', '),
    'Created': new Date(c.createdAt).toLocaleDateString()
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Companies");
  XLSX.writeFile(wb, `Melent_Companies_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportDealsToPDF = (deals: B2BDeal[], companies: B2BCompany[]) => {
  const doc = new jsPDF() as jsPDFWithAutoTable;
  
  // Header
  doc.setFillColor(0, 35, 75); // Brand Navy
  doc.rect(0, 0, 210, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('MELENT CARE - B2B DEALS REPORT', 15, 20);
  
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 150, 20);
  
  // Stats
  const totalValue = deals.reduce((acc, d) => acc + (d.quotation.valueUSD || 0), 0);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text(`Total Active Opportunity Value: $${totalValue.toLocaleString()}`, 15, 45);
  doc.text(`Total Records: ${deals.length}`, 150, 45);

  const tableData = deals.map(deal => {
    const company = companies.find(c => c.id === deal.companyId);
    return [
      deal.id,
      deal.companyName,
      company?.country || 'N/A',
      deal.stage,
      deal.priority,
      `$${(deal.quotation.valueUSD || 0).toLocaleString()}`
    ];
  });

  doc.autoTable({
    startY: 55,
    head: [['ID', 'Company', 'Country', 'Stage', 'Priority', 'Value']],
    body: tableData,
    headStyles: { fillColor: [0, 35, 75], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    margin: { top: 55 },
    styles: { fontSize: 8, font: 'helvetica' }
  });

  doc.save(`Melent_B2B_Deals_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportCompaniesToPDF = (companies: B2BCompany[]) => {
  const doc = new jsPDF() as jsPDFWithAutoTable;
  doc.setFillColor(0, 35, 75);
  doc.rect(0, 0, 210, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('MELENT CARE - COMPANY DIRECTORY', 15, 20);
  
  const tableData = companies.map(c => [
    c.id, c.name, c.country, c.contactPerson, c.qualification.type
  ]);

  doc.autoTable({
    startY: 40,
    head: [['ID', 'Name', 'Country', 'Contact', 'Type']],
    body: tableData,
    headStyles: { fillColor: [0, 35, 75], textColor: [255, 255, 255] },
    styles: { fontSize: 8 }
  });

  doc.save(`Melent_Companies_${new Date().toISOString().split('T')[0]}.pdf`);
};
