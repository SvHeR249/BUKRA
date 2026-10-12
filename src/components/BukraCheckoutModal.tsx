import React, { useState } from 'react';
import { CartItem, Customer, InstallmentPlan, Order } from '../types/bukra';
import { evaluateCredit, calculateInstallmentSchedule } from '../services/creditAlgorithm';
import { INITIAL_MOMO_HISTORY } from '../data/mockData';
import { 
  X, CheckCircle2, AlertTriangle, ShieldCheck, Phone, 
  CreditCard, RefreshCw, ChevronRight, Lock, 
  Store, Calendar, FileText
} from 'lucide-react';
import { Logo } from './Logo';

interface BukraCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  customer: Customer;
  merchantDiscountRate: number; // e.g. 0.055
  onCompleteOrder: (order: Order, plan?: InstallmentPlan) => void;
  openBalance: number;
}

type CheckoutStep = 
  | 'INPUT_DETAILS' 
  | 'EVALUATING_CREDIT' 
  | 'INELIGIBLE' 
  | 'REVIEW_INSTALLMENT_PLAN' 
  | 'MOMO_PIN_PROMPT' 
  | 'SUCCESS';

export const BukraCheckoutModal: React.FC<BukraCheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  customer,
  merchantDiscountRate,
  onCompleteOrder,
  openBalance,
}) => {
  const [step, setStep] = useState<CheckoutStep>('INPUT_DETAILS');
  const [phoneNumber, setPhoneNumber] = useState(customer.momoNumber);
  const [momoPin, setMomoPin] = useState('');
  const [tenorMonths, setTenorMonths] = useState<3 | 4>(3);
  const [evaluationLogs, setEvaluationLogs] = useState<string[]>([]);
  const [evalResult, setEvalResult] = useState<ReturnType<typeof evaluateCredit> | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [createdPlan, setCreatedPlan] = useState<InstallmentPlan | null>(null);
  const [simulateRejection, setSimulateRejection] = useState(false);

  if (!isOpen) return null;

  const totalOrderAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Run the Credit Assessment Algorithm according to Sequence Diagram steps 1 - 7
  const startCreditEvaluation = () => {
    setStep('EVALUATING_CREDIT');
    setEvaluationLogs([
      '1: System receiving checkout request for productAmount (' + totalOrderAmount.toLocaleString() + ' RWF)...',
      '2: System calling checkUserLimit on Bukra Credit Algorithm...',
    ]);

    setTimeout(() => {
      setEvaluationLogs((prev) => [
        ...prev,
        '3: Credit Algorithm querying MoMo API (getTransactionHistory for ' + phoneNumber + ')...',
      ]);
    }, 700);

    setTimeout(() => {
      if (simulateRejection) {
        setEvaluationLogs((prev) => [
          ...prev,
          '4: MoMo API returned low liquidity flag or insufficient transaction history.',
          '5: Credit Algorithm returned REJECT to System.',
        ]);
        setStep('INELIGIBLE');
      } else {
        // Run real evaluation
        const result = evaluateCredit(
          INITIAL_MOMO_HISTORY,
          totalOrderAmount,
          openBalance,
          { timely: customer.successfulRepaymentsCount, missed: customer.missedRepaymentsCount }
        );

        setEvalResult(result);

        if (!result.eligible) {
          setEvaluationLogs((prev) => [
            ...prev,
            '4: MoMo API data retrieved successfully.',
            `5: System: Customer ineligible. Reason: ${result.rejectionReason}`,
          ]);
          setStep('INELIGIBLE');
        } else {
          setEvaluationLogs((prev) => [
            ...prev,
            '6: MoMo API provided verified 18-month transaction inflow data (HistoryData).',
            `7: Credit Algorithm computed score (${result.score}/850) and Approved Limit (${result.approvedLimit.toLocaleString()} RWF).`,
            '8: System generated interest-free installment options for customer.',
          ]);
          setStep('REVIEW_INSTALLMENT_PLAN');
        }
      }
    }, 1600);
  };

  // Step 9: Customer confirms plan
  const handleConfirmPlan = () => {
    setStep('MOMO_PIN_PROMPT');
  };

  // Step 10 & 11: Process Payment with MoMo
  const handleProcessMoMoPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (momoPin.length < 4) return;

    // Build installment plan
    const { schedule, monthlyAmount } = calculateInstallmentSchedule(totalOrderAmount, tenorMonths);
    const newPlanID = Math.floor(1000 + Math.random() * 9000);
    const newOrderID = Math.floor(2000 + Math.random() * 9000);

    // Down payment is installment #1
    schedule[0].status = 'PAID';
    schedule[0].paidAt = new Date().toISOString();
    schedule[0].momoTransactionId = `MOMO-KGL-${Math.floor(100000 + Math.random() * 900000)}`;

    const plan: InstallmentPlan = {
      planID: newPlanID,
      orderID: newOrderID,
      customerID: customer.userID,
      merchantID: 201,
      totalAmount: totalOrderAmount,
      downPayment: monthlyAmount,
      numberOfInstallments: tenorMonths,
      monthlyAmount,
      interestRate: 0,
      interestAmount: 0,
      startDate: new Date().toISOString().split('T')[0],
      dueDate: schedule[1] ? schedule[1].dueDate : schedule[0].dueDate,
      status: 'ACTIVE',
      schedule,
      remainingBalance: totalOrderAmount - monthlyAmount,
      createdAt: new Date().toISOString(),
    };

    // Calculate merchant payout: 100% minus Bukra discount rate (e.g. 5.5%)
    const bukraFee = Math.round(totalOrderAmount * merchantDiscountRate);
    const merchantPayout = totalOrderAmount - bukraFee;

    const order: Order = {
      orderID: newOrderID,
      customerID: customer.userID,
      customerName: customer.name,
      momoNumber: phoneNumber,
      merchantID: 201,
      merchantName: 'Kigali Horizon Goods Ltd',
      items: [...cart],
      totalAmount: totalOrderAmount,
      paymentMethod: 'BUKRA_BNPL',
      installmentPlanID: newPlanID,
      merchantPayoutAmount: merchantPayout,
      bukraFeeAmount: bukraFee,
      status: 'CONFIRMED',
      date: new Date().toISOString().split('T')[0],
    };

    setCreatedPlan(plan);
    setCreatedOrder(order);
    onCompleteOrder(order, plan);
    setStep('SUCCESS');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <Logo size="sm" variant="mark-only" />
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Bukra Installment Checkout
              </h3>
              <p className="text-xs text-neutral-500">
                0% Interest · Murabaha Compliant · Kigali, Rwanda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Body content depending on step */}
        <div className="p-6">
          {/* STEP 1: Phone / MoMo Details */}
          {step === 'INPUT_DETAILS' && (
            <div className="space-y-5">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-xs text-emerald-900 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block mb-0.5">Islamic Finance Guarantee</span>
                  Zero interest, zero late penalty compounding, and zero hidden admin costs. Total price remains exactly {totalOrderAmount.toLocaleString()} RWF.
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  MTN Mobile Money / Airtel Money Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+250 788 000 000"
                    className="w-full pl-9 pr-3 py-2.5 text-sm font-medium border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Bukra will request your MoMo transaction history to calculate your instant spending limit.
                </p>
              </div>

              <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl">
                <div className="flex justify-between text-xs text-neutral-600 mb-1.5">
                  <span>Order Total:</span>
                  <span className="font-bold text-neutral-900 tabular-nums">
                    {totalOrderAmount.toLocaleString()} RWF
                  </span>
                </div>
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Current Available Credit:</span>
                  <span className="font-semibold text-emerald-700 tabular-nums">
                    {(customer.creditLimit - openBalance).toLocaleString()} RWF
                  </span>
                </div>
              </div>

              {/* Developer / Testing Simulator Toggle */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={simulateRejection}
                    onChange={(e) => setSimulateRejection(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>Simulate Ineligible MoMo Profile (Test Rejection flow)</span>
                </label>
              </div>

              <button
                onClick={startCreditEvaluation}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Evaluate Credit & Generate Plan</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Evaluating Credit (Matching Sequence Diagram 1 - 7) */}
          {step === 'EVALUATING_CREDIT' && (
            <div className="py-6 space-y-4">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
                <h4 className="text-sm font-bold text-neutral-900">
                  Executing Bukra Credit Assessment Algorithm...
                </h4>
                <p className="text-xs text-neutral-500">
                  Communicating with MoMo API & assessing cashflow velocity
                </p>
              </div>

              {/* Live Sequence Execution Terminal */}
              <div className="p-3.5 bg-neutral-900 text-neutral-200 rounded-xl text-xs font-mono space-y-1.5 overflow-hidden">
                {evaluationLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400">›</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3A: Ineligible Branch (Matching Activity Diagram: Ineligible -> Reject -> Display Rejection) */}
          {step === 'INELIGIBLE' && (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-neutral-900">
                Installment Plan Request Ineligible
              </h4>
              <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
                {evalResult?.rejectionReason || 'The requested order exceeds your verified MoMo liquidity limit or transaction velocity history.'}
              </p>

              <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-left text-xs space-y-2">
                <span className="font-semibold text-neutral-900 block">How to become eligible:</span>
                <ul className="list-disc list-inside space-y-1 text-neutral-600">
                  <li>Maintain regular MoMo inflows (salary or business deposits).</li>
                  <li>Reduce total cart size to fit under your current limit.</li>
                  <li>Pay prior outstanding plans on time to build your score.</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSimulateRejection(false);
                    setStep('INPUT_DETAILS');
                  }}
                  className="flex-1 py-2.5 px-3 border border-neutral-300 text-neutral-700 text-xs font-semibold rounded-lg hover:bg-neutral-50"
                >
                  Retry with Normal Profile
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-3 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800"
                >
                  Return to Cart
                </button>
              </div>
            </div>
          )}

          {/* STEP 3B: Review Installment Plan (Matching Diagram: Eligible -> Generate Installment Plan -> Accept Plan) */}
          {step === 'REVIEW_INSTALLMENT_PLAN' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <span className="text-xs text-emerald-700 font-semibold block">Credit Assessment Passed</span>
                  <span className="text-xs text-neutral-500">
                    Bukra Score: <strong className="text-neutral-900">{evalResult?.score || 740}</strong> · Approved Limit: <strong className="text-neutral-900">{evalResult?.approvedLimit.toLocaleString() || '500,000'} RWF</strong>
                  </span>
                </div>
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              {/* Tenor selector (3 vs 4 months) */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-2">
                  Choose Installment Schedule (0% Interest):
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTenorMonths(3)}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      tenorMonths === 3
                        ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-neutral-900 block">3 Monthly Payments</span>
                    <span className="text-sm font-extrabold text-emerald-700 tabular-nums">
                      {Math.ceil(totalOrderAmount / 3).toLocaleString()} <span className="text-xs font-normal">RWF/mo</span>
                    </span>
                    <span className="text-[10px] text-neutral-500 block mt-1">Recommended for everyday orders</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTenorMonths(4)}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      tenorMonths === 4
                        ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-neutral-900 block">4 Monthly Payments</span>
                    <span className="text-sm font-extrabold text-emerald-700 tabular-nums">
                      {Math.ceil(totalOrderAmount / 4).toLocaleString()} <span className="text-xs font-normal">RWF/mo</span>
                    </span>
                    <span className="text-[10px] text-neutral-500 block mt-1">Lower monthly burden</span>
                  </button>
                </div>
              </div>

              {/* Visual Installment Schedule Breakdown */}
              <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl">
                <span className="text-xs font-semibold text-neutral-800 block mb-2">
                  Repayment Schedule Breakdown:
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-neutral-200/60">
                    <span className="text-neutral-600 font-medium">Payment 1 (Today upon checkout):</span>
                    <span className="font-bold text-neutral-900 tabular-nums">
                      {Math.ceil(totalOrderAmount / tenorMonths).toLocaleString()} RWF
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-neutral-200/60">
                    <span className="text-neutral-600">Payment 2 (In 30 days):</span>
                    <span className="font-semibold text-neutral-800 tabular-nums">
                      {Math.ceil(totalOrderAmount / tenorMonths).toLocaleString()} RWF
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-neutral-200/60">
                    <span className="text-neutral-600">Payment 3 (In 60 days):</span>
                    <span className="font-semibold text-neutral-800 tabular-nums">
                      {Math.ceil(totalOrderAmount / tenorMonths).toLocaleString()} RWF
                    </span>
                  </div>
                  {tenorMonths === 4 && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-neutral-600">Payment 4 (In 90 days):</span>
                      <span className="font-semibold text-neutral-800 tabular-nums">
                        {Math.ceil(totalOrderAmount / tenorMonths).toLocaleString()} RWF
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 text-neutral-900 font-bold border-t border-neutral-300">
                    <span>Total You Pay:</span>
                    <span className="text-emerald-700 tabular-nums">
                      {totalOrderAmount.toLocaleString()} RWF (0 RWF Interest)
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirmPlan}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Accept Plan & Pay 1st Installment ({Math.ceil(totalOrderAmount / tenorMonths).toLocaleString()} RWF)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 4: MoMo Push USSD Simulation (Matching Sequence: processPayment -> MoMo API) */}
          {step === 'MOMO_PIN_PROMPT' && (
            <form onSubmit={handleProcessMoMoPayment} className="space-y-4">
              <div className="text-center py-2">
                <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Phone className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-neutral-900">
                  MTN Mobile Money USSD Prompt
                </h4>
                <p className="text-xs text-neutral-500">
                  Simulated push sent to <strong className="text-neutral-900">{phoneNumber}</strong>
                </p>
              </div>

              <div className="p-4 bg-neutral-900 text-neutral-100 rounded-xl font-mono text-xs space-y-2">
                <div className="text-amber-400 font-bold text-sm">
                  MTN MoMo - Push Authorization
                </div>
                <div className="text-neutral-300">
                  Pay Bukra Rwanda: {Math.ceil(totalOrderAmount / tenorMonths).toLocaleString()} RWF
                  (Downpayment for Order #{cart[0]?.product.name.slice(0, 10)}...)
                </div>
                <div className="pt-2 border-t border-neutral-700">
                  <label className="text-[11px] text-neutral-400 block mb-1">
                    Enter MoMo PIN to Authorize:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      maxLength={5}
                      required
                      placeholder="****"
                      value={momoPin}
                      onChange={(e) => setMomoPin(e.target.value)}
                      className="bg-neutral-800 text-white text-lg tracking-widest px-3 py-1.5 rounded border border-neutral-600 focus:outline-none focus:border-amber-400 w-32"
                    />
                    <button
                      type="button"
                      onClick={() => setMomoPin('1234')}
                      className="text-[11px] text-amber-400 hover:text-amber-300 underline self-center"
                    >
                      Fill Demo PIN
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={momoPin.length < 4}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-300 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Confirm & Authorize MoMo Payment</span>
              </button>
            </form>
          )}

          {/* STEP 5: Success & Receipt (Matching Diagram: Confirm Order -> Notify Merchant & Receipt) */}
          {step === 'SUCCESS' && createdOrder && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-neutral-900">
                  Order #{createdOrder.orderID} Confirmed!
                </h4>
                <p className="text-xs text-neutral-500">
                  Installment Plan #{createdPlan?.planID} is now ACTIVE.
                </p>
              </div>

              {/* Receipt Card */}
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3 text-xs">
                <div className="flex justify-between pb-2 border-b border-neutral-200 font-semibold text-neutral-900">
                  <span>Customer Receipt</span>
                  <span className="text-emerald-700">PAID VIA BUKRA MOMO</span>
                </div>

                <div className="space-y-1.5 text-neutral-600">
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span className="font-medium text-neutral-900">{createdOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MoMo Reference:</span>
                    <span className="font-mono text-neutral-900">
                      {createdPlan?.schedule[0]?.momoTransactionId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>1st Installment Paid:</span>
                    <span className="font-bold text-neutral-900 tabular-nums">
                      {createdPlan?.downPayment.toLocaleString()} RWF
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining Balance:</span>
                    <span className="font-bold text-neutral-900 tabular-nums">
                      {createdPlan?.remainingBalance.toLocaleString()} RWF (Payable over {tenorMonths - 1} months)
                    </span>
                  </div>
                </div>

                {/* Merchant Upfront Settlement Notification Note */}
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-900">
                  <div className="font-semibold flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-blue-700" />
                    <span>Merchant Payout Dispatched by Bukra:</span>
                  </div>
                  <div className="mt-1 flex justify-between text-blue-800">
                    <span>Net Upfront Settlement (100% - 5.5% discount):</span>
                    <span className="font-bold tabular-nums">
                      {createdOrder.merchantPayoutAmount.toLocaleString()} RWF
                    </span>
                  </div>
                  <p className="text-[10px] text-blue-700/80 mt-0.5">
                    Kigali Horizon Goods Ltd receives full payout immediately. Bukra manages buyer installment collection.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg shadow-sm transition-all text-xs"
              >
                Close & View in Customer Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
