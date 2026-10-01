'use client';
import React from 'react';
import Grid from '@mui/material/Grid';
import { useRoi } from '@/lib/roi/context';
import { formatCurrency, formatCurrencyCompact, formatRoi, formatDays } from '@/lib/roi/formatters';
import RoiMetricCard from './RoiMetricCard';

export default function RoiHero() {
  const { state: { results } } = useRoi();
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 6, md: 3 }}>
        <RoiMetricCard
          label="Annual Benefit"
          value={formatCurrency(results.totalAnnualBenefit)}
          accent
          large
        />
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <RoiMetricCard
          label="Year 1 ROI"
          value={formatRoi(results.roi)}
          accent
          large
        />
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <RoiMetricCard
          label="Working Capital"
          value={formatCurrencyCompact(results.workingCapitalUnlocked)}
          sublabel="Unlocked"
        />
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <RoiMetricCard
          label="DSO Reduction"
          value={formatDays(results.dsoReductionDays)}
          sublabel={`from ${results.dsoReductionDays > 0 ? (results.dsoReductionDays + results.redeployedDsoReductionDays).toFixed(1) : '0'} total days`}
        />
      </Grid>
    </Grid>
  );
}
