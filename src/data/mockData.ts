import { Product, Customer, Merchant, InstallmentPlan, Order, MoMoTransactionHistory } from '../types/bukra';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-mara-x2',
    name: 'Mara X2 5G Kigali Edition',
    category: 'Electronics',
    price: 240000,
    description: 'Flagship 6.7" OLED smartphone assembled in Kigali. 256GB storage, triple AI camera system, and ultra-long 5000mAh battery.',
    inStock: true,
    sku: 'RWA-MARA-X2',
    specs: ['6.7" AMOLED 120Hz', '256GB Storage / 8GB RAM', 'Dual SIM + eSIM', 'Made in Rwanda'],
    gradientTheme: 'from-blue-600 via-indigo-600 to-sky-700',
    badge: 'Popular in Kigali'
  },
  {
    id: 'prod-suncharge-500',
    name: 'Kigali SunCharge 500W Hybrid Inverter',
    category: 'Home Energy',
    price: 360000,
    description: 'Reliable silent solar backup station with pure sine wave inverter. Keeps your home appliances, WiFi, and lighting running seamlessly.',
    inStock: true,
    sku: 'RWA-SOLAR-500',
    specs: ['512Wh LiFePO4 Cell', '500W AC Output (Surge 1000W)', '2x Fast USB-C PD 100W', 'MTN MoMo Solar IoT Enabled'],
    gradientTheme: 'from-amber-500 via-orange-600 to-yellow-600',
    badge: 'Eco-Smart'
  },
  {
    id: 'prod-virunga-laptop',
    name: 'Virunga Pro Titanium Ultrabook 14"',
    category: 'Computing',
    price: 540000,
    description: 'Lightweight aerospace-grade magnesium alloy chassis. High-performance octa-core processor built for software engineers and digital creators.',
    inStock: true,
    sku: 'RWA-LAPTOP-14',
    specs: ['Intel Core i5 / 16GB DDR5', '512GB NVMe Gen4 SSD', '14" 2.8K Retina IPS', 'Backlit Kinyarwanda/EN Keyboard'],
    gradientTheme: 'from-slate-700 via-slate-800 to-zinc-900',
    badge: 'Tech Essential'
  },
  {
    id: 'prod-kivu-coffee-set',
    name: 'Lake Kivu Artisanal Brew & Roast Set',
    category: 'Artisan & Lifestyle',
    price: 45000,
    description: 'Hand-thrown Rwandan volcanic stoneware pour-over dripper with 1kg single-origin washed Bourbon beans from Huye Mountain co-ops.',
    inStock: true,
    sku: 'RWA-ART-COFFEE',
    specs: ['100% Red Bourbon Arabica', 'Handcrafted Ceramic Dripper', 'Precision Glass Server 600ml', 'Fair Trade Certified'],
    gradientTheme: 'from-emerald-700 via-teal-800 to-stone-900',
    badge: 'Local Craft'
  },
  {
    id: 'prod-air-purifier',
    name: 'Nyungwe Smart Air Purifier Pro',
    category: 'Home Living',
    price: 150000,
    description: 'True HEPA H13 filtration system designed for urban Kigali living rooms. Removes dust, pollen, and allergens with ultra-quiet motor.',
    inStock: true,
    sku: 'RWA-AIR-H13',
    specs: ['CADR 380m³/h', 'H13 Medical-grade HEPA', 'Smart Tuya / MoMo IoT App', '32dB Night Whisper Mode'],
    gradientTheme: 'from-cyan-700 via-teal-700 to-sky-900'
  },
  {
    id: 'prod-ergonomic-chair',
    name: 'Kigali Ergonomic Mesh Task Chair',
    category: 'Office & Furniture',
    price: 180000,
    description: 'High-density breathable Korean mesh backing with dynamic lumbar support and 3D adjustable armrests for all-day comfort.',
    inStock: true,
    sku: 'RWA-CHAIR-ERGO',
    specs: ['Dynamic Lumbar Support', 'BIFMA Class 4 Gas Lift', '3D Adjustable Armrests', 'Weight Capacity 150kg'],
    gradientTheme: 'from-zinc-700 via-neutral-800 to-neutral-900'
  }
];

export const INITIAL_MERCHANT: Merchant = {
  userID: 201,
  name: 'Patrick Gasana',
  momoNumber: '+250 788 900 112',
  email: 'merchant@kigaligoods.rw',
  businessName: 'Kigali Horizon Goods Ltd',
  discountRate: 0.055, // 5.5% Bukra discount rate
  bankAccountNumber: '00040-1289401-82 (Bank of Kigali)',
  bankName: 'Bank of Kigali (BK)',
  totalVolumeProcessed: 3240000,
  pendingPayoutBalance: 340200,
  withdrawnPayouts: 2899800,
};

export const INITIAL_CUSTOMER: Customer = {
  userID: 101,
  name: 'Jean-Paul Habimana',
  momoNumber: '+250 788 452 910',
  email: 'jp.habimana@kigali.rw',
  nationalId: '1199480034567890',
  creditLimit: 500000,
  availableCredit: 340000,
  creditScore: 740,
  repaymentHistoryRating: 'Excellent',
  successfulRepaymentsCount: 3,
  missedRepaymentsCount: 0,
};

export const INITIAL_MOMO_HISTORY: MoMoTransactionHistory = {
  phone: '+250 788 452 910',
  monthlyAverageInflow: 520000, // Monthly salary / business deposits
  monthlyAverageOutflow: 310000,
  transactionCountMonthly: 38,
  activeMonths: 18,
  recentTransactions: [
    {
      id: 'TXN-90184',
      date: '2026-10-01',
      type: 'INFLOW',
      amount: 480000,
      description: 'Payroll Direct Deposit - TechHub Kigali'
    },
    {
      id: 'TXN-90185',
      date: '2026-10-03',
      type: 'OUTFLOW',
      amount: 85000,
      description: 'Utility Payment (EUCL & WASAC Kigali)'
    },
    {
      id: 'TXN-90186',
      date: '2026-10-06',
      type: 'OUTFLOW',
      amount: 42000,
      description: 'Grocery Simba Supermarket Kimihurura'
    },
    {
      id: 'TXN-90187',
      date: '2026-10-08',
      type: 'INFLOW',
      amount: 75000,
      description: 'Mobile Money Transfer from M. Diane'
    }
  ]
};

export const INITIAL_ORDERS: Order[] = [
  {
    orderID: 1042,
    customerID: 101,
    customerName: 'Jean-Paul Habimana',
    momoNumber: '+250 788 452 910',
    merchantID: 201,
    merchantName: 'Kigali Horizon Goods Ltd',
    items: [
      {
        product: INITIAL_PRODUCTS[0], // Mara X2 240,000 RWF
        quantity: 1,
      }
    ],
    totalAmount: 240000,
    paymentMethod: 'BUKRA_BNPL',
    installmentPlanID: 501,
    merchantPayoutAmount: 226800, // 240,000 * 0.945
    bukraFeeAmount: 13200, // 5.5% discount fee
    status: 'CONFIRMED',
    date: '2026-09-15'
  }
];

export const INITIAL_PLANS: InstallmentPlan[] = [
  {
    planID: 501,
    orderID: 1042,
    customerID: 101,
    merchantID: 201,
    totalAmount: 240000,
    downPayment: 80000,
    numberOfInstallments: 3,
    monthlyAmount: 80000,
    interestRate: 0,
    interestAmount: 0,
    startDate: '2026-09-15',
    dueDate: '2026-10-15',
    status: 'ACTIVE',
    schedule: [
      {
        installmentNumber: 1,
        amount: 80000,
        dueDate: '2026-09-15',
        status: 'PAID',
        paidAt: '2026-09-15 14:22:10',
        momoTransactionId: 'MOMO-PAY-88319'
      },
      {
        installmentNumber: 2,
        amount: 80000,
        dueDate: '2026-10-15',
        status: 'PENDING'
      },
      {
        installmentNumber: 3,
        amount: 80000,
        dueDate: '2026-11-15',
        status: 'PENDING'
      }
    ],
    remainingBalance: 160000,
    createdAt: '2026-09-15'
  }
];
