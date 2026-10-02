'use client';
import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useRoi } from '@/lib/roi/context';
import PercentageInput from '../common/PercentageInput';
import CurrencyInput from '../common/CurrencyInput';
import InputSlider from '../common/InputSlider';

export default function FinancialInputs() {
  const { state: { inputs }, setInputs } = useRoi();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 6 }}>
          <PercentageInput label="Cost of Capital" value={inputs.costOfCapital} onChange={v => setInputs({ costOfCapital: v })} max={0.5} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <PercentageInput label="Debt-to-AR Ratio" value={inputs.debtToArRatio} onChange={v => setInputs({ debtToArRatio: v })} max={0.5} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <PercentageInput label="Surcharge Rate" value={inputs.surchargeRate} onChange={v => setInputs({ surchargeRate: v })} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <PercentageInput label="CC Processing Savings" value={inputs.creditCardProcessingSavings} onChange={v => setInputs({ creditCardProcessingSavings: v })} max={0.1} />
        </Grid>
      </Grid>
      <InputSlider label="Write-Off Recovery Impact" value={inputs.writeoffRecoveryPct} onChange={v => setInputs({ writeoffRecoveryPct: v })} step={0.01} />
      <InputSlider label="Revenue / Churn Uplift" value={inputs.revenueUpliftPct} onChange={v => setInputs({ revenueUpliftPct: v })} step={0.001} max={0.05}
        formatValue={v => `${(v * 100).toFixed(2)}%`} />
      <CurrencyInput label="Software (Annual Subscription)" value={inputs.softwareCost} onChange={v => setInputs({ softwareCost: v })} />
      <CurrencyInput label="Implementation (One-Time Fee)" value={inputs.implementationCost} onChange={v => setInputs({ implementationCost: v })} />
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 6 }}>
          <CurrencyInput label="Avoided Hiring Cost" value={inputs.avoidedHiringCost} onChange={v => setInputs({ avoidedHiringCost: v })} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <CurrencyInput label="System Decommission" value={inputs.systemDecommissionCost} onChange={v => setInputs({ systemDecommissionCost: v })} />
        </Grid>
      </Grid>
    </Box>
  );
}
