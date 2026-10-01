import type { RoiInputs } from './types';

export interface ValidationErrors {
  paymentMixTotal?: string;
  annualInvoiceValue?: string;
  monthlyInvoiceVolume?: string;
  monthlyPaymentVolume?: string;
  implementationCost?: string;
}

export function validateInputs(i: RoiInputs): ValidationErrors {
  const errors: ValidationErrors = {};

  const mixTotal = i.paymentMix.creditCard + i.paymentMix.check + i.paymentMix.offlineAch;
  if (Math.abs(mixTotal - 1) > 0.001) {
    errors.paymentMixTotal = `Payment mix must total 100% (currently ${(mixTotal * 100).toFixed(1)}%)`;
  }

  if (i.annualInvoiceValue <= 0)    errors.annualInvoiceValue    = 'Must be greater than 0';
  if (i.monthlyInvoiceVolume <= 0)  errors.monthlyInvoiceVolume  = 'Must be greater than 0';
  if (i.monthlyPaymentVolume <= 0)  errors.monthlyPaymentVolume  = 'Must be greater than 0';
  if (i.implementationCost < 0)     errors.implementationCost    = 'Must be 0 or greater';

  return errors;
}

export function isValid(errors: ValidationErrors): boolean {
  return Object.keys(errors).length === 0;
}
