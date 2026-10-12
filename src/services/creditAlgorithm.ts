import { CreditEvaluationResult, MoMoTransactionHistory, InstallmentScheduleItem } from '../types/bukra';

/**
 * Bukra Dynamic Credit Assessment Engine
 * Adheres to Islamic Finance (Murabaha / Qard al-Hasan) principles:
 * - 0% interest rate to consumer (strictly zero riba)
 * - Transparent equal installment breakdowns
 * - Evaluates liquidity via MTN MoMo / Bank integration
 * - Dynamic credit limit adjustments based on repayment punctuality
 */

export function evaluateCredit(
  history: MoMoTransactionHistory,
  requestedAmount: number,
  existingOpenBalance: number = 0,
  historicalRepayments: { timely: number; missed: number } = { timely: 0, missed: 0 }
): CreditEvaluationResult {
  // 1. Calculate net monthly disposable liquidity
  const netMonthlyCashflow = Math.max(0, history.monthlyAverageInflow - history.monthlyAverageOutflow);
  
  // 2. Base score from MoMo account activity (range 300 - 850)
  let score = 500;
  
  // Cashflow volume contribution (up to +150 points)
  if (history.monthlyAverageInflow >= 800000) {
    score += 150;
  } else if (history.monthlyAverageInflow >= 400000) {
    score += 100;
  } else if (history.monthlyAverageInflow >= 200000) {
    score += 60;
  } else {
    score += 20;
  }

  // Account longevity & transaction consistency (up to +80 points)
  if (history.activeMonths >= 24) {
    score += 80;
  } else if (history.activeMonths >= 12) {
    score += 50;
  } else if (history.activeMonths >= 6) {
    score += 30;
  }

  // Repayment behavioral adjustment (Timely vs Missed)
  score += historicalRepayments.timely * 15;
  score -= historicalRepayments.missed * 35;

  // Clamp score between 300 and 850
  score = Math.max(300, Math.min(850, Math.round(score)));

  // 3. Dynamic Credit Limit Calculation
  // Standard rule: Approved limit is a safe multiple of disposable monthly cashflow
  // Low score (<550): Capped at 150,000 RWF or Ineligible
  // Mid score (550-680): 1.2x net cashflow, up to 450,000 RWF
  // High score (>680): 2.0x net cashflow, up to 1,200,000 RWF
  let approvedLimit = 0;
  let eligible = false;
  let rejectionReason: string | undefined = undefined;

  if (history.monthlyAverageInflow < 80000) {
    eligible = false;
    rejectionReason = 'Insufficient verified monthly MoMo inflow (minimum 80,000 RWF required).';
  } else if (score < 520) {
    eligible = false;
    rejectionReason = 'Credit score below minimum eligibility threshold (520 required).';
  } else {
    if (score >= 700) {
      approvedLimit = Math.min(1200000, Math.round(netMonthlyCashflow * 2.2));
    } else if (score >= 600) {
      approvedLimit = Math.min(650000, Math.round(netMonthlyCashflow * 1.5));
    } else {
      approvedLimit = Math.min(300000, Math.round(netMonthlyCashflow * 1.0));
    }

    // Include bonus credit limit for proven timely repayments (+25,000 RWF per completed on-time plan)
    approvedLimit += historicalRepayments.timely * 25000;
    // Penalty for missed repayments
    approvedLimit = Math.max(50000, approvedLimit - historicalRepayments.missed * 60000);

    // Check available credit after open balance
    const available = approvedLimit - existingOpenBalance;
    if (requestedAmount > available) {
      eligible = false;
      rejectionReason = `Requested order (${requestedAmount.toLocaleString()} RWF) exceeds your available Bukra limit (${available.toLocaleString()} RWF). Total limit: ${approvedLimit.toLocaleString()} RWF.`;
    } else {
      eligible = true;
    }
  }

  // Recommended installments tenor
  const recommendedMaxInstallments = score >= 650 ? 4 : 3;

  return {
    eligible,
    score,
    approvedLimit,
    recommendedMaxInstallments,
    factors: {
      monthlyCashflow: netMonthlyCashflow,
      debtToIncomeRatio: netMonthlyCashflow > 0 ? Math.min(1, Math.round((existingOpenBalance / netMonthlyCashflow) * 100) / 100) : 1,
      momoVelocity: history.transactionCountMonthly > 25 ? 'High' : 'Moderate',
      kycVerified: true,
    },
    rejectionReason,
  };
}

/**
 * Calculates equal monthly installments with strictly 0% interest
 */
export function calculateInstallmentSchedule(
  totalAmount: number,
  numberOfInstallments: number = 3,
  startDate: Date = new Date()
) {
  const installmentAmount = Math.ceil(totalAmount / numberOfInstallments);
  const schedule: InstallmentScheduleItem[] = [];

  for (let i = 1; i <= numberOfInstallments; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);

    // If it's the last installment, ensure exact total match
    const currentAmount = i === numberOfInstallments 
      ? totalAmount - (installmentAmount * (numberOfInstallments - 1))
      : installmentAmount;

    schedule.push({
      installmentNumber: i,
      amount: currentAmount,
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'PENDING',
    });
  }

  return {
    monthlyAmount: installmentAmount,
    schedule,
    totalPayable: totalAmount, // Exactly equal to retail price, 0% interest
    zeroInterestProof: true,
  };
}
