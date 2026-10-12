import React from 'react';
import { CartItem } from '../types/bukra';
import { X, Trash2, Plus, Minus, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: (method: 'BUKRA_BNPL' | 'MOMO_PAY_FULL') => void;
  customerAvailableCredit: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  customerAvailableCredit,
}) => {
  const [selectedMethod, setSelectedMethod] = React.useState<'BUKRA_BNPL' | 'MOMO_PAY_FULL'>('BUKRA_BNPL');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const monthlyThree = Math.ceil(subtotal / 3);
  const exceedsCredit = subtotal > customerAvailableCredit;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-neutral-900">Your Shopping Cart</h2>
              <span className="text-xs text-neutral-500 tabular-nums">
                ({cart.reduce((n, i) => n + i.quantity, 0)} items)
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center text-neutral-500">
                <p className="text-sm">Your shopping cart is currently empty.</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Explore Rwandan goods and split payments 0% interest with Bukra.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 pb-4 border-b border-neutral-100 last:border-0"
                >
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${item.product.gradientTheme} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                    <span className="text-xs font-mono font-bold">
                      {item.product.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-neutral-900 truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-neutral-400 hover:text-rose-600 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-neutral-500 mt-0.5 tabular-nums">
                      {item.product.price.toLocaleString()} RWF each
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-neutral-200 rounded-md">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-neutral-500 hover:bg-neutral-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-neutral-500 hover:bg-neutral-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-neutral-900 tabular-nums">
                        {(item.product.price * item.quantity).toLocaleString()} RWF
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Selection */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-neutral-200 bg-neutral-50/70 space-y-4">
              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-2">
                  Select Payment Model:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {/* Bukra Option */}
                  <button
                    onClick={() => setSelectedMethod('BUKRA_BNPL')}
                    className={`p-3 text-left rounded-lg border transition-all ${
                      selectedMethod === 'BUKRA_BNPL'
                        ? 'border-emerald-600 bg-emerald-50/80 ring-1 ring-emerald-600'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-neutral-900">Bukra 0% BNPL</span>
                      {selectedMethod === 'BUKRA_BNPL' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 block tabular-nums">
                      3× {monthlyThree.toLocaleString()} RWF/mo
                    </span>
                    <span className="text-[10px] text-neutral-500 mt-0.5 block">
                      Islamic zero-interest Murabaha
                    </span>
                  </button>

                  {/* MoMo Full Pay */}
                  <button
                    onClick={() => setSelectedMethod('MOMO_PAY_FULL')}
                    className={`p-3 text-left rounded-lg border transition-all ${
                      selectedMethod === 'MOMO_PAY_FULL'
                        ? 'border-neutral-900 bg-neutral-100 ring-1 ring-neutral-900'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-neutral-900">Full MoMo Pay</span>
                      {selectedMethod === 'MOMO_PAY_FULL' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900" />
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-neutral-800 block tabular-nums">
                      {subtotal.toLocaleString()} RWF
                    </span>
                    <span className="text-[10px] text-neutral-500 mt-0.5 block">
                      100% upfront settlement
                    </span>
                  </button>
                </div>
              </div>

              {/* Bukra Limit Safety Notice */}
              {selectedMethod === 'BUKRA_BNPL' && (
                <div className="p-3 bg-white rounded-lg border border-neutral-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Your Bukra Available Credit:</span>
                    <span className="font-semibold text-neutral-900 tabular-nums">
                      {customerAvailableCredit.toLocaleString()} RWF
                    </span>
                  </div>
                  {exceedsCredit && (
                    <div className="mt-2 text-[11px] text-amber-700 flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                      <span>Order exceeds your credit limit. You can test eligibility evaluation in checkout or reduce items.</span>
                    </div>
                  )}
                </div>
              )}

              {/* Total Summary */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-200 text-sm">
                <span className="text-neutral-600">Total Purchase:</span>
                <span className="text-base font-extrabold text-neutral-900 tabular-nums">
                  {subtotal.toLocaleString()} RWF
                </span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onProceedToCheckout(selectedMethod)}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>
                  {selectedMethod === 'BUKRA_BNPL' ? 'Continue with Bukra 0% Plan' : 'Pay Full via MTN MoMo'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero Interest · Certified Sharia Compliant · Kigali Merchant Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
