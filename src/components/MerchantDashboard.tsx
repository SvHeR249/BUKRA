import React, { useState } from 'react';
import { Merchant, Order } from '../types/bukra';
import { 
  Building2, TrendingUp, DollarSign, ArrowDownToLine, 
  CheckCircle2, Clock, ShieldCheck, Percent, HelpCircle 
} from 'lucide-react';

interface MerchantDashboardProps {
  merchant: Merchant;
  orders: Order[];
  onWithdrawFunds: (amount: number) => void;
  onUpdateDiscountRate: (rate: number) => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({
  merchant,
  orders,
  onWithdrawFunds,
  onUpdateDiscountRate,
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState<string | null>(null);

  // Financial aggregates
  const totalGrossSales = orders.reduce((sum, o) => sum + o.totalAmount, 0) + merchant.totalVolumeProcessed;
  const totalBukraFees = orders.reduce((sum, o) => sum + o.bukraFeeAmount, 0) + Math.round(merchant.totalVolumeProcessed * merchant.discountRate);
  const totalUpfrontPaid = totalGrossSales - totalBukraFees;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0 || amt > merchant.pendingPayoutBalance) return;

    onWithdrawFunds(amt);
    setWithdrawSuccessMsg(`Withdrew ${amt.toLocaleString()} RWF to ${merchant.bankName} (${merchant.bankAccountNumber}).`);
    setWithdrawAmount('');
    setTimeout(() => setWithdrawSuccessMsg(null), 5000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Merchant Identity & Agreement Header */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
            <span>Merchant ID: #{merchant.userID}</span>
            <span aria-hidden="true">·</span>
            <span>Registered in Kigali, Rwanda</span>
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-neutral-700" />
            {merchant.businessName}
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Settlement Account: <strong className="text-neutral-900">{merchant.bankAccountNumber}</strong>
          </p>
        </div>

        {/* Bukra Discount Agreement Card */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-xs max-w-md">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-neutral-900 flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-emerald-600" />
              Bukra Merchant Discount Rate: {(merchant.discountRate * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-[11px] text-neutral-600 leading-relaxed">
            Bukra pays your store 100% upfront (minus {(merchant.discountRate * 100).toFixed(1)}% volume discount). Bukra assumes all buyer credit risk and installment collection.
          </p>
          <div className="mt-2.5 pt-2 border-t border-neutral-200 flex items-center gap-2">
            <span className="text-[11px] text-neutral-500">Test agreement tier:</span>
            <button
              onClick={() => onUpdateDiscountRate(0.045)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                merchant.discountRate === 0.045 ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700'
              }`}
            >
              4.5% High Volume
            </button>
            <button
              onClick={() => onUpdateDiscountRate(0.055)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                merchant.discountRate === 0.055 ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700'
              }`}
            >
              5.5% Standard
            </button>
            <button
              onClick={() => onUpdateDiscountRate(0.07)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                merchant.discountRate === 0.07 ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700'
              }`}
            >
              7.0% Specialty
            </button>
          </div>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Gross Sales */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-xs font-medium text-neutral-500 block mb-1">Total Gross Sales Volume</span>
          <div className="text-2xl font-extrabold text-neutral-900 tabular-nums">
            {totalGrossSales.toLocaleString()} <span className="text-xs font-normal text-neutral-500">RWF</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500">
            Powered by Bukra BNPL liquidity
          </div>
        </div>

        {/* Upfront Cashflow Received */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-xs font-medium text-neutral-500 block mb-1">Total Upfront Payouts</span>
          <div className="text-2xl font-extrabold text-blue-600 tabular-nums">
            {totalUpfrontPaid.toLocaleString()} <span className="text-xs font-normal text-neutral-500">RWF</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500">
            Guaranteed immediate liquidity
          </div>
        </div>

        {/* Bukra Discount Fees Paid */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-xs font-medium text-neutral-500 block mb-1">Bukra Merchant Discount Fees</span>
          <div className="text-2xl font-extrabold text-neutral-800 tabular-nums">
            {totalBukraFees.toLocaleString()} <span className="text-xs font-normal text-neutral-500">RWF</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500">
            Bukra platform operating revenue
          </div>
        </div>

        {/* Pending Payout Balance (Withdrawable) */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-xs font-medium text-neutral-500 block mb-1">Available to Withdraw</span>
          <div className="text-2xl font-extrabold text-emerald-600 tabular-nums">
            {merchant.pendingPayoutBalance.toLocaleString()} <span className="text-xs font-normal text-neutral-500">RWF</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500">
            Instant transfer to BK account
          </div>
        </div>
      </div>

      {/* Payout Withdrawal Tool */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <ArrowDownToLine className="w-5 h-5 text-emerald-600" />
              Withdraw Merchant Settlement Balance (receivePayout / Withdraw)
            </h2>
            <p className="text-xs text-neutral-500">
              Implements the UML Use Case "Withdraw" & Class method "receivePayout()"
            </p>
          </div>
          <span className="text-xs font-medium text-neutral-600 bg-neutral-100 px-3 py-1 rounded-lg">
            Bank: {merchant.bankName}
          </span>
        </div>

        {withdrawSuccessMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{withdrawSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleWithdraw} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="number"
              placeholder={`Enter amount up to ${merchant.pendingPayoutBalance.toLocaleString()} RWF`}
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              max={merchant.pendingPayoutBalance}
              min={1000}
              className="w-full px-3 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>
          <button
            type="button"
            onClick={() => setWithdrawAmount(merchant.pendingPayoutBalance.toString())}
            className="px-3 py-2.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            Max All
          </button>
          <button
            type="submit"
            disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > merchant.pendingPayoutBalance}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-300 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            Withdraw to Bank
          </button>
        </form>
      </div>

      {/* Orders & Upfront Payout Ledger */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              Orders & Upfront Bukra Settlements Ledger
            </h2>
            <p className="text-xs text-neutral-500">
              Demonstrates upfront payout ledger vs installment schedules
            </p>
          </div>
          <span className="text-xs text-neutral-500">
            {orders.length} store order{orders.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500">
                <th className="py-2.5 font-medium">Order ID</th>
                <th className="py-2.5 font-medium">Date</th>
                <th className="py-2.5 font-medium">Customer</th>
                <th className="py-2.5 font-medium">Items</th>
                <th className="py-2.5 font-medium">Retail Price</th>
                <th className="py-2.5 font-medium">Bukra Fee (5.5%)</th>
                <th className="py-2.5 font-medium">Net Upfront Merchant Payout</th>
                <th className="py-2.5 font-medium">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.map((order) => (
                <tr key={order.orderID} className="hover:bg-neutral-50/50">
                  <td className="py-3 font-mono font-bold text-neutral-900">
                    #{order.orderID}
                  </td>
                  <td className="py-3 text-neutral-600">
                    {order.date}
                  </td>
                  <td className="py-3 font-medium text-neutral-900">
                    {order.customerName}
                  </td>
                  <td className="py-3 text-neutral-600">
                    {order.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ')}
                  </td>
                  <td className="py-3 font-bold text-neutral-900 tabular-nums">
                    {order.totalAmount.toLocaleString()} RWF
                  </td>
                  <td className="py-3 text-neutral-500 tabular-nums">
                    -{order.bukraFeeAmount.toLocaleString()} RWF
                  </td>
                  <td className="py-3 font-bold text-emerald-700 tabular-nums">
                    +{order.merchantPayoutAmount.toLocaleString()} RWF
                  </td>
                  <td className="py-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                      PAID UPFRONT
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
