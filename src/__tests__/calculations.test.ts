import { describe, it, expect } from 'vitest';
import { calculateRoi } from '../lib/roi/calculations';
import { DEFAULT_INPUTS } from '../lib/roi/defaults';

const EPSILON = 1; // $1 tolerance for floating point

function near(actual: number, expected: number, tolerance = EPSILON) {
  expect(Math.abs(actual - expected)).toBeLessThan(tolerance);
}

describe('Default Excel scenario', () => {
  const r = calculateRoi(DEFAULT_INPUTS);

  it('averageInvoiceValue = $3,333.33', () => near(r.averageInvoiceValue, 3333.33, 0.01));
  it('averageInvoicesPerPayment = 3', () => expect(r.averageInvoicesPerPayment).toBe(3));
  it('averagePaymentValue = $10,000', () => near(r.averagePaymentValue, 10000, 0.01));
  it('dailyAverageSales ≈ $98,630.14', () => near(r.dailyAverageSales, 98630.14, 0.01));

  it('dsoReductionDays = 11.6', () => near(r.dsoReductionDays, 11.6, 0.001));
  it('workingCapitalUnlocked ≈ $1,144,110', () => near(r.workingCapitalUnlocked, 1144109.59, 0.5));
  it('interestRealized ≈ $80,088', () => near(r.interestRealized, 80087.67, 0.5));

  it('current CC count = 36', () => near(r.currentPaymentMix.creditCard.count, 36, 0.001));
  it('current check count = 1692', () => near(r.currentPaymentMix.check.count, 1692, 0.001));
  it('current offlineACH count = 1872', () => near(r.currentPaymentMix.offlineAch.count, 1872, 0.001));
  it('current total count = 3600', () => near(r.currentPaymentMix.total.count, 3600, 0.001));
  it('current CC value = $360,000', () => near(r.currentPaymentMix.creditCard.value, 360000));
  it('current check value = $16,920,000', () => near(r.currentPaymentMix.check.value, 16920000));
  it('current ACH value = $18,720,000', () => near(r.currentPaymentMix.offlineAch.value, 18720000));
  it('current total value = $36,000,000', () => near(r.currentPaymentMix.total.value, 36000000));

  it('future VP card count ≈ 374.4', () => near(r.futurePaymentMix.versapayCard.count, 374.4, 0.01));
  it('future check count ≈ 1015.2', () => near(r.futurePaymentMix.check.count, 1015.2, 0.01));
  it('future offline ACH count ≈ 1123.2', () => near(r.futurePaymentMix.offlineAch.count, 1123.2, 0.01));
  it('future VP ACH count ≈ 1087.2', () => near(r.futurePaymentMix.versapayAch.count, 1087.2, 0.01));
  it('future total count = 3600', () => near(r.futurePaymentMix.total.count, 3600, 0.01));
  it('future total value = $36,000,000', () => near(r.futurePaymentMix.total.value, 36000000, 1));

  it('creditCardProcessingSavings = $1,800', () => near(r.benefits.creditCardProcessingSavings, 1800));
  it('surchargeSavings = $10,800', () => near(r.benefits.surchargeSavings, 10800));
  it('laborSavings = $240,000', () => near(r.benefits.laborSavings, 240000));
  it('avoidedHiring = $50,000', () => expect(r.benefits.avoidedHiring).toBe(50000));
  it('systemDecommissioning = $4,725', () => expect(r.benefits.systemDecommissioning).toBe(4725));
  it('writeoffReduction = $39,600', () => near(r.benefits.writeoffReduction, 39600));
  it('revenueUplift = $180,000', () => near(r.benefits.revenueUplift, 180000));
  it('workingCapitalInterest ≈ $80,088', () => near(r.benefits.workingCapitalInterest, 80087.67, 0.5));

  it('totalAnnualBenefit ≈ $631,760', () => near(r.totalAnnualBenefit, 631759.59, 1));
  it('implementationCost = $150,000', () => expect(r.implementationCost).toBe(150000));
  it('roi ≈ 421%', () => near(r.roi, 4.2117, 0.001));
});

describe('Payment mix validation', () => {
  it('payment mix totals 1 in defaults', () => {
    const m = DEFAULT_INPUTS.paymentMix;
    expect(m.creditCard + m.check + m.offlineAch).toBeCloseTo(1, 5);
  });

  it('future total count equals current total count', () => {
    const r = calculateRoi(DEFAULT_INPUTS);
    near(r.futurePaymentMix.total.count, r.currentPaymentMix.total.count, 0.01);
  });
});

describe('100% online conversion', () => {
  const inputs = { ...DEFAULT_INPUTS, checkToOnlinePct: 1, achToOnlinePct: 1 };
  const r = calculateRoi(inputs);

  it('future check count = 0', () => expect(r.futurePaymentMix.check.count).toBe(0));
  it('future offline ACH count = 0', () => expect(r.futurePaymentMix.offlineAch.count).toBe(0));
  it('future total still = 3600', () => near(r.futurePaymentMix.total.count, 3600, 0.01));
});

describe('0% online conversion', () => {
  const inputs = { ...DEFAULT_INPUTS, checkToOnlinePct: 0, achToOnlinePct: 0 };
  const r = calculateRoi(inputs);

  it('future check count = current check count', () => near(r.futurePaymentMix.check.count, r.currentPaymentMix.check.count, 0.01));
  it('future VP ACH count = 0', () => expect(r.futurePaymentMix.versapayAch.count).toBe(0));
});

describe('Edge cases', () => {
  it('zero implementation cost produces 0 ROI (not NaN)', () => {
    const r = calculateRoi({ ...DEFAULT_INPUTS, implementationCost: 0 });
    expect(r.roi).toBe(0);
  });

  it('changing annual invoice value scales benefits', () => {
    const r2x = calculateRoi({ ...DEFAULT_INPUTS, annualInvoiceValue: 72_000_000 });
    near(r2x.benefits.revenueUplift, 360000);
    near(r2x.benefits.surchargeSavings, 21600);
  });

  it('changing DSO scales working capital', () => {
    const r = calculateRoi({ ...DEFAULT_INPUTS, dso: 30 });
    near(r.workingCapitalUnlocked, 591780.82, 1);
  });

  it('changing cost of capital scales interest realized', () => {
    const r = calculateRoi({ ...DEFAULT_INPUTS, costOfCapital: 0.10 });
    near(r.interestRealized, 114410.96, 1);
  });

  it('changing FTE expense scales labor savings', () => {
    const r = calculateRoi({ ...DEFAULT_INPUTS, fteExpense: 100_000 });
    near(r.benefits.laborSavings, 320000);
  });

  it('changing payment mix recalculates CC/check/ACH values', () => {
    const r = calculateRoi({
      ...DEFAULT_INPUTS,
      paymentMix: { creditCard: 0.10, check: 0.40, offlineAch: 0.50 },
    });
    near(r.currentPaymentMix.creditCard.value, 3_600_000);
    near(r.currentPaymentMix.check.value, 14_400_000);
    near(r.currentPaymentMix.offlineAch.value, 18_000_000);
  });
});
