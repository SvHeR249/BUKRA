import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { BukraCheckoutModal } from './components/BukraCheckoutModal';
import { CustomerPortal } from './components/CustomerPortal';
import { MerchantDashboard } from './components/MerchantDashboard';
import { CreditAlgorithmSandbox } from './components/CreditAlgorithmSandbox';
import { Logo, LogoConceptShowcase } from './components/Logo';
import { 
  INITIAL_PRODUCTS, INITIAL_CUSTOMER, INITIAL_MERCHANT, 
  INITIAL_ORDERS, INITIAL_PLANS 
} from './data/mockData';
import { Product, CartItem, Order, InstallmentPlan, Customer, Merchant } from './types/bukra';
import { 
  ShieldCheck, Zap, ArrowRight, CheckCircle2, 
  Sparkles, Filter, Info, Smartphone 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'shop' | 'customer' | 'merchant' | 'sandbox'>('shop');
  
  // App state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bukra_cart');
    return saved ? JSON.parse(saved) : [{ product: INITIAL_PRODUCTS[0], quantity: 1 }];
  });

  const [customer, setCustomer] = useState<Customer>(() => {
    const saved = localStorage.getItem('bukra_customer');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMER;
  });

  const [merchant, setMerchant] = useState<Merchant>(() => {
    const saved = localStorage.getItem('bukra_merchant');
    return saved ? JSON.parse(saved) : INITIAL_MERCHANT;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bukra_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [plans, setPlans] = useState<InstallmentPlan[]>(() => {
    const saved = localStorage.getItem('bukra_plans');
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
  });

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('bukra_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bukra_customer', JSON.stringify(customer));
  }, [customer]);

  useEffect(() => {
    localStorage.setItem('bukra_merchant', JSON.stringify(merchant));
  }, [merchant]);

  useEffect(() => {
    localStorage.setItem('bukra_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('bukra_plans', JSON.stringify(plans));
  }, [plans]);

  const showToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(null), 5000);
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added ${product.name} to cart.`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleDirectBuy = (product: Product) => {
    setCart([{ product, quantity: 1 }]);
    setIsCheckoutOpen(true);
  };

  const handleProceedToCheckout = (method: 'BUKRA_BNPL' | 'MOMO_PAY_FULL') => {
    setIsCartOpen(false);
    if (method === 'BUKRA_BNPL') {
      setIsCheckoutOpen(true);
    } else {
      // Full payment immediate simulation
      const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const fee = Math.round(totalAmount * merchant.discountRate);
      const newOrder: Order = {
        orderID: Math.floor(2000 + Math.random() * 9000),
        customerID: customer.userID,
        customerName: customer.name,
        momoNumber: customer.momoNumber,
        merchantID: merchant.userID,
        merchantName: merchant.businessName,
        items: [...cart],
        totalAmount,
        paymentMethod: 'MOMO_PAY_FULL',
        merchantPayoutAmount: totalAmount - fee,
        bukraFeeAmount: fee,
        status: 'CONFIRMED',
        date: new Date().toISOString().split('T')[0],
      };

      setOrders((prev) => [newOrder, ...prev]);
      setMerchant((prev) => ({
        ...prev,
        pendingPayoutBalance: prev.pendingPayoutBalance + (totalAmount - fee),
        totalVolumeProcessed: prev.totalVolumeProcessed + totalAmount,
      }));
      setCart([]);
      showToast(`Order #${newOrder.orderID} paid in full via MTN MoMo!`);
    }
  };

  // Complete Bukra BNPL checkout
  const handleCompleteOrder = (order: Order, plan?: InstallmentPlan) => {
    setOrders((prev) => [order, ...prev]);
    if (plan) {
      setPlans((prev) => [plan, ...prev]);
    }

    // Upfront settlement to merchant
    setMerchant((prev) => ({
      ...prev,
      pendingPayoutBalance: prev.pendingPayoutBalance + order.merchantPayoutAmount,
      totalVolumeProcessed: prev.totalVolumeProcessed + order.totalAmount,
    }));

    setCart([]);
    showToast(`Order #${order.orderID} confirmed! 1st installment paid via MTN MoMo.`);
  };

  // Pay single installment (triggers State Machine & dynamic credit increase!)
  const handlePayInstallment = (planId: number, installmentNum: number) => {
    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.planID !== planId) return plan;

        let updatedBalance = plan.remainingBalance;
        const newSchedule = plan.schedule.map((item) => {
          if (item.installmentNumber === installmentNum && item.status !== 'PAID') {
            updatedBalance = Math.max(0, updatedBalance - item.amount);
            return {
              ...item,
              status: 'PAID' as const,
              paidAt: new Date().toISOString(),
              momoTransactionId: `MOMO-KGL-${Math.floor(100000 + Math.random() * 900000)}`,
            };
          }
          return item;
        });

        const isFullyPaid = updatedBalance === 0;

        return {
          ...plan,
          schedule: newSchedule,
          remainingBalance: updatedBalance,
          status: isFullyPaid ? 'COMPLETED' : 'ACTIVE',
        };
      })
    );

    // Dynamic Credit Limit Increase (+25,000 RWF & +15 Credit Score)
    setCustomer((prev) => {
      const newScore = Math.min(850, prev.creditScore + 15);
      const newLimit = prev.creditLimit + 25000;
      return {
        ...prev,
        creditScore: newScore,
        creditLimit: newLimit,
        successfulRepaymentsCount: prev.successfulRepaymentsCount + 1,
        repaymentHistoryRating: newScore >= 700 ? 'Excellent' : 'Good',
      };
    });

    showToast(`Installment #${installmentNum} settled! Credit Limit increased by +25,000 RWF.`);
  };

  // Simulate missed payment date (transitions state to OVERDUE & reduces limit!)
  const handleSimulateMissedPayment = (planId: number) => {
    setPlans((prev) =>
      prev.map((plan) => (plan.planID === planId ? { ...plan, status: 'OVERDUE' } : plan))
    );

    // Dynamic Credit Limit Penalty (-50,000 RWF & -30 Credit Score)
    setCustomer((prev) => {
      const newScore = Math.max(300, prev.creditScore - 30);
      const newLimit = Math.max(50000, prev.creditLimit - 50000);
      return {
        ...prev,
        creditScore: newScore,
        creditLimit: newLimit,
        missedRepaymentsCount: prev.missedRepaymentsCount + 1,
        repaymentHistoryRating: newScore < 600 ? 'Fair' : 'Good',
      };
    });

    showToast(`State Machine: Plan #${planId} is now OVERDUE. Dynamic limit reduced by -50,000 RWF.`);
  };

  // Pay late installment (recovers standing)
  const handlePayLateInstallment = (planId: number) => {
    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.planID !== planId) return plan;
        // Find overdue item and pay it
        let updatedBalance = plan.remainingBalance;
        const newSchedule = plan.schedule.map((item) => {
          if (item.status === 'PENDING' || item.status === 'OVERDUE') {
            updatedBalance = Math.max(0, updatedBalance - item.amount);
            return {
              ...item,
              status: 'PAID' as const,
              paidAt: new Date().toISOString(),
              momoTransactionId: `MOMO-KGL-${Math.floor(100000 + Math.random() * 900000)}`,
            };
          }
          return item;
        });

        return {
          ...plan,
          schedule: newSchedule,
          remainingBalance: updatedBalance,
          status: updatedBalance === 0 ? 'COMPLETED' : 'ACTIVE',
        };
      })
    );

    showToast(`Late installment resolved! Plan status restored to Active.`);
  };

  // Merchant operations
  const handleWithdrawFunds = (amount: number) => {
    setMerchant((prev) => ({
      ...prev,
      pendingPayoutBalance: prev.pendingPayoutBalance - amount,
      withdrawnPayouts: prev.withdrawnPayouts + amount,
    }));
  };

  const handleUpdateDiscountRate = (newRate: number) => {
    setMerchant((prev) => ({ ...prev, discountRate: newRate }));
    showToast(`Merchant agreement discount rate updated to ${(newRate * 100).toFixed(1)}%.`);
  };

  // Sandbox parameter apply
  const handleApplySandboxParameters = (newLimit: number, newScore: number) => {
    setCustomer((prev) => ({
      ...prev,
      creditLimit: newLimit,
      creditScore: newScore,
    }));
  };

  const categories = ['All', 'Electronics', 'Computing', 'Home Energy', 'Artisan & Lifestyle', 'Home Living', 'Office & Furniture'];
  const filteredProducts = selectedCategory === 'All'
    ? INITIAL_PRODUCTS
    : INITIAL_PRODUCTS.filter((p) => p.category === selectedCategory);

  const totalOpenBalance = plans
    .filter((p) => p.status !== 'COMPLETED')
    .reduce((sum, p) => sum + p.remainingBalance, 0);

  const availableCredit = Math.max(0, customer.creditLimit - totalOpenBalance);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      {/* Toast Notification Banner */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-950 text-white text-xs font-medium py-3 px-4 rounded-xl shadow-2xl flex items-center gap-2.5 border border-neutral-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastNotification}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((n, i) => n + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        customerAvailableCredit={availableCredit}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
            {/* Storefront Hero Banner */}
            <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-12 shadow-sm overflow-hidden relative">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/80">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Murabaha Islamic Financing · Kigali E-Commerce</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                  Everyday Purchases in Rwanda. Split into 3 or 4 Payments. <span className="text-emerald-700">0% Interest.</span>
                </h1>

                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl">
                  Bukra bridges Kigali’s liquidity gap with Sharia-compliant, interest-free installment plans powered by MTN Mobile Money. Merchants receive 100% upfront settlement while buyers enjoy flexible monthly cashflow.
                </p>

                {/* Primary Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      const el = document.getElementById('catalog-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>Browse Rwandan Catalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTab('customer')}
                    className="px-5 py-3 text-xs sm:text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>Check My Bukra Limit</span>
                  </button>
                </div>
              </div>

              {/* 4-Item Proof Strip */}
              <div className="mt-8 pt-6 border-t border-neutral-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="font-bold text-neutral-900 block">Strictly 0% Interest</span>
                  <span className="text-neutral-500 text-[11px]">Retail price divided equally. Zero hidden fees.</span>
                </div>
                <div>
                  <span className="font-bold text-neutral-900 block">Instant MoMo Approval</span>
                  <span className="text-neutral-500 text-[11px]">Under 2-second algorithmic assessment.</span>
                </div>
                <div>
                  <span className="font-bold text-neutral-900 block">Upfront Merchant Cash</span>
                  <span className="text-neutral-500 text-[11px]">Bukra pays store 100% upfront on order day.</span>
                </div>
                <div>
                  <span className="font-bold text-neutral-900 block">Dynamic Spending Limits</span>
                  <span className="text-neutral-500 text-[11px]">Punctual payments increase your limit automatically.</span>
                </div>
              </div>
            </div>

            {/* Catalog Section */}
            <div id="catalog-section" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">
                    Featured Rwandan Products
                  </h2>
                  <p className="text-xs text-neutral-500">
                    All items available with Bukra 0% interest monthly installment plans
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-neutral-900 text-white shadow-sm font-semibold'
                          : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onDirectBuy={handleDirectBuy}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Customer Portal */}
        {activeTab === 'customer' && (
          <CustomerPortal
            customer={customer}
            plans={plans}
            orders={orders}
            onPayInstallment={handlePayInstallment}
            onSimulateMissedPayment={handleSimulateMissedPayment}
            onPayLateInstallment={handlePayLateInstallment}
          />
        )}

        {/* Tab 3: Merchant Dashboard */}
        {activeTab === 'merchant' && (
          <MerchantDashboard
            merchant={merchant}
            orders={orders}
            onWithdrawFunds={handleWithdrawFunds}
            onUpdateDiscountRate={handleUpdateDiscountRate}
          />
        )}

        {/* Tab 4: Credit Algorithm Sandbox */}
        {activeTab === 'sandbox' && (
          <CreditAlgorithmSandbox
            customer={customer}
            onApplyToCustomer={handleApplySandboxParameters}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={handleProceedToCheckout}
        customerAvailableCredit={availableCredit}
      />

      {/* Bukra Checkout Modal (Activity & Sequence Diagram Workflow) */}
      <BukraCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        customer={customer}
        merchantDiscountRate={merchant.discountRate}
        onCompleteOrder={handleCompleteOrder}
        openBalance={totalOpenBalance}
      />

      {/* Quiet Footer adhering to universal frontend constitution */}
      <footer className="border-t border-neutral-200 bg-white py-8 mt-16 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLogoModalOpen(true)}
              className="text-left group cursor-pointer focus:outline-none"
              title="Click to view Brand Logo Design Specification"
            >
              <Logo size="sm" variant="mark-only" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#14532D]">Bukra Rwanda</span>
              <span aria-hidden="true">·</span>
              <span>Interest-Free BNPL Platform for Rwandan E-Commerce</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsLogoModalOpen(true)}
              className="text-[#14532D] hover:text-[#22C55E] font-semibold underline underline-offset-2 transition-colors cursor-pointer"
            >
              View Logo Specification
            </button>
            <span aria-hidden="true">·</span>
            <span>Kigali, Rwanda</span>
            <span aria-hidden="true">·</span>
            <span>Sharia Compliant (Murabaha)</span>
            <span aria-hidden="true">·</span>
            <span>MTN MoMo API Certified</span>
          </div>
        </div>
      </footer>

      {/* Brand Logo Specification Modal */}
      {isLogoModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl">
            <LogoConceptShowcase onClose={() => setIsLogoModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
