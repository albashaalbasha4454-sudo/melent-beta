export type UserRole = 'travel' | 'admin' | null;

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export type ClientType = 'Individual' | 'Company' | 'Hospital' | 'Clinic' | 'Distributor' | 'Supplier';

// --- Travel Department Types ---
export type PatientStatus = 'Inquiry' | 'Lead' | 'Confirmed' | 'Active' | 'Discharged' | 'Cancelled' | 'Archived';

export interface MedicalProgram {
  id: string;
  name: string;
  category: string; // e.g., Dental, Cardiac, Cosmetic
  durationDays: number;
  duration?: string; // e.g., "10 Days"
  basePrice: number;
  hospitals: string[]; // Hospital IDs
  doctors: string[]; // Doctor IDs
  description: string;
  includedServices: string[];
  excludedServices: string[];
  imageUrl?: string;
  contractDetails?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospitalId: string;
  experienceYears: number;
  rating: number;
  bio: string;
  education?: string;
  availability: string;
  contact: string;
  languages: string[];
  photo?: string;
}

export interface Hotel {
  id: string;
  name: string;
  stars: number;
  location: string;
  roomTypes: string[];
  basePricePerNight: number;
  pricePerNight?: number;
  contractStatus: 'Active' | 'Negotiating' | 'Expired';
  amenities: string[];
  contact: string;
  reservationHistory?: string[];
}

export interface FlightReservation {
  id: string;
  patientId: string;
  patientName: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureCity?: string;
  arrivalCity?: string;
  departureTime: string;
  arrivalTime: string;
  departureDate?: string;
  pnr: string;
  pnrStatus?: string;
  status: 'Booked' | 'Confirmed' | 'Delayed' | 'Cancelled';
  ticketUrl?: string;
}

export interface TransferService {
  id: string;
  patientId: string;
  patientName: string;
  type: 'Airport-Hotel' | 'Hotel-Hospital' | 'VIP' | 'Group';
  vehicleType: string;
  driverName: string;
  driverPhone: string;
  plateNumber: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  date?: string;
  time?: string;
  pickupTime: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
}

export interface Patient {
  id: string;
  name: string;
  country: string;
  nationality?: string;
  passportNumber?: string;
  passportExpiry?: string;
  birthDate?: string;
  email?: string;
  phone?: string;
  age: number;
  gender: string;
  condition: string;
  status: PatientStatus;
  lastContact: string;
  leadSource?: string;
  assignedAgent?: string;
  
  // Assigned entities
  assignedHospitalId?: string;
  assignedDoctorId?: string;
  assignedProgramId?: string;
  assignedHotelId?: string;
  
  // Medical Details
  treatmentPlan?: {
    overview: string;
    steps: string[];
    startDate?: string;
    endDate?: string;
  };
  clinicalFindings?: string;
  
  // Logistics
  reservations?: {
    flights: string[];
    hotels: string[];
    transfers: string[];
  };
  
  invoices?: string[];
  files?: string[];
  auditLog?: {
    action: string;
    timestamp: string;
    user: string;
  }[];
  notes: string;
}

export interface PartnerHospital {
  id: string;
  name: string;
  location: string;
  address?: string;
  specialties: string[];
  rating: number;
  contactPerson: string;
  contactEmail?: string;
  contactPhone?: string;
  contractStatus: 'Pending' | 'Active' | 'Expired';
  commissionRate?: number;
  stats?: {
    totalPatients: number;
    activeReferrals: number;
    successRate: number;
  };
}

export interface ExportRecord {
  id: string;
  date: string;
  status: string;
}

export interface TravelInvoice {
  id: string;
  patientId: string;
  totalAmount: number;
  paidAmount: number;
  date: string;
  status: 'Paid' | 'Partially Paid' | 'Unpaid' | 'Overdue';
}

export type TravelView = 'dashboard' | 'patients' | 'programs' | 'hospitals' | 'doctors' | 'hotels' | 'reservations' | 'flights' | 'transfers' | 'finance' | 'reports';

// --- Admin Department Types ---
export interface Client {
  id: string;
  name: string;
  type: ClientType;
  location: string;
  contactPerson: string;
  phone: string;
  email?: string;
}

export type OrderStatus = 'Draft' | 'Awaiting Payment' | 'Paid' | 'Processing' | 'Shipping' | 'In Transit' | 'Received' | 'Delivered' | 'Completed' | 'Cancelled' | 'Rejected' | 'Admin Review';
export type OrderCategory = 'Medical Supply' | 'Medical Tourism' | 'Treatment Coordination' | 'Health Products' | 'B2B Partnership' | 'Individual Request' | 'Distributor Request' | 'Hospital Request';
export type DeliveryMethod = 'Office Pickup' | 'Local Turkey' | 'Internal Client Country' | 'International Shipping' | 'Air Freight' | 'Sea Freight' | 'Express Shipping' | 'Customer Arranged';
export type PaymentMethod = 'Bank Transfer' | 'Cash' | 'Credit Card' | 'Downpayment + Delivery' | 'Cash on Delivery' | 'International Wire' | 'Other';
export type Currency = 'USD' | 'TRY' | 'EUR' | 'SAR' | 'Other';
export type PaymentStatus = 'Awaiting Verification' | 'Verified' | 'Rejected';

export interface ShippingInfo {
  destinationCountry?: string;
  destinationCity?: string;
  method: DeliveryMethod;
  carrier?: string;
  trackingNumber?: string;
  shippingCost: number;
  paidBy: 'Client' | 'MELENT CARE' | 'Split';
  localDeliveryFee?: number;
  localCarrier?: string;
  expectedDeliveryDate?: string;
}

export interface BankPaymentDetails {
  bankName?: string;
  accountHolder?: string;
  iban?: string;
  transactionId?: string;
  date?: string;
  status: PaymentStatus;
}

export interface Financials {
  subtotal: number;
  localDeliveryFee: number;
  intlShippingFee: number;
  customsFee: number;
  serviceFee: number;
  discount: number;
  tax: number;
  total: number;
  currency: Currency;
}

export interface OrderItem {
  productId: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  total: number;
  availability: 'Available' | 'Needs Order' | 'Out of Stock';
  expectedDelivery?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number; // Selling Price
  purchasePrice?: number; // Internal Cost
  stock: number;
  isBookable?: boolean;
}

export interface MedicalOrder {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientCountry: string;
  clientCity: string;
  clientAddress: string;
  clientType: ClientType;
  identityNumber?: string;
  
  items: OrderItem[];
  financials: Financials;
  shipping: ShippingInfo;
  payment: {
    method: PaymentMethod;
    bank?: BankPaymentDetails;
  };
  
  status: OrderStatus;
  category: OrderCategory;
  date: string;
  
  executionLocation: 'Turkey' | 'International' | 'Multi-location';
  
  notes: {
    internal: string;
    external: string;
    paymentTerms: string;
    deliveryTerms: string;
    returnPolicy: string;
  };
  attachments: string[];
}

export interface Expense {
  id: string;
  category: 'Logistics' | 'Procurement' | 'Salaries' | 'Marketing' | 'Other';
  amount: number;
  currency: Currency;
  description: string;
  date: string;
}

export interface Revenue {
  id: string;
  orderId: string;
  amount: number;
  paymentMethod: 'Transfer' | 'Cash' | 'Card';
  date: string;
}

export interface AdminDashboardProps {
  onLogout: () => void;
}

export type View = 'dashboard' | 'clients' | 'inventory' | 'orders' | 'expenses' | 'reports' | 'b2b';

// --- B2B Business Development & Deal Management Types ---

export type B2BLanguage = 'Arabic' | 'English' | 'Turkish';
export type B2BCompanyType = 'Distributor' | 'Hospital' | 'Pharmacy' | 'Clinic' | 'Government' | 'Other';
export type B2BInterestCategory = 
  | 'Dermocosmetics' 
  | 'Cosmetics' 
  | 'Supplements' 
  | 'Medical Devices' 
  | 'Laboratory' 
  | 'Consumables' 
  | 'Medical Aesthetic Devices'
  | 'Medical & Healthcare Devices'
  | 'Disposable Medical Products'
  | 'General Medical Supplies'
  | 'Industrial & Skincare Cooperation'
  | 'Private Label Products'
  | 'Nutraceuticals'
  | 'Supplements & Nutrition';
export type B2BExpectedDemand = 'Small' | 'Medium' | 'Large';
export type B2BSource = 'LinkedIn' | 'Email' | 'Exhibition' | 'Referral' | 'Other';

export interface B2BCompany {
  id: string; // Company Code
  name: string;
  country: string;
  city?: string;
  contactPerson: string;
  phone: string;
  email: string;
  source: B2BSource;
  language: B2BLanguage;
  qualification: {
    type: B2BCompanyType;
    interestedCategories: B2BInterestCategory[];
    targetProducts: string;
    expectedDemand: B2BExpectedDemand;
  };
  isPublicLead?: boolean;
  createdAt: string;
}

export type B2BDealStage = 'New Lead' | 'Qualified' | 'Opportunity' | 'Proposal Sent' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
export type B2BMarketPositioning = 'Premium' | 'Mid-range';
export type B2BPriority = 'High' | 'Medium' | 'Low';

export interface B2BProductB2B {
  id: string; // Product Code
  name: string;
  type: string;
  category: B2BInterestCategory;
  marketPositioning: B2BMarketPositioning;
}

export type B2BPaymentTermsType = 'Advance Payment 100%' | '50% Advance + 50% on Delivery' | 'LC' | 'Promissory Note / Bank Guarantee' | 'Custom';

export interface B2BDeal {
  id: string; // Deal Code: MC-DEAL-COUNTRY-001
  companyId: string;
  companyName: string;
  productId?: string;
  productName?: string;
  priority: B2BPriority;
  stage: B2BDealStage;
  quotation: {
    sent: boolean;
    date?: string;
    valueUSD?: number;
    filePath?: string;
  };
  commercial: {
    paymentTerms: B2BPaymentTermsType;
    paymentDetails: string;
    paymentApproved: boolean;
  };
  documents: {
    quotationFile?: string;
    agreementFile?: string;
    supplierOfferFile?: string;
    clientRFQFile?: string;
    relatedDocs: string[];
  };
  closure?: {
    isClosed: boolean;
    outcome?: 'Won' | 'Lost';
    reason?: string;
    closedAt?: string;
    notes?: string;
  };
  createdAt: string;
}

export type B2BCommunicationType = 'Call' | 'WhatsApp' | 'Email' | 'Meeting';

export interface B2BFollowUp {
  id: string; // Auto increment or key
  dealId: string;
  companyName: string;
  contactPerson: string;
  date: string;
  communicationType: B2BCommunicationType;
  interestLevel: 'High' | 'Medium' | 'Low';
  notes: string;
  nextStep: 'Send quotation' | 'Follow-up call' | 'Meeting' | 'Send samples' | 'Waiting response' | 'Other';
  nextFollowUpDate: string;
}

// --- System Management & Security ---

export interface AuditLog {
  id: string;
  userId: string;
  username: string;
  timestamp: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE' | 'EXPORT' | 'IMPORT' | 'RESET' | 'LOGIN';
  entityType: string;
  entityId: string;
  details: string;
}

export interface BackupInfo {
  id: string;
  timestamp: string;
  label: string;
  size: number;
  type: 'AUTO' | 'MANUAL';
}

export interface SystemMetadata {
  version: string;
  createdAt: string;
  lastBackupAt?: string;
  recordCount: Record<string, number>;
  status: 'Healthy' | 'Warning' | 'Maintenance';
}

export interface RecycleBinItem {
  id: string;
  originalKey: string;
  deletedAt: string;
  expiresAt: string;
  data: any;
  entityType: string;
  entityName: string;
}

export interface SystemData {
  metadata: SystemMetadata;
  clients: Client[];
  orders: MedicalOrder[];
  contracts: any[];
  products: Product[];
  expenses: Expense[];
  reports: any[];
  settings: any;
  users: User[];
  patients?: Patient[];
  hospitals?: PartnerHospital[];
  auditLogs: AuditLog[];
  recycleBin: RecycleBinItem[];
}
