import React, { useState } from 'react';
import { Customer, InstallmentPlan, Order } from '../types/bukra';
import { 
  CreditCard, ShieldCheck, CheckCircle2, AlertTriangle, 
  TrendingUp, TrendingDown, ArrowUpRight, Clock, 
  Calendar, Check, RefreshCw, Phone, Lock 
} from 'lucide-react';

interface CustomerPortalProps {
  customer: Customer;
  plans: InstallmentPlan[];
  orders: Order[];
  onPayInstallment: (planId: number, installmentNum: number) => void;
  onSimulateMissedPayment: (planId: number) => void;
  onPayLateInstallment: (planId: number) => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  customer,
  plans,
  orders,
  onPayInstallment,
  onSimulateMissedPayment,
  onPayLateInstallment,
}) => {
  const [payingPlanId, setPayingPlanId] = useState<number | null>(null);
  const [payingInstallmentNum, setPayingInstallmentNum] = useState<number | null>(null);
  const [simulatedPin, setSimulatedPin] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const totalOpenBalance = plans
    .filter((p) => p.status !== 'COMPLETED')
    .reduce((sum, p) => sum + p.remainingBalance, 0);

  const availableCredit = Math.max(0, customer.creditLimit - totalOpenBalance);

  const handleOpenPaymentPrompt = (planId: number, installmentNum: number) => {
    setPayingPlanId(planId);
    setPayingInstallmentNum(installmentNum);
    setSimulatedPin('1234');
  };

  const handleConfirmInstallmentPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingPlanId || payingInstallmentNum === null) return;

    setIsProcessingPayment(true);
    setTimeout(() => {
      onPayInstallment(payingPlanId, payingInstallmentNum);
      setIsProcessingPayment(false);
      setPayingPlanId(null);
      setPayingInstallmentNum(null);
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner & Customer Identity */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
            <span>Customer Account ID: #{customer.userID}</span>
            <span aria-hidden="true">·</span>
            <span>Rwandan NID: {customer.nationalId}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900">
            {customer.name}
          </h1>
          <p className="text-xs text-neutral-600 mt-1 flex items-center gap-2">
            <span>Linked MoMo: <strong className="text-neutral-900">{customer.momoNumber}</strong></span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-semibold">Islamic Murabaha Credit Verified</span>
          </p>
        </div>

        {/* Dynamic Limit Behavioral Alert */}
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-4 text-xs text-emerald-900 max-w-sm">
          <div className="flex items-center gap-1.5 font-bold mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <span>Dynamic Limit Engine Active</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            Timely repayments increase your Bukra spending limit by +25,000 RWF each time. Missed payments trigger score penalties and limit reductions.
          </p>
        </div>
      </div>

      {/* Credit & Financial Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Credit Limit */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-xs font-medium text-neutral-500 block mb-1">Total Bukra Limit</span>
          <div className="text-2xl font-extrabold text-neutral-900 tabular-nums">
            {customer.creditLimit.toLocaleString()} <span className="text-xs font-normal text-neutral-500">RWF</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500 flex items-center gap-1">
            <span className="text-emerald-600 font-medium">Auto-adjusted</span>
            <span>via MoMo history</span>
          </div>
        </div>

        {/* Available Limit */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-xs font-medium text-neutral-500 block mb-1">Available Spending Limit</span>
          <div className="text-2xl font-extrabold text-emerald-600 tabular-nums">
            {availableCredit.toLocaleString()} <span className="text-xs font-normal text-neutral-500">RWF</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500">
            Current Open Balance: {totalOpenBalance.toLocaleString()} RWF
          </div>
        </div>

        {/* Bukra Credit Score */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-xs font-medium text-neutral-500 block mb-1">Credit Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-neutral-900 tabular-nums">
              {customer.creditScore}
            </span>
            <span className="text-xs text-neutral-400">/ 850</span>
            <span className={`text-xs font-bold ml-auto px-2 py-0.5 rounded ${
              customer.creditScore >= 700 
                ? 'bg-emerald-100 text-emerald-800' 
                : customer.creditScore >= 600
                ? 'bg-blue-100 text-blue-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {customer.repaymentHistoryRating}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500">
            {customer.successfulRepaymentsCount} on-time · {customer.missedRepaymentsCount} missed
          </div>
        </div>

        {/* Islamic Zero Interest Principles */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-medium text-neutral-500 block mb-1">Cost of Credit</span>
          <div className="text-2xl font-extrabold text-emerald-700 tabular-nums">
            0% Interest
          </div>
          <div className="mt-2 text-[11px] text-neutral-500">
            Zero riba · Zero compounding fees
          </div>
        </div>
      </div>

      {/* Active Installment Plans Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900">
            Active Bukra Installment Plans
          </h2>
          <span className="text-xs text-neutral-500">
            {plans.length} plan{plans.length !== 1 ? 's' : ''} on record
          </span>
        </div>

        {plans.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center text-neutral-500">
            <Calendar className="w-8 h-8 mx-auto text-neutral-400 mb-2" />
            <p className="text-sm font-semibold text-neutral-800">No installment plans found</p>
            <p className="text-xs text-neutral-500 mt-1">
              Shop in our catalog and select Bukra 0% BNPL at checkout to start an installment plan.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {plans.map((plan) => {
              const matchingOrder = orders.find((o) => o.installmentPlanID === plan.planID);
              const nextPendingInstallment = plan.schedule.find((s) => s.status === 'PENDING' || s.status === 'OVERDUE');

              return (
                <div
                  key={plan.planID}
                  className={`bg-white rounded-2xl border transition-all shadow-sm overflow-hidden ${
                    plan.status === 'OVERDUE'
                      ? 'border-rose-300 ring-1 ring-rose-300'
                      : plan.status === 'COMPLETED'
                      ? 'border-neutral-200 bg-neutral-50/50'
                      : 'border-neutral-200'
                  }`}
                >
                  {/* Plan Header */}
                  <div className="p-5 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-50/60">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-neutral-900">
                          PLAN #{plan.planID}
                        </span>
                        <span aria-hidden="true" className="text-neutral-300">·</span>
                        <span className="text-xs text-neutral-600">
                          Order #{plan.orderID} ({matchingOrder?.items[0]?.product.name || 'Purchased Items'})
                        </span>
                      </div>
                      <div className="text-xs text-neutral-500">
                        Tenor: {plan.numberOfInstallments} Months · Downpayment: {plan.downPayment.toLocaleString()} RWF · Interest: 0 RWF
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Status Badge */}
                      <span className={`text-xs font-bold px-3 py-1 rounded-md ${
                        plan.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : plan.status === 'OVERDUE'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-neutral-200 text-neutral-700'
                      }`}>
                        {plan.status === 'ACTIVE' ? 'Active' : plan.status === 'OVERDUE' ? 'Overdue' : 'Completed'}
                      </span>

                      {plan.status === 'ACTIVE' && (
                        <button
                          onClick={() => onSimulateMissedPayment(plan.planID)}
                          className="px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors"
                          title="Simulate missed due date to test dynamic limit penalties"
                        >
                          Simulate Missed Due Date
                        </button>
                      )}

                      {plan.status === 'OVERDUE' && (
                        <button
                          onClick={() => onPayLateInstallment(plan.planID)}
                          className="px-3 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md shadow-sm transition-colors"
                        >
                          Pay Late Installment Now
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Plan Financial Metrics */}
                  <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-neutral-100 text-xs">
                    <div>
                      <span className="text-neutral-500 block">Total Retail Price</span>
                      <span className="text-base font-bold text-neutral-900 tabular-nums">
                        {plan.totalAmount.toLocaleString()} RWF
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Monthly Amount</span>
                      <span className="text-base font-bold text-neutral-900 tabular-nums">
                        {plan.monthlyAmount.toLocaleString()} RWF
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Remaining Balance</span>
                      <span className="text-base font-bold text-emerald-700 tabular-nums">
                        {plan.remainingBalance.toLocaleString()} RWF
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Next Due Date</span>
                      <span className="text-base font-semibold text-neutral-900">
                        {plan.status === 'COMPLETED' ? 'Settled in Full' : plan.dueDate}
                      </span>
                    </div>
                  </div>

                  {/* Installments Table */}
                  <div className="p-5">
                    <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-3">
                      Installment Ledger & MoMo Records
                    </h4>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-neutral-200 text-neutral-500">
                            <th className="py-2 font-medium">Installment #</th>
                            <th className="py-2 font-medium">Due Date</th>
                            <th className="py-2 font-medium">Amount</th>
                            <th className="py-2 font-medium">MoMo Transaction ID</th>
                            <th className="py-2 font-medium">Status</th>
                            <th className="py-2 font-medium text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {plan.schedule.map((item) => (
                            <tr key={item.installmentNumber} className="hover:bg-neutral-50/50">
                              <td className="py-2.5 font-medium text-neutral-900">
                                Month {item.installmentNumber}
                              </td>
                              <td className="py-2.5 text-neutral-600">
                                {item.dueDate}
                              </td>
                              <td className="py-2.5 font-bold text-neutral-900 tabular-nums">
                                {item.amount.toLocaleString()} RWF
                              </td>
                              <td className="py-2.5 font-mono text-neutral-500">
                                {item.momoTransactionId || 'Pending payment'}
                              </td>
                              <td className="py-2.5">
                                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                                  item.status === 'PAID'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : item.status === 'OVERDUE'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-neutral-100 text-neutral-700'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="py-2.5 text-right">
                                {item.status === 'PENDING' && (
                                  <button
                                    onClick={() => handleOpenPaymentPrompt(plan.planID, item.installmentNumber)}
                                    className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors"
                                  >
                                    Pay via MoMo
                                  </button>
                                )}
                                {item.status === 'PAID' && (
                                  <span className="text-[11px] text-emerald-600 flex items-center justify-end gap-1">
                                    <Check className="w-3.5 h-3.5" /> Settled
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MoMo Installment Payment Confirmation Modal */}
      {payingPlanId !== null && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200">
            <div className="text-center mb-4">
              <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">
                Authorize MoMo Installment
              </h3>
              <p className="text-xs text-neutral-500">
                Installment #{payingInstallmentNum} for Plan #{payingPlanId}
              </p>
            </div>

            <form onSubmit={handleConfirmInstallmentPayment} className="space-y-4">
              <div className="p-3 bg-neutral-900 text-neutral-100 rounded-xl text-xs font-mono space-y-1">
                <div className="text-amber-400 font-bold">MTN Mobile Money</div>
                <div>Recipient: Bukra Platform Escrow</div>
                <div>Account: {customer.momoNumber}</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Enter MoMo PIN:
                </label>
                <input
                  type="password"
                  maxLength={5}
                  required
                  value={simulatedPin}
                  onChange={(e) => setSimulatedPin(e.target.value)}
                  className="w-full text-center text-lg tracking-widest px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPayingPlanId(null)}
                  className="flex-1 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center justify-center gap-1"
                >
                  {isProcessingPayment ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    'Authorize'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
