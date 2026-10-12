import React from 'react';
import { ShoppingBag, ShieldCheck, UserCheck, Store, Cpu } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  activeTab: 'shop' | 'customer' | 'merchant' | 'sandbox';
  setActiveTab: (tab: 'shop' | 'customer' | 'merchant' | 'sandbox') => void;
  cartCount: number;
  onOpenCart: () => void;
  customerAvailableCredit: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  customerAvailableCredit,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single-element brand wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('shop')}
              className="text-left group cursor-pointer focus:outline-none"
              aria-label="Bukra Home"
            >
              <Logo size="md" variant="full" />
            </button>
          </div>

          {/* Zone 2: Single-line clean navigation links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('shop')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'shop'
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <Store className="w-4 h-4 text-neutral-500" />
              <span>Online Shop</span>
            </button>

            <button
              onClick={() => setActiveTab('customer')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'customer'
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Buyer Credit & Plans</span>
            </button>

            <button
              onClick={() => setActiveTab('merchant')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'merchant'
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Merchant Portal</span>
            </button>

            <button
              onClick={() => setActiveTab('sandbox')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'sandbox'
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <Cpu className="w-4 h-4 text-amber-600" />
              <span>Credit Algorithm</span>
            </button>
          </nav>

          {/* Zone 3: Primary action & cart drawer */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Credit Limit Glance for Customer */}
            <div className="hidden lg:flex items-center text-xs text-neutral-600 border border-neutral-200 rounded-lg px-2.5 py-1.5 bg-neutral-50">
              <span className="text-neutral-500 mr-1.5">Bukra Limit:</span>
              <span className="font-semibold text-neutral-900 tabular-nums">
                {customerAvailableCredit.toLocaleString()} RWF
              </span>
            </div>

            <button
              onClick={onOpenCart}
              className="relative px-3.5 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 text-xs font-bold bg-emerald-500 text-white rounded-full tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-neutral-100 scrollbar-none">
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'shop' ? 'bg-neutral-900 text-white' : 'text-neutral-600'
            }`}
          >
            Shop
          </button>
          <button
            onClick={() => setActiveTab('customer')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'customer' ? 'bg-neutral-900 text-white' : 'text-neutral-600'
            }`}
          >
            Buyer Credit
          </button>
          <button
            onClick={() => setActiveTab('merchant')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'merchant' ? 'bg-neutral-900 text-white' : 'text-neutral-600'
            }`}
          >
            Merchant Portal
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'sandbox' ? 'bg-neutral-900 text-white' : 'text-neutral-600'
            }`}
          >
            Algorithm
          </button>
        </div>
      </div>
    </header>
  );
};
