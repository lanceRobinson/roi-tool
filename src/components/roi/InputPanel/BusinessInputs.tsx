'use client';
import React from 'react';
import Box from '@mui/material/Box';
import { useRoi } from '@/lib/roi/context';
import CurrencyInput from '../common/CurrencyInput';
import NumberInput from '../common/NumberInput';
import PercentageInput from '../common/PercentageInput';

export default function BusinessInputs() {
  const { state: { inputs }, setInputs } = useRoi();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <CurrencyInput label="Annual Invoice Value" value={inputs.annualInvoiceValue} onChange={v => setInputs({ annualInvoiceValue: v })} min={1} />
      <NumberInput label="Monthly Invoice Volume" value={inputs.monthlyInvoiceVolume} onChange={v => setInputs({ monthlyInvoiceVolume: v })} min={1} />
      <NumberInput label="Monthly Payment Volume" value={inputs.monthlyPaymentVolume} onChange={v => setInputs({ monthlyPaymentVolume: v })} min={1} />
      <NumberInput label="Cash Application FTE" value={inputs.cashApplicationFte} onChange={v => setInputs({ cashApplicationFte: v })} decimals={1} />
      <NumberInput label="Collections FTE" value={inputs.collectionsFte} onChange={v => setInputs({ collectionsFte: v })} decimals={1} />
      <CurrencyInput label="Avg FTE Expense & Benefits" value={inputs.fteExpense} onChange={v => setInputs({ fteExpense: v })} min={1} />
      <NumberInput label="DSO (days)" value={inputs.dso} onChange={v => setInputs({ dso: v })} min={0} />
      <PercentageInput label="Annual Growth Rate" value={inputs.growthRate} onChange={v => setInputs({ growthRate: v })} />
    </Box>
  );
}
