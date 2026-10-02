export interface PaymentMix {
  creditCard: number; // fraction 0–1
  check: number;
  offlineAch: number;
  onlineAch: number;
}

export interface RoiInputs {
  // Identity
  businessName: string;

  // Business Profile
  annualInvoiceValue: number;
  monthlyInvoiceVolume: number;
  monthlyPaymentVolume: number;
  cashApplicationFte: number;
  collectionsFte: number;
  fteExpense: number;
  dso: number;
  growthRate: number;

  // Payment Mix (fractions, must sum to 1)
  paymentMix: PaymentMix;

  // Versapay Impact
  checkToOnlinePct: number;
  achToOnlinePct: number;
  onlineMatchRate: number;
  offlineMatchRate: number;
  portalLoginRate: number;
  portalPaymentRate: number;
  collectionsEfficiencyGain: number;
  offlineToOnlineDsoReduction: number;
  redeployedHeadcountDsoReduction: number;

  // Financial Assumptions
  costOfCapital: number;
  debtToArRatio: number;
  surchargeRate: number;
  creditCardProcessingSavings: number;
  writeoffRecoveryPct: number;
  revenueUpliftPct: number;
  softwareCost: number;        // annual subscription
  implementationCost: number;  // one-time fee

  // Additional editable line items (hardcoded in Excel)
  avoidedHiringCost: number;
  systemDecommissionCost: number;
}

export interface PaymentMixDetail {
  count: number;
  value: number;
  pct: number;
}

export interface CurrentPaymentMix {
  creditCard: PaymentMixDetail;
  check: PaymentMixDetail;
  offlineAch: PaymentMixDetail;
  onlineAch: PaymentMixDetail;
  total: { count: number; value: number };
}

export interface FuturePaymentMix {
  versapayCard: PaymentMixDetail;
  check: PaymentMixDetail;
  offlineAch: PaymentMixDetail;
  versapayAch: PaymentMixDetail;
  total: { count: number; value: number };
}

export interface RoiBenefits {
  creditCardProcessingSavings: number;  // C5*J17
  surchargeSavings: number;             // C7*J17
  laborSavings: number;                 // D9
  avoidedHiring: number;                // D11
  systemDecommissioning: number;        // D13
  strategicCollections: number;         // D15
  workingCapitalRedeployed: number;     // D17+D18 (DSO reduction from redeployment)
  writeoffReduction: number;            // D19
  revenueUplift: number;                // D21
  workingCapitalInterest: number;       // D23 (DSO reduction from online shift)
}

export interface RoiResults {
  // Derived metrics
  averageInvoiceValue: number;
  averageInvoicesPerPayment: number;
  averagePaymentValue: number;
  dailyAverageSales: number;

  // DSO / Working Capital
  dsoReductionDays: number;
  workingCapitalUnlocked: number;
  interestRealized: number;
  redeployedDsoReductionDays: number;
  redeployedWorkingCapital: number;
  redeployedInterest: number;

  // Payment mix
  currentPaymentMix: CurrentPaymentMix;
  futurePaymentMix: FuturePaymentMix;

  // Benefits
  benefits: RoiBenefits;

  // Totals
  totalAnnualBenefit: number;
  softwareCost: number;
  implementationCost: number;  // one-time fee
  totalInvestment: number;     // softwareCost + implementationCost, used as ROI denominator

  // ROI — defined as totalAnnualBenefit / totalInvestment (matches Excel, not conventional NPV ROI)
  roi: number;
}
