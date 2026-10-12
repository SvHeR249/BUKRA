import React, { useState } from 'react';
import { Customer } from '../types/bukra';
import { evaluateCredit } from '../services/creditAlgorithm';
import { Cpu, Sliders, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';

interface CreditAlgorithmSandboxProps {
  customer: Customer;
  onApplyToCustomer: (newLimit: number, newScore: number) => void;
}

export const CreditAlgorithmSandbox: React.FC<CreditAlgorithmSandboxProps> = ({
  customer,
  onApplyToCustomer,
}) => {
  const [inflow, setInflow] = useState(520000);
  const [outflow, setOutflow] = useState(310000);
  const [activeMonths, setActiveMonths] = useState(18);
  const [timelyPayments, setTimelyPayments] = useState(customer.successfulRepaymentsCount);
  const [missedPayments, setMissedPayments] = useState(customer.missedRepaymentsCount);
  const [testAmount, setTestAmount] = useState(240000);
  const [appliedNotice, setAppliedNotice] = useState(false);

  // Compute live assessment
  const simulatedHistory = {
    phone: customer.momoNumber,
    monthlyAverageInflow: inflow,
    monthlyAverageOutflow: outflow,
    transactionCountMonthly: 35,
    activeMonths,
    recentTransactions: []
  };

  const evalResult = evaluateCredit(
    simulatedHistory,
    testAmount,
    0,
    { timely: timelyPayments, missed: missedPayments }
  );

  const handleApply = () => {
    onApplyToCustomer(evalResult.approvedLimit, evalResult.score);
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 4000);
  };

  const loadPreset = (preset: 'kigali_pro' | 'first_time' | 'low_liquidity' | 'struggling') => {
    if (preset === 'kigali_pro') {
      setInflow(850000);
      setOutflow(400000);
      setActiveMonths(24);
      setTimelyPayments(5);
      setMissedPayments(0);
    } else if (preset === 'first_time') {
      setInflow(280000);
      setOutflow(190000);
      setActiveMonths(8);
      setTimelyPayments(0);
      setMissedPayments(0);
    } else if (preset === 'low_liquidity') {
      setInflow(75000);
      setOutflow(68000);
      setActiveMonths(4);
      setTimelyPayments(0);
      setMissedPayments(0);
    } else if (preset === 'struggling') {
      setInflow(320000);
      setOutflow(290000);
      setActiveMonths(14);
      setTimelyPayments(1);
      setMissedPayments(2);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
            <span>MoMo Liquidity & Risk Engine</span>
            <span aria-hidden="true">·</span>
            <span>Rwandan Financial Data Assessment</span>
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-amber-600" />
            Bukra Dynamic Credit Scoring Simulator
          </h1>
          <p className="text-xs text-neutral-600 mt-1 max-w-2xl leading-relaxed">
            Test how MTN MoMo transaction velocity, net liquidity, and repayment punctuality dynamically reshape buyer creditworthiness without charging interest.
          </p>
        </div>

        {/* Preset quick buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => loadPreset('kigali_pro')}
            className="px-2.5 py-1.5 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg transition-colors"
          >
            Salaried Professional
          </button>
          <button
            onClick={() => loadPreset('first_time')}
            className="px-2.5 py-1.5 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg transition-colors"
          >
            First-Time Buyer
          </button>
          <button
            onClick={() => loadPreset('struggling')}
            className="px-2.5 py-1.5 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg transition-colors"
          >
            Prior Missed Repayments
          </button>
          <button
            onClick={() => loadPreset('low_liquidity')}
            className="px-2.5 py-1.5 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg transition-colors"
          >
            Low Inflow (Ineligible)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Parameter Sliders (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-neutral-600" />
            MoMo Financial Assessment Inputs
          </h2>

          {/* Inflow Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-neutral-700 mb-1.5">
              <span>Monthly MoMo Inflow (Salary/Sales):</span>
              <span className="font-mono text-emerald-700">{inflow.toLocaleString()} RWF</span>
            </div>
            <input
              type="range"
              min={50000}
              max={1500000}
              step={25000}
              value={inflow}
              onChange={(e) => setInflow(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 mt-0.5">
              <span>50,000 RWF</span>
              <span>1,500,000 RWF</span>
            </div>
          </div>

          {/* Outflow Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-neutral-700 mb-1.5">
              <span>Monthly MoMo Outflow (Living Expenses):</span>
              <span className="font-mono text-neutral-800">{outflow.toLocaleString()} RWF</span>
            </div>
            <input
              type="range"
              min={30000}
              max={1200000}
              step={20000}
              value={outflow}
              onChange={(e) => setOutflow(Number(e.target.value))}
              className="w-full accent-neutral-700"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 mt-0.5">
              <span>30,000 RWF</span>
              <span>1,200,000 RWF</span>
            </div>
          </div>

          {/* Net Liquidity Readout */}
          <div className="p-3 bg-neutral-50 rounded-xl text-xs flex justify-between items-center border border-neutral-200">
            <span className="text-neutral-600">Calculated Net Monthly Liquidity:</span>
            <span className="font-bold text-neutral-900 tabular-nums">
              {Math.max(0, inflow - outflow).toLocaleString()} RWF
            </span>
          </div>

          {/* Account Longevity Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-neutral-700 mb-1.5">
              <span>MoMo Account History Longevity:</span>
              <span className="font-mono text-neutral-800">{activeMonths} Months</span>
            </div>
            <input
              type="range"
              min={1}
              max={36}
              value={activeMonths}
              onChange={(e) => setActiveMonths(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Dynamic Repayment Behavior Adjustment Sliders */}
          <div className="pt-4 border-t border-neutral-200 space-y-4">
            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
              Repayment Behavior (Dynamic Limit Modifiers)
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-emerald-800 block mb-1">
                  Timely Repayments (+25k limit each):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={timelyPayments}
                    onChange={(e) => setTimelyPayments(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-1.5 text-sm font-bold border border-neutral-300 rounded-lg text-emerald-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-rose-800 block mb-1">
                  Missed Repayments (-60k penalty each):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={missedPayments}
                    onChange={(e) => setMissedPayments(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-1.5 text-sm font-bold border border-neutral-300 rounded-lg text-rose-700 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Test Order Amount */}
          <div className="pt-2">
            <label className="text-xs font-semibold text-neutral-700 block mb-1">
              Sample Order Checkout Request:
            </label>
            <input
              type="number"
              value={testAmount}
              onChange={(e) => setTestAmount(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm font-mono border border-neutral-300 rounded-lg"
              placeholder="240000"
            />
          </div>
        </div>

        {/* Right: Real-time Evaluation Results (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-neutral-900">
              Live Evaluation Verdict
            </h2>

            {/* Eligibility Banner */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              evalResult.eligible
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              {evalResult.eligible ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs">
                <span className="font-bold text-sm block">
                  {evalResult.eligible ? 'APPROVED for Bukra BNPL' : 'APPLICATION REJECTED'}
                </span>
                <p className="mt-0.5 leading-relaxed">
                  {evalResult.eligible
                    ? `Eligible for interest-free financing up to ${evalResult.recommendedMaxInstallments} monthly installments.`
                    : evalResult.rejectionReason}
                </p>
              </div>
            </div>

            {/* Calculated Metrics */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                <span className="text-neutral-600">Calculated Bukra Score:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold text-neutral-900 tabular-nums">
                    {evalResult.score}
                  </span>
                  <span className="text-neutral-400">/ 850</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                <span className="text-neutral-600">Approved Credit Limit:</span>
                <span className="text-base font-extrabold text-emerald-700 tabular-nums">
                  {evalResult.approvedLimit.toLocaleString()} RWF
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                <span className="text-neutral-600">Max Tenor Permitted:</span>
                <span className="font-bold text-neutral-800">
                  {evalResult.recommendedMaxInstallments} Months (0% Interest)
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-neutral-600">Islamic Finance Surcharge:</span>
                <span className="font-bold text-emerald-700">
                  0 RWF (Riba-free)
                </span>
              </div>
            </div>

            {/* Apply Button */}
            {appliedNotice && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Applied to live customer profile ({evalResult.approvedLimit.toLocaleString()} RWF)!</span>
              </div>
            )}

            <button
              onClick={handleApply}
              className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <span>Apply Parameters to Live Customer Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Sharia Governance Note */}
          <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-xl p-4 text-xs text-emerald-950">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Zero-Riba Mathematical Proof</span>
            </div>
            <p className="text-[11px] text-emerald-900/80 leading-relaxed">
              Unlike traditional predatory microloans in East Africa, Bukra charges 0% interest and 0% penalty interest. Total repayments equal the exact merchant retail price. Revenue is funded solely by merchant volume discount fees (5.5%).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
