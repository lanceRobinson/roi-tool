import type { RoiInputs } from './types';

export const DEFAULT_INPUTS: RoiInputs = {
  // Business Profile — K6:K13
  annualInvoiceValue:     36_000_000,
  monthlyInvoiceVolume:   900,
  monthlyPaymentVolume:   300,
  cashApplicationFte:     3,
  collectionsFte:         1,
  fteExpense:             75_000,
  dso:                    58,
  growthRate:             0.20,

  // Payment Mix — H17:H19
  paymentMix: {
    creditCard: 0.01,
    check:      0.47,
    offlineAch: 0.52,
    onlineAch:  0,
  },

  // Versapay Impact — K34:K42
  checkToOnlinePct:                0.40,
  achToOnlinePct:                  0.40,
  onlineMatchRate:                 1.00,
  offlineMatchRate:                0.90,
  portalLoginRate:                 0.80,
  portalPaymentRate:               0.50,
  collectionsEfficiencyGain:       0.50,
  offlineToOnlineDsoReduction:     0.20,  // K41
  redeployedHeadcountDsoReduction: 0.05,  // K42

  // Financial Assumptions — K31:K33, C5, C20, C21
  costOfCapital:              0.07,
  debtToArRatio:              0.011,
  surchargeRate:              0.03,
  creditCardProcessingSavings: 0.005,
  writeoffRecoveryPct:        0.10,
  revenueUpliftPct:           0.005,
  softwareCost:               100_000,
  implementationCost:          50_000,

  // Editable line items (hardcoded in Excel)
  avoidedHiringCost:       50_000,
  systemDecommissionCost:  4_725,
};
