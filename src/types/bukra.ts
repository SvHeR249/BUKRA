export type UserRole = 'customer' | 'merchant' | 'admin';

export interface User {
  userID: number;
  name: string;
  momoNumber: string; // e.g. +250 788 123 456
  email?: string;
  nationalId?: string; // Rwandan NID (16 digits)
}

export interface Customer extends User {
  creditLimit: number; // in RWF
  availableCredit: number; // in RWF
  creditScore: number; // 300 to 850
  repaymentHistoryRating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  successfulRepaymentsCount: number;
  missedRepaymentsCount: number;
}

export interface Merchant extends User {
  businessName: string;
  discountRate: number; // e.g. 0.055 for 5.5%
  bankAccountNumber: string;
  bankName: string;
  totalVolumeProcessed: number;
  pendingPayoutBalance: number;
  withdrawnPayouts: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number; // in RWF
  description: string;
  inStock: boolean;
  sku: string;
  specs: string[];
  gradientTheme: string;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type InstallmentStatus = 'PENDING' | 'ACTIVE' | 'DUE_SOON' | 'OVERDUE' | 'COMPLETED';

export interface InstallmentScheduleItem {
  installmentNumber: number;
  amount: number; // in RWF
  dueDate: string; // YYYY-MM-DD
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  paidAt?: string;
  momoTransactionId?: string;
}

export interface InstallmentPlan {
  planID: number;
  orderID: number;
  customerID: number;
  merchantID: number;
  totalAmount: number; // in RWF
  downPayment: number; // in RWF (0 or initial installment)
  numberOfInstallments: number; // 3 or 4 months
  monthlyAmount: number; // in RWF
  interestRate: 0; // Strictly 0% (Islamic Murabaha / zero-riba principle)
  interestAmount: 0;
  startDate: string;
  dueDate: string; // Next due date
  status: InstallmentStatus;
  schedule: InstallmentScheduleItem[];
  remainingBalance: number;
  createdAt: string;
}

export interface Order {
  orderID: number;
  customerID: number;
  customerName: string;
  momoNumber: string;
  merchantID: number;
  merchantName: string;
  items: CartItem[];
  totalAmount: number; // in RWF
  paymentMethod: 'BUKRA_BNPL' | 'MOMO_PAY_FULL';
  installmentPlanID?: number;
  merchantPayoutAmount: number; // totalAmount * (1 - discountRate)
  bukraFeeAmount: number; // totalAmount * discountRate
  status: 'PROCESSING' | 'CONFIRMED' | 'DELIVERED';
  date: string;
}

export interface MoMoTransactionHistory {
  phone: string;
  monthlyAverageInflow: number; // RWF
  monthlyAverageOutflow: number; // RWF
  transactionCountMonthly: number;
  activeMonths: number;
  recentTransactions: {
    id: string;
    date: string;
    type: 'INFLOW' | 'OUTFLOW';
    amount: number;
    description: string;
  }[];
}

export interface CreditEvaluationResult {
  eligible: boolean;
  score: number;
  approvedLimit: number;
  recommendedMaxInstallments: number;
  factors: {
    monthlyCashflow: number;
    debtToIncomeRatio: number;
    momoVelocity: string;
    kycVerified: boolean;
  };
  rejectionReason?: string;
}

export interface MerchantPayout {
  id: string;
  orderID: number;
  amount: number;
  feeDeducted: number;
  timestamp: string;
  status: 'PAID_INSTANTLY' | 'PENDING';
  payoutReference: string;
}
